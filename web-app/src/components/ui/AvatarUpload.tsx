"use client";

import { useRef, useState } from "react";
import { Avatar } from "./Avatar";

export function AvatarUpload({
  name,
  seed,
  size = 64,
}: {
  name: string;
  seed?: string;
  size?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  return (
    <div className="relative inline-block">
      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt={name}
          className="pv-border rounded-full object-cover"
          style={{ width: size, height: size }}
        />
      ) : (
        <Avatar name={name} seed={seed} size={size} />
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="pv-border absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs"
        aria-label="Change photo"
        title="Photo isn't saved yet, no backend to store it"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#161616" strokeWidth="2.5">
          <path d="M3 7h3l2-2h8l2 2h3v12H3z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
