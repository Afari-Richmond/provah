import { ReactNode } from "react";

const colorMap = {
  primary: "bg-[var(--color-primary)]",
  accent: "bg-[var(--color-accent)]",
  ink: "bg-[var(--color-ink)]",
};

export function Eyebrow({
  children,
  dot = "primary",
}: {
  children: ReactNode;
  dot?: keyof typeof colorMap;
}) {
  return (
    <div className="inline-flex items-center gap-2 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-ink)]">
      <span className={`h-3 w-3 rounded-sm ${colorMap[dot]}`} />
      {children}
    </div>
  );
}

export function StatusPill({
  status,
}: {
  status: "draft" | "pending_review" | "published" | "rejected";
}) {
  const styles: Record<typeof status, string> = {
    draft: "bg-[var(--color-surface-muted)] text-[var(--color-ink)]",
    pending_review: "bg-[var(--color-accent-muted)] text-[var(--color-accent)]",
    published: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
    rejected: "bg-[var(--color-danger)]/10 text-[var(--color-danger)]",
  };
  const labels: Record<typeof status, string> = {
    draft: "Draft",
    pending_review: "Pending review",
    published: "Published",
    rejected: "Rejected",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export function Chip({
  children,
  active = false,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pv-border rounded-full px-4 py-2 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] transition-colors ${
        active
          ? "bg-[var(--color-ink)] text-white"
          : "bg-white text-[var(--color-ink)]"
      }`}
    >
      {children}
    </button>
  );
}
