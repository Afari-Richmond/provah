/**
 * Loading placeholder — a pulsing block the size/shape of the content it
 * stands in for. `motion-safe:` keeps the pulse off for anyone with
 * prefers-reduced-motion set, same as the spinner/mobile-panel.
 */
export function Skeleton({
  className = "",
  rounded = "rounded-lg",
}: {
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`motion-safe:animate-pulse bg-[var(--color-surface-muted)] ${rounded} ${className}`}
    />
  );
}

export function SkeletonText({ lines = 1, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3.5 ${i === lines - 1 && lines > 1 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`pv-border rounded-2xl bg-white p-5 ${className}`}>
      <Skeleton className="h-36 w-full" rounded="rounded-xl" />
      <div className="mt-4 flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
      </div>
    </div>
  );
}
