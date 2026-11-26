"use client";

import { useState, useTransition } from "react";
import { updateAvailabilityStatus } from "@/lib/actions/profile";
import { showErrorPopup } from "@/lib/popup";
import type { AvailabilityStatus } from "@/lib/types";

const OPTIONS: { value: AvailabilityStatus; label: string; color: string }[] = [
  { value: "open", label: "Open to collaborate", color: "var(--color-success)" },
  { value: "busy", label: "Busy", color: "var(--color-accent)" },
  { value: "unavailable", label: "Unavailable", color: "var(--color-danger)" },
];

export function AvailabilitySelector({
  initialStatus,
}: {
  initialStatus: AvailabilityStatus | null | undefined;
}) {
  const [status, setStatus] = useState<AvailabilityStatus | null>(initialStatus ?? null);
  const [isPending, startTransition] = useTransition();

  function set(next: AvailabilityStatus | null) {
    const prev = status;
    setStatus(next);
    startTransition(async () => {
      try {
        await updateAvailabilityStatus(next);
      } catch (err) {
        setStatus(prev);
        showErrorPopup("Couldn't update availability", err instanceof Error ? err.message : undefined);
      }
    });
  }

  return (
    <div>
      <p className="mb-2 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-[var(--color-ink)]">
        Availability
      </p>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => set(status === o.value ? null : o.value)}
            disabled={isPending}
            className={`flex items-center gap-2 rounded-full border-2 px-3 py-1.5 font-(family-name:--font-space-grotesk) text-sm transition-colors disabled:opacity-60 ${
              status === o.value
                ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                : "border-[var(--color-ink)]/15 text-[var(--color-ink)]"
            }`}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: o.color }} />
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
