"use client";

import { useState, KeyboardEvent } from "react";

export function TagInput({
  label,
  hint,
  tags,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");

  function addTag() {
    const v = value.trim();
    if (v && !tags.includes(v)) {
      onChange([...tags, v]);
    }
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && value === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-[var(--color-ink)]">
          {label}
        </label>
        {hint && (
          <span className="font-(family-name:--font-space-grotesk) text-xs text-black/40">
            {hint}
          </span>
        )}
      </div>
      <div className="flex min-h-[52px] w-full flex-wrap items-center gap-2 rounded-2xl border-2 border-[var(--color-ink)]/15 bg-white px-3 py-2 focus-within:border-[var(--color-primary)]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface)] px-3 py-1 font-(family-name:--font-space-grotesk) text-sm text-[var(--color-ink)]"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              className="-m-1.5 p-1.5 text-base leading-none text-black/50 hover:text-black/70"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="min-w-[120px] flex-1 bg-transparent py-1 font-(family-name:--font-space-grotesk) text-base text-[var(--color-ink)] outline-none placeholder:text-black/30"
        />
      </div>
    </div>
  );
}
