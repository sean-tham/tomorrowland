"use client";
import { useEffect, useMemo, useState } from "react";
import { LINEUP, setsClash, sortMinutes, formatTime, STAGES, TmlSet } from "@/data/lineup";
import { GroupUser } from "@/hooks/useGroupPlan";
import { USER_COLORS } from "@/data/config";
import { TmlLoader } from "./TmlLoader";
import { GroupOverviewModal } from "./GroupOverviewModal";

type DayFilter = "all" | "2026-07-24" | "2026-07-25" | "2026-07-26";
type SortMode  = "time" | "popular" | "clashes";

const DAY_LABELS: Record<string, string> = {
  "2026-07-24": "Friday · July 24",
  "2026-07-25": "Saturday · July 25",
  "2026-07-26": "Sunday · July 26",
};
const DAYS = ["2026-07-24", "2026-07-25", "2026-07-26"] as const;
const DAY_TABS: { label: string; value: DayFilter }[] = [
  { label: "All",  value: "all" },
  { label: "Fri",  value: "2026-07-24" },
  { label: "Sat",  value: "2026-07-25" },
  { label: "Sun",  value: "2026-07-26" },
];

interface Props {
  groupUsers: GroupUser[];
  deviceId: string;
  loading: boolean;
  onRefresh: () => void;
  onSetClick: (set: TmlSet) => void;
}

type MergedEntry = { set: typeof LINEUP[0]; users: GroupUser[] };

export function GroupPlanView({ groupUsers, deviceId, loading, onRefresh, onSetClick }: Props) {
  useEffect(() => { onRefresh(); }, []);

  const [filterUserId,    setFilterUserId]    = useState<string | null>(null);
  const [dayFilter,       setDayFilter]       = useState<DayFilter>("all");
  const [sortMode,        setSortMode]        = useState<SortMode>("time");
  const [showClashOnly,   setShowClashOnly]   = useState(false);
  const [overviewOpen,    setOverviewOpen]    = useState(false);

  const userColors = useMemo(() => {
    const map: Record<string, string> = {};
    groupUsers.forEach((u, i) => { map[u.deviceId] = USER_COLORS[i % USER_COLORS.length]; });
    return map;
  }, [groupUsers]);

  const mergedSets = useMemo(() => {
    const map = new Map<string, MergedEntry>();
    groupUsers.forEach(user => {
      user.favorites.forEach(id => {
        const set = LINEUP.find(s => s.id === id);
        if (!set) return;
        if (!map.has(id)) map.set(id, { set, users: [] });
        map.get(id)!.users.push(user);
      });
    });
    return Array.from(map.values());
  }, [groupUsers]);

  function getClashes(entry: MergedEntry): MergedEntry[] {
    const ownerIds = new Set(entry.users.map(u => u.deviceId));
    return mergedSets.filter(other => {
      if (other.set.id === entry.set.id) return false;
      if (!setsClash(entry.set, other.set)) return false;
      const otherIds = new Set(other.users.map(u => u.deviceId));
      return other.users.some(u => !ownerIds.has(u.deviceId)) && entry.users.some(u => !otherIds.has(u.deviceId));
    });
  }

  function clashLabel(clashes: MergedEntry[], ownerIds: Set<string>): string {
    const names = new Set<string>();
    clashes.forEach(c => c.users.filter(u => !ownerIds.has(u.deviceId)).forEach(u => names.add(u.name)));
    return Array.from(names).join(", ");
  }

  const clashCounts = useMemo(() => {
    const map = new Map<string, number>();
    mergedSets.forEach(e => { map.set(e.set.id, getClashes(e).length); });
    return map;
  }, [mergedSets]);

  const clashingCount = useMemo(() =>
    mergedSets.filter(e => (clashCounts.get(e.set.id) ?? 0) > 0).length,
  [mergedSets, clashCounts]);

  const visible = useMemo(() => {
    let list = mergedSets;
    if (dayFilter !== "all")  list = list.filter(e => e.set.date === dayFilter);
    if (filterUserId)         list = list.filter(e => e.users.some(u => u.deviceId === filterUserId));
    if (showClashOnly)        list = list.filter(e => (clashCounts.get(e.set.id) ?? 0) > 0);

    switch (sortMode) {
      case "popular":
        return [...list].sort((a, b) => b.users.length - a.users.length || sortMinutes(a.set.startTime) - sortMinutes(b.set.startTime));
      case "clashes":
        return [...list].sort((a, b) => (clashCounts.get(b.set.id) ?? 0) - (clashCounts.get(a.set.id) ?? 0) || sortMinutes(a.set.startTime) - sortMinutes(b.set.startTime));
      default:
        return [...list].sort((a, b) => {
          if (dayFilter === "all" && a.set.date !== b.set.date) return a.set.date.localeCompare(b.set.date);
          return sortMinutes(a.set.startTime) - sortMinutes(b.set.startTime);
        });
    }
  }, [mergedSets, dayFilter, filterUserId, showClashOnly, sortMode, clashCounts]);

  if (loading && groupUsers.length === 0) return <TmlLoader label="Group Plan" />;

  if (groupUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 pb-24 text-center fade-in">
        <div className="text-5xl mb-4">👥</div>
        <h2 className="text-xl font-bold text-white mb-2">No group yet</h2>
        <p className="text-white/50 text-sm leading-relaxed">
          Go to My Plan, enter your name and upload your favourites. Share the app link with your group.
        </p>
        <button onClick={onRefresh} className="mt-6 px-5 py-2 glass rounded-xl text-sm text-white/60">Refresh</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">

      {/* Overview trigger — above user chips */}
      <button
        onClick={() => setOverviewOpen(true)}
        className="mx-4 mt-3 mb-2 flex items-center justify-between px-4 py-3 rounded-2xl glass transition-all active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">📊</span>
          <div className="text-left">
            <p className="text-sm font-bold text-white">Group Overview</p>
            <p className="text-xs text-white/40">
              {mergedSets.length} sets
              {clashingCount > 0 && <span className="text-red-400"> · 💥 {clashingCount} clashes</span>}
            </p>
          </div>
        </div>
        <span className="text-white/30 text-xs">tap to expand →</span>
      </button>

      {/* User chips + refresh */}
      <div className="flex items-center gap-2 px-4 pb-2 flex-wrap">
        {groupUsers.map(u => {
          const color    = userColors[u.deviceId];
          const isActive = filterUserId === u.deviceId;
          return (
            <button key={u.deviceId}
              onClick={() => setFilterUserId(isActive ? null : u.deviceId)}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all active:scale-95"
              style={{ background: isActive ? color : `${color}22`, color: isActive ? "#000" : color }}
            >
              <span className="w-2 h-2 rounded-full inline-block shrink-0"
                style={{ background: isActive ? "rgba(0,0,0,0.4)" : color }} />
              {u.deviceId === deviceId ? `${u.name} (you)` : u.name}
            </button>
          );
        })}
        {filterUserId && (
          <button onClick={() => setFilterUserId(null)} className="text-xs text-white/30 hover:text-white/60 transition-colors">show all</button>
        )}
        <button onClick={onRefresh} disabled={loading}
          className={`ml-auto text-sm text-white/30 hover:text-white/60 transition-colors shrink-0 ${loading ? "animate-spin" : ""}`}>
          ↻
        </button>
      </div>

      {/* Day filter + sort + clash filter */}
      <div className="flex items-center gap-2 px-4 pb-2">
        <div className="flex gap-1 flex-1">
          {DAY_TABS.map(d => (
            <button key={d.value} onClick={() => setDayFilter(d.value)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                dayFilter === d.value ? "bg-amber-500 text-black" : "glass text-white/50"
              }`}>
              {d.label}
            </button>
          ))}
        </div>
        {clashingCount > 0 && (
          <button
            onClick={() => setShowClashOnly(o => !o)}
            className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              showClashOnly ? "bg-red-500/80 text-white" : "glass text-red-400/70"
            }`}
          >
            💥 {clashingCount}
          </button>
        )}
        <select value={sortMode} onChange={e => setSortMode(e.target.value as SortMode)}
          className="glass text-xs text-white/60 rounded-lg px-2 py-1.5 outline-none bg-transparent border-0 cursor-pointer shrink-0"
          style={{ background: "rgba(255,255,255,0.07)" }}>
          <option value="time"    style={{ background: "#1a0a2e" }}>By time</option>
          <option value="popular" style={{ background: "#1a0a2e" }}>Most liked</option>
          <option value="clashes" style={{ background: "#1a0a2e" }}>Most clashes</option>
        </select>
      </div>

      {/* Active filters pill */}
      {showClashOnly && (
        <div className="px-4 pb-2">
          <span className="inline-flex items-center gap-1.5 text-xs bg-red-500/15 text-red-400 px-3 py-1 rounded-full">
            💥 Showing clashes only
            <button onClick={() => setShowClashOnly(false)} className="text-red-400/60 hover:text-red-400 ml-0.5">✕</button>
          </span>
        </div>
      )}

      {/* Set list */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-1.5">
        {visible.length === 0 && (
          <div className="text-center text-white/30 py-16 text-sm">No sets found</div>
        )}
        {dayFilter === "all" && sortMode === "time" ? (
          DAYS.map(date => {
            const daySets = visible.filter(e => e.set.date === date);
            if (daySets.length === 0) return null;
            return (
              <div key={date}>
                <p className="text-xs font-bold text-amber-400/70 uppercase tracking-widest pt-2 pb-1.5">{DAY_LABELS[date]}</p>
                <div className="space-y-1.5">
                  {daySets.map(entry => (
                    <SetRow key={entry.set.id} entry={entry} userColors={userColors}
                      getClashes={getClashes} clashLabel={clashLabel} onSetClick={onSetClick} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          visible.map(entry => (
            <SetRow key={entry.set.id} entry={entry} userColors={userColors}
              getClashes={getClashes} clashLabel={clashLabel} onSetClick={onSetClick} />
          ))
        )}
      </div>

      {/* Overview modal */}
      {overviewOpen && (
        <GroupOverviewModal
          groupUsers={groupUsers}
          deviceId={deviceId}
          onClose={() => setOverviewOpen(false)}
          onFilterClashes={() => { setShowClashOnly(true); }}
          clashingCount={clashingCount}
        />
      )}
    </div>
  );
}

function SetRow({ entry, userColors, getClashes, clashLabel, onSetClick }: {
  entry: MergedEntry;
  userColors: Record<string, string>;
  getClashes: (e: MergedEntry) => MergedEntry[];
  clashLabel: (clashes: MergedEntry[], ownerIds: Set<string>) => string;
  onSetClick: (set: TmlSet) => void;
}) {
  const { set, users } = entry;
  const clashes     = getClashes(entry);
  const ownerIds    = new Set(users.map(u => u.deviceId));
  const stage       = STAGES[set.stage];
  const multiUser   = users.length > 1;
  const borderColor = multiUser ? "#f59e0b" : userColors[users[0]?.deviceId] ?? "#f59e0b";

  return (
    <div
      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer active:scale-[0.98] transition-all ${clashes.length > 0 ? "ring-1 ring-red-500/40" : ""}`}
      style={{ background: `${borderColor}10`, borderLeft: `2px solid ${borderColor}` }}
      onClick={() => onSetClick(set)}
    >
      <div className="shrink-0 w-14 text-right">
        <div className="text-xs font-semibold text-white/70">{formatTime(set.startTime)}</div>
        <div className="text-xs text-white/30">{formatTime(set.endTime)}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-bold text-white">{set.artist}</span>
          {set.genres[0] && (
            <span className="text-xs px-1.5 py-0.5 rounded-full"
              style={{ background: `${stage?.color ?? borderColor}22`, color: stage?.color ?? borderColor }}>
              {set.genres[0]}
            </span>
          )}
          {multiUser && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold">
              ❤️ {users.length}
            </span>
          )}
        </div>
        <p className="text-xs mt-0.5 truncate" style={{ color: `${stage?.color ?? borderColor}99` }}>{set.stage}</p>
        {clashes.length > 0 && (
          <p className="text-xs text-red-400 mt-0.5">💥 clashes with {clashLabel(clashes, ownerIds)}</p>
        )}
      </div>
      <div className="shrink-0 flex items-center gap-0.5">
        {users.map(u => (
          <div key={u.deviceId} className="w-2.5 h-2.5 rounded-full ring-1 ring-black/20"
            style={{ background: userColors[u.deviceId] }} title={u.name} />
        ))}
      </div>
    </div>
  );
}
