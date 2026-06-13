"use client";
import { TmlSet, STAGES, formatTime } from "@/data/lineup";

interface Props {
  set: TmlSet;
  isFav: boolean;
  onToggleFav: (id: string) => void;
  clashing?: boolean;
  onClick?: () => void;
}

export function SetCard({ set, isFav, onToggleFav, clashing, onClick }: Props) {
  const stage = STAGES[set.stage];
  const stageColor = stage?.color ?? "#f59e0b";

  return (
    <div
      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-150 ${clashing ? "ring-1 ring-red-500/60" : ""} ${onClick ? "cursor-pointer active:scale-[0.98]" : ""}`}
      style={{ background: `${stageColor}10`, borderLeft: `2px solid ${stageColor}` }}
      onClick={onClick}
    >
      {/* Time column */}
      <div className="shrink-0 w-14 text-right">
        <div className="text-xs font-semibold text-white/70">{formatTime(set.startTime)}</div>
        <div className="text-xs text-white/30">{formatTime(set.endTime)}</div>
      </div>

      {/* Artist + genre + stage */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-bold text-white leading-tight">{set.artist}</span>
          {set.genres[0] && (
            <span className="text-xs px-1.5 py-0.5 rounded-full leading-none shrink-0"
              style={{ background: `${stageColor}22`, color: stageColor }}>
              {set.genres[0]}
            </span>
          )}
          {clashing && (
            <span className="text-xs text-red-400">⚡</span>
          )}
        </div>
        <p className="text-xs mt-0.5 truncate" style={{ color: `${stageColor}99` }}>{set.stage}</p>
      </div>

      {/* Heart */}
      <button
        className={`shrink-0 text-base leading-none transition-all duration-150 ${isFav ? "opacity-100" : "opacity-25 hover:opacity-60"}`}
        onClick={(e) => { e.stopPropagation(); onToggleFav(set.id); }}
        aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
      >
        {isFav ? "❤️" : "🤍"}
      </button>
    </div>
  );
}
