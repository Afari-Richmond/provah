import { getProfileCompleteness } from "@/lib/profileCompleteness";
import type { Profile } from "@/lib/types";

export function ProfileCompletenessBanner({ profile }: { profile: Profile }) {
  const { percent, checks } = getProfileCompleteness(profile);
  if (percent === 100) return null;
  const missing = checks.filter((c) => !c.done);

  return (
    <div className="pv-border rounded-2xl bg-[var(--color-surface)] p-4">
      <div className="flex items-center justify-between">
        <p className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/50">
          Profile {percent}% complete
        </p>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-[var(--color-primary)] transition-[width]"
          style={{ width: `${percent}%` }}
        />
      </div>
      <ul className="mt-3 flex flex-col gap-1">
        {missing.map((c) => (
          <li key={c.label} className="font-(family-name:--font-space-grotesk) text-sm text-black/60">
            · {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
