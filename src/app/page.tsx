"use client";
import { useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { useGroupPlan } from "@/hooks/useGroupPlan";
import { ScheduleView } from "@/components/ScheduleView";
import { StageView } from "@/components/StageView";
import { FavouritesView } from "@/components/FavouritesView";
import { GroupPlanView } from "@/components/GroupPlanView";
import { SetDetailModal } from "@/components/SetDetailModal";
import dynamic from "next/dynamic";
import { TmlSet } from "@/data/lineup";

const MapView = dynamic(() => import("@/components/MapView").then(m => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-4xl animate-pulse">🗺️</div>
    </div>
  ),
});

type Tab = "schedule" | "stages" | "map" | "favourites" | "group";

export default function Home() {
  const [tab, setTab]           = useState<Tab>("schedule");
  const [selectedSet, setSelectedSet] = useState<TmlSet | null>(null);

  const { favorites, toggle, isFav, clearAll, loaded } = useFavorites();
  const {
    deviceId, displayName, setDisplayName,
    upload, loadGroup, groupUsers, uploading, loading, lastSynced, uploadError,
  } = useGroupPlan();

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-4xl animate-pulse">🎪</div>
      </div>
    );
  }

  const handleSetClick = (set: TmlSet) => setSelectedSet(set);
  const handleClose    = () => setSelectedSet(null);
  const handleUpload   = () => upload(favorites);

  const NAV: { id: Tab; icon: string; label: string }[] = [
    { id: "schedule",   icon: "🗓️",  label: "Schedule" },
    { id: "stages",     icon: "🎡",  label: "Stages"   },
    { id: "map",        icon: "🗺️",  label: "Map"      },
    { id: "favourites", icon: "❤️",  label: "My Plan"  },
    { id: "group",      icon: "👥",  label: "Group"    },
  ];

  return (
    <div className="flex flex-col h-svh max-w-lg mx-auto overflow-hidden"
      style={{ background: "radial-gradient(ellipse at top, #1a0a2e 0%, #0a0a0f 60%)" }}>

      {/* Header */}
      <header className="px-4 flex items-center gap-3"
        style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 16px)" }}>
        <div className="flex-1">
          <h1 className="text-lg font-black tracking-tight text-white leading-none">
            Tomorrowland <span className="text-amber-400">2026</span>
          </h1>
          <p className="text-xs text-white/40 mt-0.5">Weekend 2 · July 24–26</p>
        </div>
        {favorites.length > 0 && (
          <div className="glass px-2.5 py-1 rounded-full text-xs text-amber-400 font-semibold">
            ❤️ {favorites.length}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 overflow-hidden flex flex-col pt-2">
        {tab === "schedule" && (
          <ScheduleView favorites={favorites} onToggleFav={toggle} onSetClick={handleSetClick} />
        )}
        {tab === "stages" && (
          <StageView favorites={favorites} onToggleFav={toggle} onSetClick={handleSetClick} />
        )}
        {tab === "map" && (
          <MapView favorites={favorites} onSetClick={handleSetClick} onToggleFav={toggle} />
        )}
        {tab === "favourites" && (
          <FavouritesView
            favorites={favorites} onToggleFav={toggle} onClearAll={clearAll} onSetClick={handleSetClick}
            displayName={displayName} onSetName={setDisplayName}
            onUpload={handleUpload} uploading={uploading}
            lastSynced={lastSynced} uploadError={uploadError}
          />
        )}
        {tab === "group" && (
          <GroupPlanView
            groupUsers={groupUsers} deviceId={deviceId}
            loading={loading} onRefresh={loadGroup} onSetClick={handleSetClick}
          />
        )}
      </main>

      {/* Bottom nav */}
      <nav className="glass-strong border-t border-white/5 flex items-center justify-around"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 8px)" }}>
        {NAV.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex flex-col items-center gap-0.5 py-3 px-3 rounded-xl transition-all duration-200 ${
              tab === t.id ? "text-amber-400" : "text-white/40"
            }`}>
            <span className="text-xl">{t.icon}</span>
            <span className="text-[9px] font-semibold tracking-wide">{t.label}</span>
          </button>
        ))}
      </nav>

      {/* Set detail modal */}
      {selectedSet && (
        <SetDetailModal
          set={selectedSet} isFav={isFav(selectedSet.id)}
          favorites={favorites} onToggleFav={toggle}
          onClose={handleClose} onSetClick={s => setSelectedSet(s)}
        />
      )}
    </div>
  );
}
