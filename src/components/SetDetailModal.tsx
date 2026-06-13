"use client";
import { useEffect, useState } from "react";
import { TmlSet, STAGES, LINEUP, getSimilarSets, formatTime } from "@/data/lineup";
import { getProfile, getSpotifyUrl } from "@/data/djProfiles";
import { SetCard } from "./SetCard";

const DAY_LABELS: Record<string, string> = {
  "2026-07-24": "Friday · July 24",
  "2026-07-25": "Saturday · July 25",
  "2026-07-26": "Sunday · July 26",
};

function DjPhoto({ artist, stageColor, wikipediaPage }: { artist: string; stageColor: string; wikipediaPage?: string }) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    const slug = wikipediaPage ?? artist.split(" ").slice(0, 3).join("_");
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.thumbnail?.source) setImgUrl(data.thumbnail.source);
      })
      .catch(() => {});
  }, [artist, wikipediaPage]);

  const initials = artist.replace(/b2b.*/i, "").trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("");

  if (imgUrl) {
    return (
      <img
        src={imgUrl}
        alt={artist}
        className="w-20 h-20 rounded-2xl object-cover object-top shrink-0"
        onError={() => setImgUrl(null)}
      />
    );
  }

  return (
    <div
      className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white shrink-0"
      style={{ background: `linear-gradient(135deg, ${stageColor}70, ${stageColor}30)` }}
    >
      {initials}
    </div>
  );
}

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
  const stageColor = stage?.color ?? "#f59e0b";
  const similar = getSimilarSets(set, LINEUP, []);
  const profile = getProfile(set.artist);
  const spotifyUrl = getSpotifyUrl(set.artist);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-t-3xl overflow-y-auto max-h-[90vh] glass-strong fade-in"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 24px)" }}
      >
        {/* Back button + handle */}
        <div className="flex items-center px-4 pt-4 pb-2 gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm font-medium"
          >
            <span className="text-lg leading-none">←</span>
            <span>Back</span>
          </button>
          <div className="flex-1 flex justify-center">
            <div className="w-8 h-1 bg-white/20 rounded-full" />
          </div>
          <div className="w-14" /> {/* balance spacer */}
        </div>

        {/* DJ photo + name header */}
        <div className="px-4 mb-4">
          <div className="flex gap-4 items-start">
            <DjPhoto artist={set.artist} stageColor={stageColor} wikipediaPage={profile?.wikipediaPage} />
            <div className="flex-1 min-w-0 pt-1">
              <h2 className="text-xl font-black text-white leading-tight">{set.artist}</h2>
              <p className="text-sm mt-0.5 font-semibold" style={{ color: stageColor }}>{set.stage}</p>
              <p className="text-xs text-white/50 mt-1">
                {DAY_LABELS[set.date]} · {formatTime(set.startTime)} – {formatTime(set.endTime)}
              </p>
              {/* Genre pills */}
              <div className="flex gap-1 mt-2 flex-wrap">
                {set.genres.map(g => (
                  <span key={g} className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: `${stageColor}22`, color: stageColor }}>
                    {g}
                  </span>
                ))}
              </div>
            </div>
            <button
              className={`text-2xl shrink-0 transition-transform duration-150 ${isFav ? "scale-110" : "opacity-30"}`}
              onClick={() => onToggleFav(set.id)}
            >
              {isFav ? "❤️" : "🤍"}
            </button>
          </div>
        </div>

        {/* Bio */}
        {profile?.bio ? (
          <div className="mx-4 mb-4 p-4 rounded-2xl glass">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">About</p>
            <p className="text-sm text-white/80 leading-relaxed">{profile.bio}</p>
          </div>
        ) : (
          <div className="mx-4 mb-4 p-4 rounded-2xl glass">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Stage vibe</p>
            <p className="text-sm text-white/80">{stage?.vibe}</p>
          </div>
        )}

        {/* Spotify link */}
        <div className="mx-4 mb-4">
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3.5 rounded-2xl transition-all active:scale-95"
            style={{ background: "#1DB954" + "22", border: "1px solid #1DB95440" }}
          >
            <span className="text-2xl">🎵</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Listen on Spotify</p>
              <p className="text-xs text-white/50">Search {set.artist.split(" ").slice(0, 2).join(" ")} on Spotify</p>
            </div>
            <span className="text-white/40 text-sm">↗</span>
          </a>
        </div>

        {/* Stage info (if we have a bio, show stage separately) */}
        {profile?.bio && (
          <div className="mx-4 mb-4 p-3.5 rounded-2xl glass">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Stage</p>
            <p className="text-xs text-white/60">{stage?.vibe}</p>
          </div>
        )}

        {/* Similar artists */}
        {similar.length > 0 && (
          <div className="mx-4 mb-2">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Similar acts this weekend</p>
            <div className="space-y-1">
              {similar.slice(0, 4).map(s => (
                <SetCard
                  key={s.id}
                  set={s}
                  isFav={favorites.includes(s.id)}
                  onToggleFav={onToggleFav}
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
