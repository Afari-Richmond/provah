export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <span
      className="relative inline-block shrink-0"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      <span className="absolute inset-0 rounded-full border-[2.5px] border-current opacity-20" />
      <span className="absolute inset-0 animate-spin rounded-full border-[2.5px] border-transparent border-t-current" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icon.png"
        alt=""
        className="absolute inset-0 m-auto rounded-full"
        style={{ width: size * 0.56, height: size * 0.56 }}
      />
    </span>
  );
}

export function FullscreenSpinner() {
  return (
    <div className="flex min-h-[40vh] w-full items-center justify-center py-20">
      <Spinner size={40} />
    </div>
  );
}

/**
 * Plain `position: fixed` div, not a portal — fixed elements anchor to the
 * viewport regardless of where they sit in the DOM, so this covers the
 * whole window (nav included) even though it renders inside a route's own
 * tree. Deliberately not a client component either: a portal/client overlay
 * needs `document` and JS hydration, so it would render nothing for the
 * entire server-side delay this exists to cover.
 */
export function FullScreenLoadingOverlay({ label }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/90 backdrop-blur-[2px]">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="provah-spinner">
          <div className="provah-spinner-ring" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon.png"
            alt=""
            className="provah-spinner-logo"
            style={{ width: 44, height: 44 }}
          />
        </div>
        {label && (
          <p className="font-(family-name:--font-space-grotesk) text-sm font-medium text-black/60">
            {label}
          </p>
        )}
      </div>
    </div>
  );
}
