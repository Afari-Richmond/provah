import type { AvailabilityStatus } from "@/lib/types";

const LABELS: Record<AvailabilityStatus, { label: string; color: string }> = {
  open: { label: "Open to collaborate", color: "var(--color-success)" },
  busy: { label: "Busy", color: "var(--color-accent)" },
  unavailable: { label: "Unavailable", color: "var(--color-danger)" },
};

export function AvailabilityBadge({ status }: { status: AvailabilityStatus | null | undefined }) {
  if (!status) return null;
  const { label, color } = LABELS[status];
  return (
    <span className="inline-flex items-center gap-1.5 font-(family-name:--font-space-grotesk) text-sm font-medium text-[var(--color-ink)]">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
