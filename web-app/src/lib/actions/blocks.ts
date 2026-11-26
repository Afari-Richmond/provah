"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";

export async function blockUser(otherUserId: string) {
  const profile = await requireProfile();
  if (otherUserId === profile.id) throw new Error("You can't block yourself");
  const supabase = await createClient();

  const { error } = await supabase
    .from("blocked_users")
    .insert({ blocker_id: profile.id, blocked_id: otherUserId });

  if (error && error.code !== "23505") throw new Error(error.message);

  // A block should also end any pending/accepted connection between the two.
  await supabase
    .from("connections")
    .delete()
    .or(
      `and(requester_id.eq.${profile.id},recipient_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},recipient_id.eq.${profile.id})`,
    );

  revalidatePath(`/profile/${otherUserId}`);
  revalidatePath("/settings");
}

export async function unblockUser(otherUserId: string) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("blocked_users")
    .delete()
    .eq("blocker_id", profile.id)
    .eq("blocked_id", otherUserId);

  if (error) throw new Error(error.message);
  revalidatePath(`/profile/${otherUserId}`);
  revalidatePath("/settings");
}
