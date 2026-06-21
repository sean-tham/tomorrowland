"use client";
import { useState, useEffect, useCallback } from "react";
import { migrateFavIds } from "@/data/migrateFavs";

const STORAGE_KEY  = "tml2026w2-favorites";
const MIGRATED_KEY = "tml2026w2-migrated-v2";

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
          const migrated = migrateFavIds(parsed);
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
