"use client";
import { useMemo, useState } from "react";
import { LINEUP, setsClash, getSimilarSets, sortMinutes, TmlSet } from "@/data/lineup";
import { SetCard } from "./SetCard";
import { SharePanel } from "./SharePanel";

const DAY_LABELS: Record<string, string> = {
  "2026-07-24": "Friday · July 24",
  "2026-07-25": "Saturday · July 25",
  "2026-07-26": "Sunday · July 26",
};

interface Props {
  favorites: string[];
  onToggleFav: (id: string) => void;
  onClearAll: () => void;
  onSetClick: (set: TmlSet) => void;
  displayName: string;
  onSetName: (name: string) => void;
  onUpload: () => void;
  onRemove: () => void;
  uploading: boolean;
  removing: boolean;
  isUpToDate: boolean;
  lastSynced: string | null;
  uploadError: string | null;
}

export function FavouritesView({ favorites, onToggleFav, onClearAll, onSetClick, displayName, onSetName, onUpload, onRemove, uploading, removing, isUpToDate, lastSynced, uploadError }: Props) {
  const [shareOpen, setShareOpen]         = useState(false);
  const [confirmClear, setConfirmClear]   = useState(false);

  const favSets = useMemo(
    () => LINEUP.filter(s => favorites.includes(s.id)).sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return sortMinutes(a.startTime) - sortMinutes(b.startTime);
    }),
    [favorites]
  );

  const clashPairs = useMemo(() => {
    const clashes = new Set<string>();
    for (let i = 0; i < favSets.length; i++) {
      for (let j = i + 1; j < favSets.length; j++) {
        if (setsClash(favSets[i], favSets[j])) {
          clashes.add(favSets[i].id);
          clashes.add(favSets[j].id);
        }
      }
    }
    return clashes;
  }, [favSets]);

  const suggestions = useMemo(() => {
    if (favSets.length === 0) return [];
    return getSimilarSets(favSets[favSets.length - 1], LINEUP, favorites);
  }, [favSets, favorites]);

  const byDay = useMemo(() => {
    const days: Record<string, typeof favSets> = {};
    favSets.forEach(s => {
      if (!days[s.date]) days[s.date] = [];
      days[s.date].push(s);
    });
    return days;
  }, [favSets]);

  const shareButton = (
    <button
      onClick={() => setShareOpen(o => !o)}
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 ${
        shareOpen
          ? "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40"
          : "glass text-white/50 hover:text-white"
      }`}
    >
      <span>👥</span>
      <span>Share{lastSynced ? " ✓" : ""}</span>
    </button>
  );

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col h-full overflow-y-auto pb-24 fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-2 pb-3">
          <p className="text-xs text-white/30">No sets saved yet</p>
          {shareButton}
        </div>
        {shareOpen && (
          <SharePanel
            displayName={displayName} onSetName={onSetName} onUpload={onUpload} onRemove={onRemove}
            uploading={uploading} removing={removing} isUpToDate={isUpToDate}
            lastSynced={lastSynced} uploadError={uploadError} favoriteCount={0}
          />
        )}
        <div className="flex flex-col items-center justify-center flex-1 px-8 text-center">
          <div className="text-6xl mb-4">🎪</div>
          <h2 className="text-xl font-bold text-white mb-2">No favourites yet</h2>
          <p className="text-white/50 text-sm leading-relaxed">
            Tap the heart on any set to save it here. We&apos;ll help you spot clashes and find similar artists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24 fade-in">
      {/* Header row */}
      <div className="flex items-center justify-between px-4 pt-2 pb-3">
        <div className="flex items-center gap-3">
          <p className="text-xs text-white/40">{favorites.length} set{favorites.length !== 1 ? "s" : ""}</p>
          {confirmClear ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">Sure?</span>
              <button
                onClick={() => { onClearAll(); setConfirmClear(false); }}
                className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
              >Yes</button>
              <button
                onClick={() => setConfirmClear(false)}
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >Cancel</button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClear(true)}
              className="text-xs text-red-400/50 hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
        {shareButton}
      </div>

      {/* Share panel — collapses/expands */}
      {shareOpen && (
        <SharePanel
          displayName={displayName} onSetName={onSetName}
          onUpload={onUpload} onRemove={onRemove}
          uploading={uploading} removing={removing} isUpToDate={isUpToDate}
          lastSynced={lastSynced} uploadError={uploadError}
          favoriteCount={favorites.length}
        />
      )}

      {/* Clash warning */}
      {clashPairs.size > 0 && (
        <div className="mx-4 mb-3 p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
          <p className="text-sm font-semibold text-red-400">💥 {clashPairs.size} sets are clashing</p>
          <p className="text-xs text-red-400/70 mt-0.5">Sets marked below overlap in time</p>
        </div>
      )}

      {/* Favourites by day */}
      {Object.entries(byDay).map(([date, sets]) => (
        <div key={date} className="mb-5">
          <h3 className="px-4 text-xs font-bold text-amber-400/80 uppercase tracking-widest mb-2">
            {DAY_LABELS[date]}
          </h3>
          <div className="px-4 space-y-1">
            {sets.map(set => (
              <SetCard
                key={set.id}
                set={set}
                isFav={true}
                onToggleFav={onToggleFav}
                clashing={clashPairs.has(set.id)}
                onClick={() => onSetClick(set)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-6">
          <h3 className="px-4 text-xs font-bold text-white/30 uppercase tracking-widest mb-2">
            You might also like
          </h3>
          <div className="px-4 space-y-1">
            {suggestions.map(set => (
              <SetCard
                key={set.id}
                set={set}
                isFav={false}
                onToggleFav={onToggleFav}
                onClick={() => onSetClick(set)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
