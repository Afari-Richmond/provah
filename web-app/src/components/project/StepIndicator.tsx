const steps = ["Basics", "Problem & solution", "Tech & team", "Docs & links", "Review"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center">
      {steps.map((label, i) => {
        const index = i + 1;
        const state =
          index < current ? "done" : index === current ? "active" : "upcoming";
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`pv-border flex h-9 w-9 items-center justify-center rounded-full font-(family-name:--font-space-mono) text-xs font-bold ${
                  state === "upcoming"
                    ? "bg-white text-black/30"
                    : "bg-[var(--color-primary)] text-white"
                }`}
              >
                {state === "done" ? "✓" : index}
              </div>
              <span
                className={`hidden w-20 text-center font-(family-name:--font-space-mono) text-[10px] font-bold uppercase tracking-[0.03em] sm:block ${
                  state === "upcoming" ? "text-black/30" : "text-[var(--color-ink)]"
                }`}
              >
                {label}
              </span>
            </div>
            {index < steps.length && (
              <div
                className={`mb-6 h-[3px] w-6 sm:w-14 ${
                  index < current ? "bg-[var(--color-primary)]" : "bg-black/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
