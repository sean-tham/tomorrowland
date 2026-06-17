"use client";
import { useEffect, useMemo, useState } from "react";
import { LINEUP, setsClash, sortMinutes, formatTime, STAGES, TmlSet } from "@/data/lineup";
import { GroupUser } from "@/hooks/useGroupPlan";
import { USER_COLORS } from "@/data/config";

const DAY_LABELS: Record<string, string> = {
  "2026-07-24": "Friday · July 24",
  "2026-07-25": "Saturday · July 25",
  "2026-07-26": "Sunday · July 26",
};
const DAYS = ["2026-07-24", "2026-07-25", "2026-07-26"] as const;

interface Props {
  groupUsers: GroupUser[];
  deviceId: string;
  loading: boolean;
  onRefresh: () => void;
  onSetClick: (set: TmlSet) => void;
}

export function GroupPlanView({ groupUsers, deviceId, loading, onRefresh, onSetClick }: Props) {
  useEffect(() => { onRefresh(); }, []);

  const [filterUserId, setFilterUserId] = useState<string | null>(null);

  const userColors = useMemo(() => {
    const map: Record<string, string> = {};
    groupUsers.forEach((u, i) => { map[u.deviceId] = USER_COLORS[i % USER_COLORS.length]; });
    return map;
  }, [groupUsers]);

  // All { set, user } entries (full group)
  const enriched = useMemo(() => {
    return groupUsers.flatMap(user =>
      user.favorites.map(id => {
        const set = LINEUP.find(s => s.id === id);
        return set ? { set, user } : null;
      }).filter(Boolean) as { set: TmlSet; user: GroupUser }[]
    );
  }, [groupUsers]);

  // Entries after user filter applied
  const visible = useMemo(() => {
    if (!filterUserId) return enriched;
    return enriched.filter(e => e.user.deviceId === filterUserId);
  }, [enriched, filterUserId]);

  function getClashes(set: TmlSet, userId: string) {
    // Check against full enriched list (not filtered) so clashes still show
    return enriched.filter(e => e.user.deviceId !== userId && setsClash(set, e.set));
  }

  function clashLabel(clashes: { set: TmlSet; user: GroupUser }[], ownerDeviceId: string) {
    return clashes.map(c =>
      c.user.deviceId === ownerDeviceId ? "self" : c.user.name
    ).join(", ");
  }

  if (groupUsers.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 pb-24 text-center fade-in">
        <div className="text-5xl mb-4">👥</div>
        <h2 className="text-xl font-bold text-white mb-2">No group yet</h2>
        <p className="text-white/50 text-sm leading-relaxed">
          Go to My Plan, enter your name and upload your favourites. Share the app link with friends so they can do the same.
        </p>
        <button onClick={onRefresh} className="mt-6 px-5 py-2 glass rounded-xl text-sm text-white/60">
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header — tappable user chips */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {groupUsers.map(u => {
            const color    = userColors[u.deviceId];
            const isActive = filterUserId === u.deviceId;
            const isMe     = u.deviceId === deviceId;
            return (
              <button
                key={u.deviceId}
                onClick={() => setFilterUserId(isActive ? null : u.deviceId)}
                className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-150 active:scale-95"
                style={{
                  background: isActive ? color : `${color}22`,
                  color: isActive ? "#000" : color,
                  outline: isActive ? "none" : undefined,
                }}
              >
                <span className="w-2 h-2 rounded-full inline-block shrink-0"
                  style={{ background: isActive ? "rgba(0,0,0,0.4)" : color }} />
                {isMe ? `${u.name} (you)` : u.name}
              </button>
            );
          })}
          {filterUserId && (
            <button onClick={() => setFilterUserId(null)}
              className="text-xs text-white/30 hover:text-white/60 transition-colors">
              show all
            </button>
          )}
        </div>
        <button onClick={onRefresh} disabled={loading}
          className={`text-xs text-white/40 hover:text-white transition-colors ml-2 shrink-0 ${loading ? "animate-pulse" : ""}`}>
          {loading ? "…" : "↻"}
        </button>
      </div>

      {/* Days */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-6">
        {DAYS.map(date => {
          const daySets = visible
            .filter(e => e.set.date === date)
            .sort((a, b) => sortMinutes(a.set.startTime) - sortMinutes(b.set.startTime));

          if (daySets.length === 0) return null;

          return (
            <div key={date}>
              <p className="text-xs font-bold text-amber-400/80 uppercase tracking-widest mb-2">
                {DAY_LABELS[date]}
              </p>
              <div className="space-y-1.5">
                {daySets.map(({ set, user }, idx) => {
                  const clashes = getClashes(set, user.deviceId);
                  const color   = userColors[user.deviceId];
                  const stage   = STAGES[set.stage];

                  return (
                    <div key={`${set.id}-${user.deviceId}-${idx}`}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer active:scale-[0.98] transition-all ${clashes.length > 0 ? "ring-1 ring-red-500/40" : ""}`}
                      style={{ background: `${color}10`, borderLeft: `2px solid ${color}` }}
                      onClick={() => onSetClick(set)}
                    >
                      {/* Time */}
                      <div className="shrink-0 w-14 text-right">
                        <div className="text-xs font-semibold text-white/70">{formatTime(set.startTime)}</div>
                        <div className="text-xs text-white/30">{formatTime(set.endTime)}</div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-bold text-white">{set.artist}</span>
                          {set.genres[0] && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full"
                              style={{ background: `${stage?.color ?? color}22`, color: stage?.color ?? color }}>
                              {set.genres[0]}
                            </span>
                          )}
                        </div>
                        <p className="text-xs mt-0.5 truncate" style={{ color: `${stage?.color ?? color}99` }}>
                          {set.stage}
                        </p>
                        {clashes.length > 0 && (
                          <p className="text-xs text-red-400 mt-0.5">
                            💥 clashes with {clashLabel(clashes, user.deviceId)}
                          </p>
                        )}
                      </div>

                      {/* User dot */}
                      <div className="shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} title={user.name} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {visible.length === 0 && !loading && (
          <div className="text-center text-white/30 py-16 text-sm">No sets found</div>
        )}
      </div>
    </div>
  );
}
