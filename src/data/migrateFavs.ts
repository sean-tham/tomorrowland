import { LINEUP } from "@/data/lineup";

const currentIds = new Set(LINEUP.map(s => s.id));

function buildLookup(): Map<string, string> {
  const map = new Map<string, string>();
  LINEUP.forEach(set => {
    const key = `${set.artist.toLowerCase().replace(/\s+/g, "-")}-${set.date}`;
    if (!map.has(key)) map.set(key, set.id);
  });
  return map;
}

const lookup = buildLookup();

function parseOldId(id: string): { artistKey: string; date: string } | null {
  const match = id.match(/^(.+)-(2026-07-2[456])-[\d:]+$/);
  if (!match) return null;
  return { artistKey: match[1], date: match[2] };
}

export function migrateFavIds(ids: string[]): string[] {
  const needsMigration = ids.some(id => !currentIds.has(id));
  if (!needsMigration) return ids;

  const result: string[] = [];
  ids.forEach(id => {
    if (currentIds.has(id)) { result.push(id); return; }
    const parsed = parseOldId(id);
    if (!parsed) return;
    const newId = lookup.get(`${parsed.artistKey}-${parsed.date}`);
    if (newId) result.push(newId);
  });
  return Array.from(new Set(result));
}
