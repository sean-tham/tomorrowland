"use client";
import { useState, useEffect, useCallback } from "react";
import { APPS_SCRIPT_URL } from "@/data/config";

export interface GroupUser {
  deviceId: string;
  name: string;
  lastUpdated: string;
  favorites: string[];
}

const DEVICE_KEY          = "tml2026-deviceId";
const NAME_KEY            = "tml2026-displayName";
const SYNCED_KEY          = "tml2026-lastSynced";
const UPLOADED_FAVS_KEY   = "tml2026-uploadedFavs";

function getOrCreateDeviceId(): string {
  try {
    const stored = localStorage.getItem(DEVICE_KEY);
    if (stored) return stored;
    const id = crypto.randomUUID();
    localStorage.setItem(DEVICE_KEY, id);
    return id;
  } catch {
    return "unknown";
  }
}

// Use an Image request — browsers never CORS-block image loads, so the
// Apps Script always receives the request regardless of redirect chain.
function fireAndForget(url: string): Promise<void> {
  return new Promise(resolve => {
    const img = new window.Image();
    img.onload = img.onerror = () => resolve();
    img.src = url;
    // Fallback resolve in case the browser never fires events
    setTimeout(resolve, 8000);
  });
}

function favKey(favs: string[]) {
  return [...favs].sort().join(",");
}

export function useGroupPlan() {
  const [deviceId, setDeviceId]              = useState("");
  const [displayName, setDisplayNameState]   = useState("");
  const [groupUsers, setGroupUsers]          = useState<GroupUser[]>([]);
  const [uploading, setUploading]            = useState(false);
  const [removing, setRemoving]              = useState(false);
  const [loading, setLoading]                = useState(false);
  const [lastSynced, setLastSynced]          = useState<string | null>(null);
  const [uploadError, setUploadError]        = useState<string | null>(null);
  const [uploadedFavKey, setUploadedFavKey]  = useState<string | null>(null);

  useEffect(() => {
    const id       = getOrCreateDeviceId();
    const name     = localStorage.getItem(NAME_KEY) ?? "";
    const sync     = localStorage.getItem(SYNCED_KEY);
    const prevFavs = localStorage.getItem(UPLOADED_FAVS_KEY);
    setDeviceId(id);
    setDisplayNameState(name);
    if (sync) setLastSynced(sync);
    if (prevFavs) setUploadedFavKey(prevFavs);
  }, []);

  const setDisplayName = useCallback((name: string) => {
    setDisplayNameState(name);
    // Name change means the upload is stale
    setUploadedFavKey(null);
    try {
      localStorage.setItem(NAME_KEY, name);
      localStorage.removeItem(UPLOADED_FAVS_KEY);
    } catch {}
  }, []);

  const upload = useCallback(async (favorites: string[]) => {
    if (!deviceId || !displayName.trim()) return;
    setUploading(true);
    setUploadError(null);
    try {
      const params = new URLSearchParams({
        action:    "save",
        deviceId,
        name:      displayName.trim(),
        favorites: JSON.stringify(favorites),
      });
      await fireAndForget(`${APPS_SCRIPT_URL}?${params}`);

      const now = new Date().toISOString();
      const key = favKey(favorites);
      setLastSynced(now);
      setUploadedFavKey(key);
      try {
        localStorage.setItem(SYNCED_KEY, now);
        localStorage.setItem(UPLOADED_FAVS_KEY, key);
      } catch {}
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [deviceId, displayName]);

  const removeFromGroup = useCallback(async () => {
    if (!deviceId) return;
    setRemoving(true);
    setUploadError(null);
    try {
      const params = new URLSearchParams({ action: "delete", deviceId });
      await fireAndForget(`${APPS_SCRIPT_URL}?${params}`);

      setLastSynced(null);
      setUploadedFavKey(null);
      try {
        localStorage.removeItem(SYNCED_KEY);
        localStorage.removeItem(UPLOADED_FAVS_KEY);
      } catch {}
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Remove failed");
    } finally {
      setRemoving(false);
    }
  }, [deviceId]);

  const loadGroup = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${APPS_SCRIPT_URL}?action=load`);
      const data = await res.json();
      setGroupUsers((data.users ?? []).filter((u: GroupUser) => u.favorites.length > 0));
    } catch (err) {
      console.error("Group load failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const isUpToDate = useCallback((favorites: string[]) => {
    if (!uploadedFavKey || !lastSynced) return false;
    return favKey(favorites) === uploadedFavKey;
  }, [uploadedFavKey, lastSynced]);

  return {
    deviceId, displayName, setDisplayName,
    upload, removeFromGroup, loadGroup,
    groupUsers, uploading, removing, loading,
    lastSynced, uploadError, isUpToDate,
  };
}
