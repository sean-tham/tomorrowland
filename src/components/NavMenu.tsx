"use client";
import { useEffect } from "react";

type Tab = "schedule" | "stages" | "map" | "favourites" | "group" | "changelog";

const NAV: { id: Tab; icon: string; label: string; desc: string; badge?: string }[] = [
  { id: "schedule",   icon: "🗓️", label: "Schedule",   desc: "Full 3-day lineup" },
  { id: "stages",     icon: "🎡", label: "Stages",     desc: "Browse by stage" },
  { id: "map",        icon: "🗺️", label: "Map",        desc: "Find your stage" },
  { id: "favourites", icon: "❤️", label: "My Plan",    desc: "Your saved sets" },
  { id: "group",      icon: "👥", label: "Group Plan", desc: "Everyone's picks" },
  { id: "changelog",  icon: "📋", label: "Updates",    desc: "Schedule changes", badge: "NEW" },
];

interface Props {
  activeTab: Tab;
  onSelect: (tab: Tab) => void;
  onClose: () => void;
  favCount: number;
}

export type { Tab };

export function NavMenu({ activeTab, onSelect, onClose, favCount }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="relative w-full max-w-lg glass-strong rounded-t-3xl fade-in"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 24px)" }}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-3 mb-2" />

        {/* Branding */}
        <div className="px-6 pt-2 pb-4 border-b border-white/5">
          <p className="text-base font-black text-white">
            Tomorrowland <span className="text-amber-400">2026</span>
          </p>
          <p className="text-xs text-white/40 mt-0.5">Weekend 2 · July 24–26</p>
        </div>

        {/* Nav items */}
        <div className="px-4 pt-3 pb-1 space-y-1">
          {NAV.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onSelect(item.id); onClose(); }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left transition-all duration-150 active:scale-[0.98] ${
                  isActive ? "bg-amber-500/15 ring-1 ring-amber-500/30" : "hover:bg-white/5"
                }`}
              >
                <span className="text-2xl w-8 text-center shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${isActive ? "text-amber-400" : "text-white"}`}>
                      {item.label}
                    </span>
                    {item.id === "favourites" && favCount > 0 && (
                      <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full font-semibold">
                        {favCount}
                      </span>
                    )}
                    {item.badge && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
                </div>
                {isActive && <span className="text-amber-400 text-sm shrink-0">●</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
