"use client";
import { useEffect } from "react";
import { LINEUP, STAGES, setsClash, sortMinutes } from "@/data/lineup";
import { GroupUser } from "@/hooks/useGroupPlan";
import { USER_COLORS } from "@/data/config";

interface MergedSet { set: ReturnType<typeof LINEUP[0]["id"] extends string ? () => typeof LINEUP[0] : never>; users: GroupUser[] }

// Re-derive merged sets here so modal is self-contained
function buildMerged(groupUsers: GroupUser[]) {
  const map = new Map<string, { set: typeof LINEUP[0]; users: GroupUser[] }>();
  groupUsers.forEach(user => {
    user.favorites.forEach(id => {
      const set = LINEUP.find(s => s.id === id);
      if (!set) return;
      if (!map.has(id)) map.set(id, { set, users: [] });
      map.get(id)!.users.push(user);
    });
  });
  return Array.from(map.values());
}

function isCrossUserClash(
  a: { set: typeof LINEUP[0]; users: GroupUser[] },
  b: { set: typeof LINEUP[0]; users: GroupUser[] }
) {
  if (a.set.id === b.set.id) return false;
  if (!setsClash(a.set, b.set)) return false;
  const aIds = new Set(a.users.map(u => u.deviceId));
  const bIds = new Set(b.users.map(u => u.deviceId));
  return a.users.some(u => !bIds.has(u.deviceId)) && b.users.some(u => !aIds.has(u.deviceId));
}

function computeStats(groupUsers: GroupUser[], userColors: Record<string, string>) {
  const merged = buildMerged(groupUsers);

  // Clash counts per set
  const clashCounts = new Map<string, number>();
  merged.forEach(a => {
    const n = merged.filter(b => isCrossUserClash(a, b)).length;
    clashCounts.set(a.set.id, n);
  });

  // Clashing set IDs
  const clashingSetIds = new Set(Array.from(clashCounts.entries()).filter(([, n]) => n > 0).map(([id]) => id));

  // Most wanted
  const mostWanted = [...merged].sort((a, b) => b.users.length - a.users.length)[0];

  // Most contested
  const mostContested = [...merged].sort((a, b) => (clashCounts.get(b.set.id) ?? 0) - (clashCounts.get(a.set.id) ?? 0))[0];
  const mostContestedN = clashCounts.get(mostContested?.set.id ?? "") ?? 0;

  // Set hoarder
  const hoarder = [...groupUsers].sort((a, b) => b.favorites.length - a.favorites.length)[0];

  // Minimalist
  const minimalist = [...groupUsers].sort((a, b) => a.favorites.length - b.favorites.length)[0];

  // Best pairing (most shared sets)
  let bestPairA: GroupUser | null = null;
  let bestPairB: GroupUser | null = null;
  let bestPairCount = 0;
  for (let i = 0; i < groupUsers.length; i++) {
    for (let j = i + 1; j < groupUsers.length; j++) {
      const setA = new Set(groupUsers[i].favorites);
      const shared = groupUsers[j].favorites.filter(id => setA.has(id)).length;
      if (shared > bestPairCount) {
        bestPairCount = shared;
        bestPairA = groupUsers[i];
        bestPairB = groupUsers[j];
      }
    }
  }

  // Wildcard — most unique picks (sets no one else liked)
  const wildcardScores = groupUsers.map(user => {
    const unique = user.favorites.filter(id => {
      const entry = merged.find(e => e.set.id === id);
      return entry && entry.users.length === 1;
    }).length;
    return { user, unique };
  }).sort((a, b) => b.unique - a.unique);
  const wildcard = wildcardScores[0];

  // Clash magnet — user with most sets that have cross-user clashes
  const clashMagnetScores = groupUsers.map(user => {
    const n = user.favorites.filter(id => clashingSetIds.has(id)).length;
    return { user, n };
  }).sort((a, b) => b.n - a.n);
  const clashMagnet = clashMagnetScores[0];

  // Stage loyalist — user whose largest stage concentration is highest
  const stageLoyal = groupUsers.map(user => {
    const stageCounts: Record<string, number> = {};
    user.favorites.forEach(id => {
      const s = LINEUP.find(l => l.id === id);
      if (s) stageCounts[s.stage] = (stageCounts[s.stage] ?? 0) + 1;
    });
    const topStage = Object.entries(stageCounts).sort((a, b) => b[1] - a[1])[0];
    return topStage ? { user, stage: topStage[0], count: topStage[1] } : null;
  }).filter(Boolean).sort((a, b) => (b!.count / Math.max(1, groupUsers.find(u => u.deviceId === b!.user.deviceId)?.favorites.length ?? 1)) - (a!.count / Math.max(1, groupUsers.find(u => u.deviceId === a!.user.deviceId)?.favorites.length ?? 1)));
  const loyalist = stageLoyal[0];

  // Night owl — most sets after midnight (00:xx or 01:xx)
  const nightOwl = [...groupUsers].map(user => {
    const n = user.favorites.filter(id => {
      const s = LINEUP.find(l => l.id === id);
      if (!s) return false;
      const h = parseInt(s.startTime.split(":")[0]);
      return h === 0 || h === 1;
    }).length;
    return { user, n };
  }).sort((a, b) => b.n - a.n)[0];

  return {
    merged, clashingSetIds, clashCounts,
    mostWanted, mostContested, mostContestedN,
    hoarder, minimalist,
    bestPairA, bestPairB, bestPairCount,
    wildcard, clashMagnet, loyalist, nightOwl,
  };
}

interface Props {
  groupUsers: GroupUser[];
  deviceId: string;
  onClose: () => void;
  onFilterClashes: () => void;
  clashingCount: number;
}

export function GroupOverviewModal({ groupUsers, deviceId, onClose, onFilterClashes, clashingCount }: Props) {
  const userColors: Record<string, string> = {};
  groupUsers.forEach((u, i) => { userColors[u.deviceId] = USER_COLORS[i % USER_COLORS.length]; });

  const s = computeStats(groupUsers, userColors);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  function Dot({ user }: { user: GroupUser }) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ background: `${userColors[user.deviceId]}22`, color: userColors[user.deviceId] }}>
        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: userColors[user.deviceId] }} />
        {user.deviceId === deviceId ? `${user.name} (you)` : user.name}
      </span>
    );
  }

  function StatCard({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
    return (
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{emoji}</span>
          <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{title}</p>
        </div>
        {children}
      </div>
    );
  }

  const totalSets = s.merged.length;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-t-3xl glass-strong overflow-y-auto fade-in"
        style={{ maxHeight: "92vh", paddingBottom: "max(env(safe-area-inset-bottom,0px),24px)" }}>

        {/* Handle + back */}
        <div className="flex items-center px-4 pt-4 pb-2 gap-3 sticky top-0 glass-strong z-10">
          <button onClick={onClose}
            className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm font-medium">
            <span className="text-lg leading-none">←</span>
            <span>Back</span>
          </button>
          <div className="flex-1 flex justify-center">
            <div className="w-8 h-1 bg-white/20 rounded-full" />
          </div>
          <div className="w-14" />
        </div>

        <div className="px-4 pt-2 pb-2">
          <h2 className="text-xl font-black text-white">Group Overview</h2>
          <p className="text-xs text-white/40 mt-0.5">{groupUsers.length} people · {totalSets} sets saved</p>
        </div>

        <div className="px-4 space-y-3 pb-4">
          {/* Key numbers */}
          <div className="grid grid-cols-2 gap-2">
            <div className="glass rounded-2xl p-4 text-center">
              <p className="text-3xl font-black text-amber-400">{totalSets}</p>
              <p className="text-xs text-white/50 mt-1">sets saved</p>
            </div>
            <button
              className={`glass rounded-2xl p-4 text-center transition-all active:scale-95 ${clashingCount > 0 ? "ring-1 ring-red-500/40" : ""}`}
              onClick={() => { onFilterClashes(); onClose(); }}
              disabled={clashingCount === 0}
            >
              <p className={`text-3xl font-black ${clashingCount > 0 ? "text-red-400" : "text-white/20"}`}>{clashingCount}</p>
              <p className="text-xs text-white/50 mt-1">
                {clashingCount > 0 ? "tap to filter clashes" : "no clashes 🎉"}
              </p>
            </button>
          </div>

          {/* Most wanted */}
          {s.mostWanted && (
            <StatCard emoji="🏅" title="Most Wanted">
              <p className="text-base font-bold text-white">{s.mostWanted.set.artist}</p>
              <p className="text-xs text-white/40 mt-0.5">{s.mostWanted.set.stage}</p>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {s.mostWanted.users.map(u => <Dot key={u.deviceId} user={u} />)}
                <span className="text-xs text-white/30">{s.mostWanted.users.length} people</span>
              </div>
            </StatCard>
          )}

          {/* Most contested */}
          {s.mostContested && s.mostContestedN > 0 && (
            <StatCard emoji="⚔️" title="Most Contested Slot">
              <p className="text-base font-bold text-white">{s.mostContested.set.artist}</p>
              <p className="text-xs text-white/40 mt-0.5">{s.mostContested.set.stage}</p>
              <p className="text-xs text-red-400 mt-1">💥 {s.mostContestedN} clash{s.mostContestedN !== 1 ? "es" : ""}</p>
            </StatCard>
          )}

          <div className="pt-1 pb-1">
            <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Group character awards</p>
          </div>

          {/* Set hoarder */}
          {s.hoarder && (
            <StatCard emoji="🐉" title="Set Hoarder">
              <Dot user={s.hoarder} />
              <p className="text-xs text-white/50 mt-1.5">saved {s.hoarder.favorites.length} sets — nobody's missing anything</p>
            </StatCard>
          )}

          {/* Minimalist */}
          {s.minimalist && s.minimalist.deviceId !== s.hoarder?.deviceId && (
            <StatCard emoji="🧘" title="The Minimalist">
              <Dot user={s.minimalist} />
              <p className="text-xs text-white/50 mt-1.5">only {s.minimalist.favorites.length} set{s.minimalist.favorites.length !== 1 ? "s" : ""} — quality over quantity</p>
            </StatCard>
          )}

          {/* Best pairing */}
          {s.bestPairA && s.bestPairB && s.bestPairCount > 0 && (
            <StatCard emoji="👯" title="Festival Soulmates">
              <div className="flex items-center gap-2 flex-wrap">
                <Dot user={s.bestPairA} />
                <span className="text-white/40 text-xs">&amp;</span>
                <Dot user={s.bestPairB} />
              </div>
              <p className="text-xs text-white/50 mt-1.5">{s.bestPairCount} sets in common — basically the same person</p>
            </StatCard>
          )}

          {/* Wildcard */}
          {s.wildcard && s.wildcard.unique > 0 && (
            <StatCard emoji="🎲" title="The Wildcard">
              <Dot user={s.wildcard.user} />
              <p className="text-xs text-white/50 mt-1.5">{s.wildcard.unique} unique pick{s.wildcard.unique !== 1 ? "s" : ""} nobody else chose — marching to their own beat</p>
            </StatCard>
          )}

          {/* Clash magnet */}
          {s.clashMagnet && s.clashMagnet.n > 0 && (
            <StatCard emoji="💥" title="Clash Magnet">
              <Dot user={s.clashMagnet.user} />
              <p className="text-xs text-white/50 mt-1.5">{s.clashMagnet.n} of their sets clash with others — impossible to please</p>
            </StatCard>
          )}

          {/* Stage loyalist */}
          {s.loyalist && (
            <StatCard emoji="🎡" title="Stage Loyalist">
              <Dot user={s.loyalist.user} />
              <p className="text-xs text-white/50 mt-1.5">{s.loyalist.count} of their sets at <span className="text-white/70">{STAGES[s.loyalist.stage]?.shortName ?? s.loyalist.stage}</span> — practically lives there</p>
            </StatCard>
          )}

          {/* Night owl */}
          {s.nightOwl && s.nightOwl.n > 0 && (
            <StatCard emoji="🦉" title="Night Owl">
              <Dot user={s.nightOwl.user} />
              <p className="text-xs text-white/50 mt-1.5">{s.nightOwl.n} set{s.nightOwl.n !== 1 ? "s" : ""} after midnight — sleep is for the weak</p>
            </StatCard>
          )}
        </div>
      </div>
    </div>
  );
}
