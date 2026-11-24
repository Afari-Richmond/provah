"use client";

import { useState } from "react";
import { getAvatarUrl } from "@/lib/avatar";

export function MiniAvatar({ name, seed, size = 36 }: { name: string; seed: string; size?: number }) {
  const [errored, setErrored] = useState(false);
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "2px solid #161216",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F4F2FB",
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700,
        fontSize: size * 0.38,
        color: "#6C4CE0",
        flexShrink: 0,
      }}
    >
      {errored ? (
        initials
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getAvatarUrl(seed, size * 2)}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}
