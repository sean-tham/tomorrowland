"use client";
import { TmlSet, STAGES } from "@/data/lineup";

interface Props {
  set: TmlSet;
  isFav: boolean;
  onToggleFav: (id: string) => void;
  clashing?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

export function SetCard({ set, isFav, onToggleFav, clashing, compact, onClick }: Props) {
  const stage = STAGES[set.stage];
  const stageColor = stage?.color ?? "#f59e0b";

  return (
    <div
      className={`relative rounded-2xl overflow-hidden transition-all duration-200 ${compact ? "p-3" : "p-4"} ${clashing ? "ring-2 ring-red-500/60" : ""} ${onClick ? "cursor-pointer active:scale-95" : ""}`}
      style={{ background: `linear-gradient(135deg, ${stageColor}18 0%, ${stageColor}08 100%)`, borderLeft: `3px solid ${stageColor}` }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className={`font-bold truncate ${compact ? "text-sm" : "text-base"} text-white`}>{set.artist}</p>
          <p className="text-xs mt-0.5 truncate" style={{ color: stageColor }}>{set.stage}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs text-white/60 font-mono">{set.startTime} – {set.endTime}</span>
            {clashing && (
              <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">⚡ clash</span>
            )}
          </div>
          {!compact && set.genres.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {set.genres.slice(0, 2).map(g => (
                <span key={g} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${stageColor}25`, color: stageColor }}>
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          className={`shrink-0 text-xl transition-all duration-150 ${isFav ? "scale-110" : "opacity-40 hover:opacity-70"}`}
          onClick={(e) => { e.stopPropagation(); onToggleFav(set.id); }}
          aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
        >
          {isFav ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
}
