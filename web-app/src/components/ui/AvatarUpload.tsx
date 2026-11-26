"use client";

import { useRef, useState } from "react";
import { Avatar } from "./Avatar";
import { Spinner } from "./Spinner";
import { uploadToBucket } from "@/lib/uploads";
import { updateAvatarUrl } from "@/lib/actions/profile";

export function AvatarUpload({
  name,
  seed,
  imageUrl,
  size = 64,
}: {
  name: string;
  seed: string;
  imageUrl?: string | null;
  size?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setUploading(true);
    try {
      const url = await uploadToBucket("avatars", seed, file);
      await updateAvatarUrl(url);
    } finally {
      setUploading(false);
    }
  }

  const src = previewUrl || imageUrl;

  return (
    <div className="relative inline-block">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="pv-border rounded-full object-cover"
          style={{ width: size, height: size }}
        />
      ) : (
        <Avatar name={name} seed={seed} size={size} />
      )}
      {uploading && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40"
          style={{ width: size, height: size }}
        >
          <Spinner size={size * 0.4} />
        </div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="pv-border absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs"
        aria-label="Change photo"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#161616" strokeWidth="2.5">
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
