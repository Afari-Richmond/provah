"use client";

import { useState, useTransition } from "react";
import { endorseSkill, unendorseSkill } from "@/lib/actions/endorsements";
import { showErrorPopup } from "@/lib/popup";
import type { SkillEndorsementSummary } from "@/lib/data/endorsements";

export function SkillEndorsements({
  profileId,
  skills,
  summaries,
  canEndorse,
}: {
  profileId: string;
  skills: string[];
  summaries: SkillEndorsementSummary[];
  canEndorse: boolean;
}) {
  const [state, setState] = useState<Record<string, { count: number; endorsedByMe: boolean }>>(() => {
    const m: Record<string, { count: number; endorsedByMe: boolean }> = {};
    for (const s of skills) m[s] = { count: 0, endorsedByMe: false };
    for (const s of summaries) m[s.skill] = { count: s.count, endorsedByMe: s.endorsedByMe };
    return m;
  });
  const [isPending, startTransition] = useTransition();

  function toggle(skill: string) {
    if (!canEndorse || isPending) return;
    const current = state[skill];
    const next = current.endorsedByMe
      ? { count: current.count - 1, endorsedByMe: false }
      : { count: current.count + 1, endorsedByMe: true };
    setState((s) => ({ ...s, [skill]: next }));

    startTransition(async () => {
      try {
        if (current.endorsedByMe) await unendorseSkill(profileId, skill);
        else await endorseSkill(profileId, skill);
      } catch (err) {
        setState((s) => ({ ...s, [skill]: current }));
        showErrorPopup("Couldn't update endorsement", err instanceof Error ? err.message : undefined);
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => {
        const { count, endorsedByMe } = state[skill];
        return (
          <button
            key={skill}
            type="button"
            onClick={() => toggle(skill)}
            disabled={!canEndorse}
            title={canEndorse ? undefined : "Connect with them to endorse this skill"}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-(family-name:--font-space-grotesk) text-sm transition-colors ${
              endorsedByMe
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-surface)] text-[var(--color-ink)]"
            } ${canEndorse ? "cursor-pointer" : "cursor-default"}`}
          >
            {skill}
            {count > 0 && <span className="font-(family-name:--font-space-mono) text-xs opacity-70">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
