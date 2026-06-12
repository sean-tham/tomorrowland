"use client";
import { useEffect } from "react";
import { TmlSet, STAGES, LINEUP, getSimilarSets } from "@/data/lineup";
import { SetCard } from "./SetCard";

const DAY_LABELS: Record<string, string> = {
  "2026-07-24": "Friday · July 24",
  "2026-07-25": "Saturday · July 25",
  "2026-07-26": "Sunday · July 26",
};

interface Props {
  set: TmlSet;
  isFav: boolean;
  favorites: string[];
  onToggleFav: (id: string) => void;
  onClose: () => void;
  onSetClick: (set: TmlSet) => void;
}

export function SetDetailModal({ set, isFav, favorites, onToggleFav, onClose, onSetClick }: Props) {
  const stage = STAGES[set.stage];
  const similar = getSimilarSets(set, LINEUP, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-t-3xl overflow-y-auto max-h-[85vh] glass-strong pb-safe fade-in"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-3 mb-4" />

        {/* Header */}
        <div
          className="mx-4 mb-4 p-4 rounded-2xl"
          style={{ background: `linear-gradient(135deg, ${stage?.color}30, ${stage?.color}10)`, borderLeft: `4px solid ${stage?.color}` }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-black text-white leading-tight">{set.artist}</h2>
              <p className="text-sm mt-1 font-medium" style={{ color: stage?.color }}>{set.stage}</p>
              <p className="text-xs text-white/50 mt-1">{DAY_LABELS[set.date]} · {set.startTime} – {set.endTime}</p>
            </div>
            <button
              className={`text-3xl ml-3 transition-transform duration-150 ${isFav ? "scale-110" : "opacity-40"}`}
              onClick={() => onToggleFav(set.id)}
            >
              {isFav ? "❤️" : "🤍"}
            </button>
          </div>

          {/* Genres */}
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {set.genres.map(g => (
              <span
                key={g}
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: `${stage?.color}25`, color: stage?.color }}
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Stage info */}
        <div className="mx-4 mb-4 p-4 rounded-2xl glass">
          <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Stage vibe</p>
          <p className="text-sm text-white/80">{stage?.vibe}</p>
        </div>

        {/* Similar artists */}
        {similar.length > 0 && (
          <div className="mx-4 mb-4">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Similar acts this weekend</p>
            <div className="space-y-2">
              {similar.slice(0, 4).map(s => (
                <SetCard
                  key={s.id}
                  set={s}
                  isFav={favorites.includes(s.id)}
                  onToggleFav={onToggleFav}
                  compact
                  onClick={() => onSetClick(s)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
