"use client";

import { useState } from "react";
import { getAvatarUrl } from "@/lib/avatar";

export function Avatar({
  name,
  size = 40,
  seed,
  imageUrl,
}: {
  name: string;
  size?: number;
  /** Stable id to seed the default mascot avatar with — prefer a record id
   * over the name so the avatar doesn't change if the person renames
   * themselves. Falls back to `name` when no id is available yet. */
  seed?: string;
  /** A real uploaded photo, if the person has one. Takes priority over the
   * default mascot avatar. */
  imageUrl?: string;
}) {
  const [errored, setErrored] = useState(false);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const src = imageUrl || getAvatarUrl(seed || name, size * 2);

  return (
    <div
      className="pv-border flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-primary-muted)] font-(family-name:--font-space-mono) font-bold text-[var(--color-primary)]"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {errored ? (
        initials
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}
