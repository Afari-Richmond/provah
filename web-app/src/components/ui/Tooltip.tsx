import { type ReactNode } from "react";

/**
 * Pure-CSS hover/focus tooltip — no JS state, so it works the instant the
 * trigger is focusable. Wrap any single inline-block trigger (usually an
 * icon-only button) with a `label`; shows above the trigger by default.
 */
export function Tooltip({
  label,
  children,
  side = "top",
}: {
  label: string;
  children: ReactNode;
  side?: "top" | "bottom";
}) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 z-[var(--z-dropdown)] -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--color-ink)] px-2.5 py-1.5 font-(family-name:--font-space-grotesk) text-xs font-medium text-white opacity-0 transition-opacity delay-150 group-hover:opacity-100 group-focus-within:opacity-100 ${
          side === "top" ? "bottom-full mb-2" : "top-full mt-2"
        }`}
      >
        {label}
      </span>
    </span>
  );
}
