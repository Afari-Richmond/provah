import type { Profile } from "@/lib/types";

export type CompletenessCheck = { label: string; done: boolean };

export function getProfileCompleteness(profile: Profile): {
  percent: number;
  checks: CompletenessCheck[];
} {
  const checks: CompletenessCheck[] = [
    { label: "Add a profile photo", done: Boolean(profile.avatarUrl) },
    { label: "Write a short bio", done: Boolean(profile.bio?.trim()) },
    { label: "List a few skills", done: profile.skills.length > 0 },
    {
      label: "Add a LinkedIn or portfolio link",
      done: Boolean(profile.linkedinUrl || profile.portfolioUrl),
    },
    profile.role === "student"
      ? { label: "Add your university and field of study", done: Boolean(profile.university && profile.fieldOfStudy) }
      : { label: "Add your title and company", done: Boolean(profile.title && profile.company) },
  ];

  const done = checks.filter((c) => c.done).length;
  return { percent: Math.round((done / checks.length) * 100), checks };
}
