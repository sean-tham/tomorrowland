"use client";
import { useMemo, useState } from "react";
import { LINEUP, STAGES, sortMinutes, TmlSet } from "@/data/lineup";
import { SetCard } from "./SetCard";

type DayFilter = "2026-07-24" | "2026-07-25" | "2026-07-26" | "all";

const DAYS: { label: string; date: DayFilter }[] = [
  { label: "All", date: "all" },
  { label: "Fri 24", date: "2026-07-24" },
  { label: "Sat 25", date: "2026-07-25" },
  { label: "Sun 26", date: "2026-07-26" },
];

const DAY_LABELS: Record<string, string> = {
  "2026-07-24": "Friday · July 24",
  "2026-07-25": "Saturday · July 25",
  "2026-07-26": "Sunday · July 26",
};

const STAGE_ORDER = [
  "MAINSTAGE","FREEDOM BY BUD","THE GREAT LIBRARY","CRYSTAL GARDEN","CORE",
  "ATMOSPHERE","THE RAVE CAVE","PLANAXIS","CELESTIA BY KUCOIN","MELODIA BY CORONA",
  "THE ROSE GARDEN","ELIXIR","CAGE","HOUSE OF FORTUNE BY JBL","MOOSE BAR",
];

interface Props {
  favorites: string[];
  onToggleFav: (id: string) => void;
  onSetClick: (set: TmlSet) => void;
}

export function ScheduleView({ favorites, onToggleFav, onSetClick }: Props) {
  const [activeDay, setActiveDay] = useState<DayFilter>("2026-07-24");
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return LINEUP.filter(s => {
      if (activeDay !== "all" && s.date !== activeDay) return false;
      if (activeStage && s.stage !== activeStage) return false;
      if (search && !s.artist.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => {
      // When viewing "all", sort by date first
      if (activeDay === "all" && a.date !== b.date) return a.date.localeCompare(b.date);
      // Within same day: sort by time, with midnight-crossing sets at the end
      return sortMinutes(a.startTime) - sortMinutes(b.startTime);
    });
  }, [activeDay, activeStage, search]);

  // Group by date when viewing all
  const grouped = useMemo(() => {
    if (activeDay !== "all") return null;
    const groups: Record<string, TmlSet[]> = {};
    filtered.forEach(s => {
      if (!groups[s.date]) groups[s.date] = [];
      groups[s.date].push(s);
    });
    return groups;
  }, [activeDay, filtered]);

  const stages = useMemo(() => {
    const dayFilter = activeDay === "all" ? null : activeDay;
    return STAGE_ORDER.filter(s => LINEUP.some(l => (!dayFilter || l.date === dayFilter) && l.stage === s));
  }, [activeDay]);

  return (
    <div className="flex flex-col h-full">
      {/* Day selector */}
      <div className="flex gap-1.5 px-4 py-3">
        {DAYS.map(d => (
          <button
            key={d.date}
            onClick={() => { setActiveDay(d.date); setActiveStage(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              activeDay === d.date
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/30"
                : "glass text-white/60 hover:text-white"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <input
          type="text"
          placeholder="Search artists…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full glass rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:ring-1 focus:ring-amber-500/50"
        />
      </div>

      {/* Stage filter */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveStage(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            !activeStage ? "bg-amber-500 text-black" : "glass text-white/60"
          }`}
        >
          All stages
        </button>
        {stages.map(s => {
          const stage = STAGES[s];
          return (
            <button
              key={s}
              onClick={() => setActiveStage(s === activeStage ? null : s)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeStage === s ? "text-black font-bold" : "glass text-white/70"
              }`}
              style={activeStage === s ? { background: stage?.color } : {}}
            >
              {stage?.shortName ?? s}
            </button>
          );
        })}
      </div>

      {/* Sets */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-1">
        {filtered.length === 0 && (
          <div className="text-center text-white/30 py-16 text-sm">No sets found</div>
        )}

        {/* Grouped view (All days) */}
        {grouped ? (
          Object.entries(grouped).map(([date, sets]) => (
            <div key={date}>
              <p className="text-xs font-bold text-amber-400/80 uppercase tracking-widest py-3 sticky top-0 bg-transparent">
                {DAY_LABELS[date]}
              </p>
              <div className="space-y-1">
                {sets.map(set => (
                  <SetCard
                    key={set.id}
                    set={set}
                    isFav={favorites.includes(set.id)}
                    onToggleFav={onToggleFav}
                    onClick={() => onSetClick(set)}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          filtered.map(set => (
            <SetCard
              key={set.id}
              set={set}
              isFav={favorites.includes(set.id)}
              onToggleFav={onToggleFav}
              onClick={() => onSetClick(set)}
            />
          ))
        )}
      </div>
    </div>
  );
}
