import "server-only";
import { createClient } from "@/lib/supabase/server";

export type SkillEndorsementSummary = {
  skill: string;
  count: number;
  endorsedByMe: boolean;
};

export async function getSkillEndorsements(
  profileId: string,
  viewerId: string,
): Promise<SkillEndorsementSummary[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("skill_endorsements")
    .select("skill, endorser_id")
    .eq("profile_id", profileId);

  const bySkill = new Map<string, { count: number; endorsedByMe: boolean }>();
  for (const row of data ?? []) {
    const entry = bySkill.get(row.skill) ?? { count: 0, endorsedByMe: false };
    entry.count += 1;
    if (row.endorser_id === viewerId) entry.endorsedByMe = true;
    bySkill.set(row.skill, entry);
  }

  return [...bySkill.entries()].map(([skill, v]) => ({ skill, ...v }));
}
