"use client";
import { CHANGES, CHANGELOG_DATE, ChangeEntry } from "@/data/changelog";

const TYPE_CONFIG: Record<ChangeEntry["type"], { label: string; color: string; bg: string; icon: string }> = {
  added:   { label: "Added",   color: "#10b981", bg: "#10b98120", icon: "✦" },
  removed: { label: "Removed", color: "#ef4444", bg: "#ef444420", icon: "✕" },
  changed: { label: "Changed", color: "#f59e0b", bg: "#f59e0b20", icon: "↻" },
  renamed: { label: "Renamed", color: "#8b5cf6", bg: "#8b5cf620", icon: "⇄" },
};

export function ChangelogView() {
  const grouped = CHANGES.reduce<Record<ChangeEntry["type"], ChangeEntry[]>>(
    (acc, c) => { acc[c.type].push(c); return acc; },
    { added: [], removed: [], changed: [], renamed: [] }
  );

  const ORDER: ChangeEntry["type"][] = ["renamed", "added", "removed", "changed"];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-3 pb-4">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📋</span>
            <div>
              <h2 className="text-base font-black text-white">Schedule Update</h2>
              <p className="text-xs text-white/40 mt-0.5">Last updated {CHANGELOG_DATE}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {ORDER.map(type => {
              const items = grouped[type];
              if (items.length === 0) return null;
              const cfg = TYPE_CONFIG[type];
              return (
                <span key={type} className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{ background: cfg.bg, color: cfg.color }}>
                  {cfg.icon} {items.length} {cfg.label.toLowerCase()}
                </span>
              );
            })}
          </div>
          <p className="text-xs text-amber-400/80 mt-3 leading-relaxed">
            ⚠️ Check your saved favourites — times and artists have changed significantly.
          </p>
        </div>
      </div>

      {/* Change list */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-4">
        {ORDER.map(type => {
          const items = grouped[type];
          if (items.length === 0) return null;
          const cfg = TYPE_CONFIG[type];
          return (
            <div key={type}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold" style={{ color: cfg.color }}>{cfg.icon} {cfg.label}</span>
                <div className="flex-1 h-px" style={{ background: `${cfg.color}30` }} />
                <span className="text-xs" style={{ color: `${cfg.color}80` }}>{items.length}</span>
              </div>
              <div className="space-y-1.5">
                {items.map((entry, i) => (
                  <div key={i}
                    className="rounded-xl px-3 py-2.5"
                    style={{ background: cfg.bg, borderLeft: `2px solid ${cfg.color}` }}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white">{entry.description}</p>
                        <p className="text-xs mt-0.5" style={{ color: cfg.color + "cc" }}>{entry.category}</p>
                        {entry.detail && (
                          <p className="text-xs text-white/40 mt-1">{entry.detail}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
