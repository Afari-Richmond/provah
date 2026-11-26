"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";

export async function reportProfile(reportedId: string, reason: string) {
  const profile = await requireProfile();
  if (reportedId === profile.id) throw new Error("You can't report yourself");
  const supabase = await createClient();

  const { error } = await supabase.from("profile_reports").insert({
    reported_id: reportedId,
    reporter_id: profile.id,
    reason,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/reports");
}
