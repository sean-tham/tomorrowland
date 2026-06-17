"use client";
import { useState } from "react";

interface Props {
  displayName: string;
  onSetName: (name: string) => void;
  onUpload: () => void;
  uploading: boolean;
  lastSynced: string | null;
  uploadError: string | null;
  favoriteCount: number;
}

export function SharePanel({ displayName, onSetName, onUpload, uploading, lastSynced, uploadError, favoriteCount }: Props) {
  const [editing, setEditing] = useState(!displayName);
  const [draft, setDraft]     = useState(displayName);

  function saveName() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSetName(trimmed);
    setEditing(false);
  }

  function formatSynced(iso: string) {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="mx-4 mb-4 p-4 rounded-2xl glass">
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
          <div className="flex-1 flex items-center gap-2">
            <span className="text-sm text-white font-semibold">{displayName}</span>
            <button onClick={() => { setDraft(displayName); setEditing(true); }}
              className="text-xs text-white/30 hover:text-white/60 transition-colors">
              edit
            </button>
          </div>
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={onUpload}
        disabled={uploading || !displayName.trim() || favoriteCount === 0}
        className="w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: uploading ? "rgba(245,158,11,0.3)" : "rgba(245,158,11,0.9)", color: "#000" }}
      >
        {uploading ? "Uploading…" : `Upload my ${favoriteCount} favourite${favoriteCount !== 1 ? "s" : ""} to group`}
      </button>

      {/* Status */}
      {uploadError && (
        <p className="text-xs text-red-400 mt-2 text-center">{uploadError}</p>
      )}
      {lastSynced && !uploadError && (
        <p className="text-xs text-white/30 mt-2 text-center">
          Last synced at {formatSynced(lastSynced)}
        </p>
      )}
      {favoriteCount === 0 && !uploading && (
        <p className="text-xs text-white/30 mt-2 text-center">Add some favourites first</p>
      )}
    </div>
  );
}
