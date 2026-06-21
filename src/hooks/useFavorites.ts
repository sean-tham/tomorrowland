"use client";
import { useState, useEffect, useCallback } from "react";
import { LINEUP } from "@/data/lineup";

const STORAGE_KEY    = "tml2026w2-favorites";
const MIGRATED_KEY   = "tml2026w2-migrated-v2"; // bump when lineup changes again

// Build a lookup: "artist-normalized-date" → new set ID
// Only stores the first match per artist+day, which covers the common case.
function buildNewLookup(): Map<string, string> {
  const map = new Map<string, string>();
  LINEUP.forEach(set => {
    const artistKey = set.artist.toLowerCase().replace(/\s+/g, "-");
    const key = `${artistKey}-${set.date}`;
    if (!map.has(key)) map.set(key, set.id);
  });
  return map;
}

// Extract artist-key and date from an old ID.
// Old IDs have format: {artist-normalized}-{YYYY-MM-DD}-{HH:MM}
function parseOldId(id: string): { artistKey: string; date: string } | null {
  const match = id.match(/^(.+)-(2026-07-2[456])-[\d:]+$/);
  if (!match) return null;
  return { artistKey: match[1], date: match[2] };
}

function migrateIfNeeded(saved: string[]): string[] {
  // Check every saved ID against the current lineup
  const currentIds = new Set(LINEUP.map(s => s.id));
  const needsMigration = saved.some(id => !currentIds.has(id));
  if (!needsMigration) return saved;

  const lookup = buildNewLookup();
  const migrated: string[] = [];

  saved.forEach(id => {
    if (currentIds.has(id)) {
      migrated.push(id); // still valid
      return;
    }
    const parsed = parseOldId(id);
    if (!parsed) return; // malformed — drop
    const newId = lookup.get(`${parsed.artistKey}-${parsed.date}`);
    if (newId) migrated.push(newId); // remapped to new time slot
    // If artist no longer in lineup, silently drop
  });

  // Deduplicate (in case two old IDs mapped to the same new one)
  return Array.from(new Set(migrated));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loaded, setLoaded]       = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: string[] = JSON.parse(stored);
        const alreadyMigrated  = localStorage.getItem(MIGRATED_KEY) === "1";

        if (alreadyMigrated) {
          setFavorites(parsed);
        } else {
          const migrated = migrateIfNeeded(parsed);
          setFavorites(migrated);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
          localStorage.setItem(MIGRATED_KEY, "1");
        }
      }
    } catch {}
    setLoaded(true);
  }, []);

  const toggle = useCallback((id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const isFav    = useCallback((id: string) => favorites.includes(id), [favorites]);
  const clearAll = useCallback(() => {
    setFavorites([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(MIGRATED_KEY);
    } catch {}
  }, []);

  return { favorites, toggle, isFav, clearAll, loaded };
}
