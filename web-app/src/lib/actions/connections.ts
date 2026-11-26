"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { isBlockedEitherWay } from "@/lib/data/blocks";

export async function sendConnectionRequest(recipientId: string) {
  const profile = await requireProfile();
  if (recipientId === profile.id) throw new Error("You can't connect with yourself");
  if (await isBlockedEitherWay(profile.id, recipientId)) {
    throw new Error("You can't connect with this person");
  }
  const supabase = await createClient();

  const { error } = await supabase.from("connections").insert({
    requester_id: profile.id,
    recipient_id: recipientId,
  });

  if (error && error.code !== "23505") throw new Error(error.message);
  revalidatePath(`/profile/${recipientId}`);
}

export async function respondToConnectionRequest(connectionId: string, accept: boolean) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("connections")
    .update({ status: accept ? "accepted" : "declined", responded_at: new Date().toISOString() })
    .eq("id", connectionId)
    .eq("recipient_id", profile.id);

  if (error) throw new Error(error.message);
  revalidatePath("/notifications");
  revalidatePath("/dashboard");
}

export async function cancelConnection(otherUserId: string) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("connections")
    .delete()
    .or(
      `and(requester_id.eq.${profile.id},recipient_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},recipient_id.eq.${profile.id})`,
    );

  if (error) throw new Error(error.message);
  revalidatePath(`/profile/${otherUserId}`);
}
