"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";

export async function endorseSkill(profileId: string, skill: string) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("skill_endorsements")
    .insert({ profile_id: profileId, skill, endorser_id: profile.id });

  if (error && error.code !== "23505") throw new Error("Couldn't endorse this skill");
  revalidatePath(`/profile/${profileId}`);
}

export async function unendorseSkill(profileId: string, skill: string) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("skill_endorsements")
    .delete()
    .eq("profile_id", profileId)
    .eq("skill", skill)
    .eq("endorser_id", profile.id);

  if (error) throw new Error(error.message);
  revalidatePath(`/profile/${profileId}`);
}
