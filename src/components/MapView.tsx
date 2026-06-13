"use client";
import { useEffect, useRef, useState } from "react";
import { STAGES } from "@/data/lineup";
import type { TmlSet } from "@/data/lineup";

// Approximate GPS coordinates for each stage at De Schorre, Boom, Belgium.
// Positions are estimated from festival maps — accurate enough for navigation,
// but not survey-grade.
const STAGE_COORDS: Record<string, [number, number]> = {
  "MAINSTAGE":              [51.08920, 4.36680],
  "FREEDOM BY BUD":         [51.08990, 4.36410],
  "THE ROSE GARDEN":        [51.09260, 4.36520],
  "ELIXIR":                 [51.08720, 4.36760],
  "CAGE":                   [51.09220, 4.36780],
  "THE RAVE CAVE":          [51.09150, 4.36320],
  "PLANAXIS":               [51.09080, 4.36620],
  "MELODIA BY CORONA":      [51.08870, 4.36880],
  "RISE":                   [51.08780, 4.36450],
  "ATMOSPHERE":             [51.09050, 4.36200],
  "CORE":                   [51.08820, 4.36560],
  "CRYSTAL GARDEN":         [51.08960, 4.36730],
  "THE LIBRARY":            [51.08850, 4.36820],
  "MOOSE BAR":              [51.08760, 4.36310],
  "HOUSE OF FORTUNE BY JBL":[51.08690, 4.36890],
};

// Festival bounds for initial view
const FESTIVAL_CENTER: [number, number] = [51.0898, 4.3660];
const FESTIVAL_ZOOM = 16;

interface Props {
  favorites: string[];
  onSetClick: (set: TmlSet) => void;
  onToggleFav: (id: string) => void;
}

export function MapView({ favorites, onSetClick, onToggleFav }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<import("leaflet").Map | null>(null);
  const userMarkerRef = useRef<import("leaflet").Marker | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "loading" | "active" | "error">("idle");
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    let map: import("leaflet").Map;

    import("leaflet").then(L => {
      // Fix default icon paths for Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      map = L.map(mapRef.current!, {
        center: FESTIVAL_CENTER,
        zoom: FESTIVAL_ZOOM,
        zoomControl: false,
        attributionControl: false,
      });

      leafletMapRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);

      L.control.attribution({ prefix: false, position: "bottomright" })
        .addAttribution('© <a href="https://carto.com/">CARTO</a> © <a href="https://openstreetmap.org">OSM</a>')
        .addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Stage markers
      Object.entries(STAGE_COORDS).forEach(([stageName, coords]) => {
        const stage = STAGES[stageName];
        const color = stage?.color ?? "#f59e0b";

        const icon = L.divIcon({
          html: `<div style="
            background:${color};
            width:12px;height:12px;
            border-radius:50%;
            border:2px solid rgba(255,255,255,0.8);
            box-shadow:0 0 8px ${color}88, 0 2px 4px rgba(0,0,0,0.4);
          "></div>`,
          className: "",
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        const marker = L.marker(coords, { icon }).addTo(map);
        marker.on("click", () => setSelectedStage(stageName));
      });

      // Stage name labels (shown at zoom 17+)
      Object.entries(STAGE_COORDS).forEach(([stageName, coords]) => {
        const stage = STAGES[stageName];
        const color = stage?.color ?? "#f59e0b";
        const label = L.divIcon({
          html: `<div style="
            color:${color};
            font-size:9px;
            font-weight:700;
            white-space:nowrap;
            text-shadow:0 1px 3px rgba(0,0,0,0.9);
            pointer-events:none;
            margin-top:8px;
          ">${stage?.shortName ?? stageName}</div>`,
          className: "",
          iconSize: [0, 0],
          iconAnchor: [0, -4],
        });
        L.marker([coords[0] - 0.00004, coords[1]], { icon: label, interactive: false }).addTo(map);
      });
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  function locateMe() {
    if (!leafletMapRef.current) return;
    setGpsStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        import("leaflet").then(L => {
          const { latitude: lat, longitude: lng } = pos.coords;
          const map = leafletMapRef.current!;

          if (userMarkerRef.current) userMarkerRef.current.remove();

          const userIcon = L.divIcon({
            html: `<div style="
              width:16px;height:16px;
              background:#3b82f6;
              border-radius:50%;
              border:3px solid white;
              box-shadow:0 0 0 4px rgba(59,130,246,0.3), 0 2px 6px rgba(0,0,0,0.4);
            "></div>`,
            className: "",
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          });

          userMarkerRef.current = L.marker([lat, lng], { icon: userIcon }).addTo(map);
          map.flyTo([lat, lng], 17, { duration: 1.5 });
          setGpsStatus("active");
        });
      },
      () => setGpsStatus("error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const selectedStageData = selectedStage ? STAGES[selectedStage] : null;

  return (
    <div className="flex flex-col h-full relative">
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />

      {/* Map container */}
      <div ref={mapRef} className="flex-1 w-full" style={{ zIndex: 0 }} />

      {/* Disclaimer badge */}
      <div className="absolute top-3 left-3 right-3 z-10 pointer-events-none">
        <div className="glass text-center px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 text-xs text-white/50 mx-auto">
          <span>📍</span>
          <span>Stage positions are approximate</span>
        </div>
      </div>

      {/* Locate me button */}
      <button
        onClick={locateMe}
        className={`absolute bottom-28 right-4 z-10 w-12 h-12 rounded-full glass-strong flex items-center justify-center text-xl shadow-lg transition-all duration-200 ${
          gpsStatus === "active" ? "ring-2 ring-blue-400" : ""
        } ${gpsStatus === "loading" ? "animate-pulse" : ""}`}
      >
        {gpsStatus === "error" ? "🚫" : gpsStatus === "active" ? "🔵" : "📍"}
      </button>

      {/* Stage info drawer */}
      {selectedStage && selectedStageData && (
        <div className="absolute bottom-20 left-3 right-3 z-10 glass-strong rounded-2xl p-4 fade-in">
          <div className="flex items-start gap-3">
            <div
              className="w-3 h-3 rounded-full shrink-0 mt-1"
              style={{ background: selectedStageData.color, boxShadow: `0 0 8px ${selectedStageData.color}88` }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-white">{selectedStage}</p>
              <p className="text-xs text-white/50 mt-0.5">{selectedStageData.vibe}</p>
              <div className="flex gap-1 mt-1.5 flex-wrap">
                {selectedStageData.genres.slice(0, 3).map(g => (
                  <span key={g} className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{ background: `${selectedStageData.color}22`, color: selectedStageData.color }}>
                    {g}
                  </span>
                ))}
              </div>
            </div>
            <button onClick={() => setSelectedStage(null)} className="text-white/40 text-lg leading-none shrink-0">✕</button>
          </div>
        </div>
      )}

      {gpsStatus === "error" && (
        <div className="absolute bottom-36 left-3 right-3 z-10 bg-red-500/20 border border-red-500/30 rounded-xl px-3 py-2 text-xs text-red-400 text-center">
          Location access denied — enable it in your browser settings
        </div>
      )}
    </div>
  );
}
