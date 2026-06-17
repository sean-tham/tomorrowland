"use client";
import { useState } from "react";

interface Props {
  displayName: string;
  onSetName: (name: string) => void;
  onUpload: () => void;
  onRemove: () => void;
  uploading: boolean;
  removing: boolean;
  isUpToDate: boolean;
  lastSynced: string | null;
  uploadError: string | null;
  favoriteCount: number;
}

export function SharePanel({ displayName, onSetName, onUpload, onRemove, uploading, removing, isUpToDate, lastSynced, uploadError, favoriteCount }: Props) {
  const [editing, setEditing] = useState(!displayName);
  const [draft, setDraft]     = useState(displayName);
  const [confirmRemove, setConfirmRemove] = useState(false);

  function saveName() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSetName(trimmed);
    setEditing(false);
  }

  function formatSynced(iso: string) {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const uploadDisabled = uploading || removing || !displayName.trim() || favoriteCount === 0 || isUpToDate;

  return (
    <div className="mx-4 mb-3 p-4 rounded-2xl glass">
      <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Share with group</p>

      {/* Name field */}
      {editing ? (
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === "Enter" && saveName()}
            placeholder="Your name…"
            autoFocus
            className="flex-1 glass rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:ring-1 focus:ring-amber-500/50"
          />
          <button
            onClick={saveName}
            disabled={!draft.trim()}
            className="px-4 py-2 rounded-xl bg-amber-500 text-black text-sm font-bold disabled:opacity-40"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-white font-semibold flex-1">{displayName}</span>
          <button
            onClick={() => { setDraft(displayName); setEditing(true); }}
            className="text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            edit name
          </button>
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={onUpload}
        disabled={uploadDisabled}
        className="w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 mb-2"
        style={{
          background: uploadDisabled ? "rgba(245,158,11,0.2)" : "rgba(245,158,11,0.9)",
          color: uploadDisabled ? "rgba(245,158,11,0.5)" : "#000",
          cursor: uploadDisabled ? "default" : "pointer",
        }}
      >
        {uploading
          ? "Uploading…"
          : isUpToDate
          ? "✓ Group plan up to date"
          : favoriteCount === 0
          ? "Add favourites first"
          : `Upload ${favoriteCount} favourite${favoriteCount !== 1 ? "s" : ""} to group`}
      </button>

      {/* Remove button */}
      {lastSynced && !removing && (
        confirmRemove ? (
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => { onRemove(); setConfirmRemove(false); }}
              className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30"
            >
              Yes, remove me
            </button>
            <button
              onClick={() => setConfirmRemove(false)}
              className="flex-1 py-2 rounded-xl text-xs glass text-white/50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmRemove(true)}
            className="w-full py-1.5 text-xs text-red-400/50 hover:text-red-400 transition-colors"
          >
            Remove my plan from group
          </button>
        )
      )}
      {removing && (
        <p className="text-xs text-white/40 text-center mt-1 animate-pulse">Removing…</p>
      )}

      {/* Status */}
      {uploadError && (
        <p className="text-xs text-red-400 mt-2 text-center">{uploadError}</p>
      )}
      {lastSynced && !uploadError && !isUpToDate && (
        <p className="text-xs text-white/30 mt-2 text-center">
          Last synced {formatSynced(lastSynced)}
        </p>
      )}
    </div>
  );
}
