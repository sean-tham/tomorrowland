"use client";
import { useState, useEffect, useCallback } from "react";
import { APPS_SCRIPT_URL } from "@/data/config";

export interface GroupUser {
  deviceId: string;
  name: string;
  lastUpdated: string;
  favorites: string[];
}

const DEVICE_KEY  = "tml2026-deviceId";
const NAME_KEY    = "tml2026-displayName";
const SYNCED_KEY  = "tml2026-lastSynced";

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

export function useGroupPlan() {
  const [deviceId, setDeviceId]       = useState("");
  const [displayName, setDisplayNameState] = useState("");
  const [groupUsers, setGroupUsers]   = useState<GroupUser[]>([]);
  const [uploading, setUploading]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [lastSynced, setLastSynced]   = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    const id   = getOrCreateDeviceId();
    const name = localStorage.getItem(NAME_KEY) ?? "";
    const sync = localStorage.getItem(SYNCED_KEY);
    setDeviceId(id);
    setDisplayNameState(name);
    if (sync) setLastSynced(sync);
  }, []);

  const setDisplayName = useCallback((name: string) => {
    setDisplayNameState(name);
    try { localStorage.setItem(NAME_KEY, name); } catch {}
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
      await fetch(`${APPS_SCRIPT_URL}?${params}`, { redirect: "follow" });
      const now = new Date().toISOString();
      setLastSynced(now);
      try { localStorage.setItem(SYNCED_KEY, now); } catch {}
    } catch {
      setUploadError("Upload failed — check your connection");
    } finally {
      setUploading(false);
    }
  }, [deviceId, displayName]);

  const loadGroup = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${APPS_SCRIPT_URL}?action=load`, { redirect: "follow" });
      const data = await res.json();
      setGroupUsers(data.users ?? []);
    } catch {
      // silently fail — group plan just shows empty
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deviceId,
    displayName,
    setDisplayName,
    upload,
    loadGroup,
    groupUsers,
    uploading,
    loading,
    lastSynced,
    uploadError,
  };
}
