"use client";
import { useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { useGroupPlan } from "@/hooks/useGroupPlan";
import { ScheduleView } from "@/components/ScheduleView";
import { StageView } from "@/components/StageView";
import { FavouritesView } from "@/components/FavouritesView";
import { GroupPlanView } from "@/components/GroupPlanView";
import { SetDetailModal } from "@/components/SetDetailModal";
import { NavMenu } from "@/components/NavMenu";
import { ChangelogView } from "@/components/ChangelogView";
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

type Tab = "schedule" | "stages" | "map" | "favourites" | "group" | "changelog";

const TAB_LABELS: Record<Tab, string> = {
  schedule:   "Schedule",
  stages:     "Stages",
  map:        "Map",
  favourites: "My Plan",
  group:      "Group Plan",
  changelog:  "Updates",
};

const TAB_ICONS: Record<Tab, string> = {
  schedule:   "🗓️",
  stages:     "🎡",
  map:        "🗺️",
  favourites: "❤️",
  group:      "👥",
  changelog:  "📋",
};

export default function Home() {
  const [tab, setTab]           = useState<Tab>("schedule");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedSet, setSelectedSet] = useState<TmlSet | null>(null);

  const { favorites, toggle, isFav, clearAll, loaded } = useFavorites();
  const {
    deviceId, displayName, setDisplayName,
    upload, removeFromGroup, loadGroup,
    groupUsers, uploading, removing, loading, lastSynced, uploadError, isUpToDate,
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

  return (
    <div className="flex flex-col h-svh max-w-lg mx-auto overflow-hidden"
      style={{ background: "radial-gradient(ellipse at top, #1a0a2e 0%, #0a0a0f 60%)" }}>

      {/* Header */}
      <header className="px-4 flex items-center gap-3 pb-2"
        style={{ paddingTop: "calc(max(env(safe-area-inset-top, 0px), 16px) + 20px)" }}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base">{TAB_ICONS[tab]}</span>
            <h1 className="text-base font-black tracking-tight text-white leading-none truncate">
              {TAB_LABELS[tab]}
            </h1>
          </div>
          <p className="text-xs text-white/30 mt-0.5 pl-6">Tomorrowland 2026 · W2</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {favorites.length > 0 && (
            <div className="glass px-2 py-1 rounded-full text-xs text-amber-400 font-semibold">
              ❤️ {favorites.length}
            </div>
          )}
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="glass w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
            aria-label="Open menu"
          >
            <div className="flex flex-col gap-1 w-4">
              <span className="block h-0.5 bg-white/70 rounded-full" />
              <span className="block h-0.5 bg-white/70 rounded-full w-3" />
              <span className="block h-0.5 bg-white/70 rounded-full" />
            </div>
          </button>
        </div>
      </header>

      {/* Content — fills all remaining space */}
      <main className="flex-1 overflow-hidden flex flex-col">
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
            onUpload={handleUpload} onRemove={removeFromGroup}
            uploading={uploading} removing={removing}
            isUpToDate={isUpToDate(favorites)}
            lastSynced={lastSynced} uploadError={uploadError}
          />
        )}
        {tab === "group" && (
          <GroupPlanView
            groupUsers={groupUsers} deviceId={deviceId}
            loading={loading} onRefresh={loadGroup} onSetClick={handleSetClick}
          />
        )}
        {tab === "changelog" && <ChangelogView />}
      </main>

      {/* Nav menu overlay */}
      {menuOpen && (
        <NavMenu
          activeTab={tab}
          onSelect={t => setTab(t)}
          onClose={() => setMenuOpen(false)}
          favCount={favorites.length}
        />
      )}

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
