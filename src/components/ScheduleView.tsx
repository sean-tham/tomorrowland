"use client";
import { useMemo, useState } from "react";
import { LINEUP, STAGES,  TmlSet } from "@/data/lineup";
import { SetCard } from "./SetCard";

const DAYS = [
  { label: "Fri 24", date: "2026-07-24" as const },
  { label: "Sat 25", date: "2026-07-25" as const },
  { label: "Sun 26", date: "2026-07-26" as const },
];

const STAGE_ORDER = [
  "MAINSTAGE","FREEDOM BY BUD","THE LIBRARY","CRYSTAL GARDEN","CORE",
  "ATMOSPHERE","THE RAVE CAVE","PLANAXIS","RISE","MELODIA BY CORONA",
  "THE ROSE GARDEN","ELIXIR","CAGE","HOUSE OF FORTUNE BY JBL","MOOSE BAR",
];

interface Props {
  favorites: string[];
  onToggleFav: (id: string) => void;
  onSetClick: (set: TmlSet) => void;
}

export function ScheduleView({ favorites, onToggleFav, onSetClick }: Props) {
  const [activeDay, setActiveDay] = useState<"2026-07-24" | "2026-07-25" | "2026-07-26">("2026-07-24");
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return LINEUP.filter(s => {
      if (s.date !== activeDay) return false;
      if (activeStage && s.stage !== activeStage) return false;
      if (search && !s.artist.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => {
      const stageA = STAGE_ORDER.indexOf(a.stage);
      const stageB = STAGE_ORDER.indexOf(b.stage);
      if (stageA !== stageB) return stageA - stageB;
      return a.startTime.localeCompare(b.startTime);
    });
  }, [activeDay, activeStage, search]);

  const stages = useMemo(() => {
    return STAGE_ORDER.filter(s => LINEUP.some(l => l.date === activeDay && l.stage === s));
  }, [activeDay]);

  return (
    <div className="flex flex-col h-full">
      {/* Day selector */}
      <div className="flex gap-2 px-4 py-3">
        {DAYS.map(d => (
          <button
            key={d.date}
            onClick={() => { setActiveDay(d.date); setActiveStage(null); }}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
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
      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-2">
        {filtered.length === 0 && (
          <div className="text-center text-white/30 py-16 text-sm">No sets found</div>
        )}
        {filtered.map(set => (
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
  );
}
