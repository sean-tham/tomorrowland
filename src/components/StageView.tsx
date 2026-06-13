"use client";
import { useMemo, useState } from "react";
import { LINEUP, STAGES, sortMinutes, TmlSet } from "@/data/lineup";
import { SetCard } from "./SetCard";

const STAGE_ORDER = [
  "MAINSTAGE","FREEDOM BY BUD","THE LIBRARY","CRYSTAL GARDEN","CORE",
  "ATMOSPHERE","THE RAVE CAVE","PLANAXIS","RISE","MELODIA BY CORONA",
  "THE ROSE GARDEN","ELIXIR","CAGE","HOUSE OF FORTUNE BY JBL","MOOSE BAR",
];

const DAYS = [
  { label: "Fri", date: "2026-07-24" as const },
  { label: "Sat", date: "2026-07-25" as const },
  { label: "Sun", date: "2026-07-26" as const },
];

interface Props {
  favorites: string[];
  onToggleFav: (id: string) => void;
  onSetClick: (set: TmlSet) => void;
}

export function StageView({ favorites, onToggleFav, onSetClick }: Props) {
  const [activeDay, setActiveDay] = useState<"2026-07-24" | "2026-07-25" | "2026-07-26">("2026-07-24");
  const [expanded, setExpanded] = useState<string | null>("MAINSTAGE");

  const stageData = useMemo(() => {
    return STAGE_ORDER.map(stageName => {
      const sets = LINEUP
        .filter(s => s.stage === stageName && s.date === activeDay)
        .sort((a, b) => sortMinutes(a.startTime) - sortMinutes(b.startTime));
      return { stageName, sets };
    }).filter(s => s.sets.length > 0);
  }, [activeDay]);

  return (
    <div className="flex flex-col h-full">
      {/* Day selector */}
      <div className="flex gap-2 px-4 py-3">
        {DAYS.map(d => (
          <button
            key={d.date}
            onClick={() => setActiveDay(d.date)}
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

      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-2">
        {stageData.map(({ stageName, sets }) => {
          const stage = STAGES[stageName];
          const isOpen = expanded === stageName;
          const favCount = sets.filter(s => favorites.includes(s.id)).length;

          return (
            <div key={stageName} className="rounded-2xl overflow-hidden glass">
              {/* Stage header */}
              <button
                className="w-full flex items-center gap-3 p-4 text-left"
                onClick={() => setExpanded(isOpen ? null : stageName)}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: stage?.color ?? "#fff", boxShadow: `0 0 8px ${stage?.color}88` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white">{stage?.shortName ?? stageName}</p>
                  <p className="text-xs text-white/40 truncate">{stage?.vibe ?? ""}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {favCount > 0 && (
                    <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                      ❤️ {favCount}
                    </span>
                  )}
                  <span className="text-xs text-white/30">{sets.length} sets</span>
                  <span className={`text-white/40 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>▾</span>
                </div>
              </button>

              {/* Genre pills */}
              {isOpen && (
                <div className="px-4 pb-2 flex gap-1.5 flex-wrap">
                  {(stage?.genres ?? []).map(g => (
                    <span
                      key={g}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: `${stage?.color}20`, color: stage?.color }}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {/* Sets list */}
              {isOpen && (
                <div className="px-4 pb-4 space-y-1">
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
