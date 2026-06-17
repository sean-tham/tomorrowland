"use client";
import { useEffect, useState } from "react";

const MESSAGES = [
  "Summoning the lineup…",
  "Casting festival magic…",
  "Tuning the sound system…",
  "Warming up the crowd…",
  "Raising the mainstage…",
];

const STARS = ["✨", "⭐", "🌟", "💫", "✦"];

export function TmlLoader({ label }: { label?: string }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [stars, setStars]   = useState<{ id: number; x: number; emoji: string; delay: number; dur: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => setMsgIdx(i => (i + 1) % MESSAGES.length), 1800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const items = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      emoji: STARS[i % STARS.length],
      delay: Math.random() * 2,
      dur: 1.5 + Math.random() * 1.5,
    }));
    setStars(items);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full pb-12 select-none overflow-hidden relative">
      {/* Falling stars */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map(s => (
          <span
            key={s.id}
            className="absolute text-lg opacity-0"
            style={{
              left: `${s.x}%`,
              top: "-10%",
              animation: `starFall ${s.dur}s ${s.delay}s ease-in infinite`,
            }}
          >
            {s.emoji}
          </span>
        ))}
      </div>

      {/* Central icon */}
      <div className="relative mb-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
          style={{
            background: "radial-gradient(circle, #f59e0b33, #8b5cf633)",
            animation: "pulse 2s ease-in-out infinite",
            boxShadow: "0 0 40px #f59e0b44, 0 0 80px #8b5cf622",
          }}
        >
          🎪
        </div>
        {/* Orbit ring */}
        <div
          className="absolute inset-0 rounded-full border border-amber-500/30"
          style={{ animation: "spin 3s linear infinite", transform: "scale(1.4)" }}
        />
        <div
          className="absolute inset-0 rounded-full border border-violet-500/20"
          style={{ animation: "spin 5s linear infinite reverse", transform: "scale(1.7)" }}
        />
      </div>

      <p className="text-white font-bold text-base mb-1">
        {label ?? "Group Plan"}
      </p>
      <p
        key={msgIdx}
        className="text-white/40 text-sm fade-in"
      >
        {MESSAGES[msgIdx]}
      </p>

      {/* Dot pulse */}
      <div className="flex gap-1.5 mt-5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-amber-500"
            style={{ animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite` }}
          />
        ))}
      </div>

      <style>{`
        @keyframes starFall {
          0%   { transform: translateY(0) rotate(0deg);   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes spin {
          from { transform: scale(var(--s, 1.4)) rotate(0deg); }
          to   { transform: scale(var(--s, 1.4)) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
