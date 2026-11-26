"use client";

import { useEffect } from "react";
import { touchLastSeen } from "@/lib/actions/presence";

const HEARTBEAT_MS = 60_000;

export function PresenceHeartbeat() {
  useEffect(() => {
    touchLastSeen();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") touchLastSeen();
    }, HEARTBEAT_MS);
    return () => clearInterval(interval);
  }, []);

  return null;
}
