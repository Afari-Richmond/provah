type ToastKind = "success" | "error";

/**
 * Non-blocking notification — bottom-right on desktop, full-width bottom
 * sheet on mobile. Auto-dismiss timing is owned by the caller (PopupHost);
 * this is just the presentation.
 */
export function Toast({
  kind,
  title,
  description,
  onDismiss,
}: {
  kind: ToastKind;
  title: string;
  description?: string;
  onDismiss: () => void;
}) {
  const isSuccess = kind === "success";

  return (
    <div
      role="status"
      aria-live="polite"
      className="pv-border pv-shadow-sm fixed inset-x-4 bottom-4 z-[var(--z-toast)] flex items-start gap-3 rounded-2xl bg-white p-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-w-sm"
    >
      <div
        className="pv-border flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ background: isSuccess ? "var(--color-success)" : "var(--color-danger)" }}
      >
        {isSuccess ? <CheckIcon /> : <XIcon />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-(family-name:--font-space-grotesk) text-sm font-semibold text-[var(--color-ink)]">
          {title}
        </p>
        {description && (
          <p className="mt-0.5 font-(family-name:--font-space-grotesk) text-xs text-black/60">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="shrink-0 text-black/40 hover:text-[var(--color-ink)]"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
