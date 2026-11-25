"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { searchProfiles } from "@/lib/data/users";

// Powers the "new message" compose search — a thin client-callable wrapper
// around the server-only searchProfiles(), scoped to exclude yourself.
export async function searchUsersToMessage(query: string) {
  const profile = await requireProfile();
  const results = await searchProfiles(query, profile.id);
  return results.map((p) => ({
    id: p.id,
    name: p.name,
    avatarUrl: p.avatarUrl ?? null,
    role: p.role,
    subtitle: p.role === "student" ? p.university : p.company,
  }));
}

export async function sendMessage(conversationId: string, body: string) {
  const profile = await requireProfile();
  if (!body.trim()) return;
  const supabase = await createClient();

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: profile.id,
    body: body.trim(),
  });

  if (error) throw new Error(error.message);

  await supabase
    .from("conversation_reads")
    .upsert({ conversation_id: conversationId, user_id: profile.id, last_read_at: new Date().toISOString() });

  revalidatePath(`/messages/${conversationId}`);
  revalidatePath("/messages");
}

// Called directly from the conversation page's own render (not from a
// client-triggered Server Action), so it can't call revalidatePath here —
// that's only legal inside an actual Server Action invocation. The
// conversation list page already fetches fresh read-state on its own next
// visit, so no explicit revalidation is needed.
export async function markConversationRead(conversationId: string) {
  const profile = await requireProfile();
  const supabase = await createClient();
  await supabase
    .from("conversation_reads")
    .upsert({ conversation_id: conversationId, user_id: profile.id, last_read_at: new Date().toISOString() });
}

// Called from a project page when someone wants to reach out to the
// student behind it. Reuses an existing conversation for the same pair if
// one already exists, otherwise starts a new one.
export async function startConversation(projectId: string) {
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("student_id")
    .eq("id", projectId)
    .single();
  if (!project) throw new Error("Project not found");

  await startConversationWithUser(project.student_id, projectId);
}

// General-purpose: start (or resume) a direct conversation with any other
// user on the platform, optionally anchored to a project (e.g. "message
// the builder" from a project page) or standalone (e.g. from their profile
// or the feed).
export async function startConversationWithUser(otherUserId: string, projectId?: string) {
  const profile = await requireProfile();
  if (otherUserId === profile.id) throw new Error("You can't message yourself");
  const supabase = await createClient();

  // participant order is arbitrary; check both orderings for an existing
  // conversation with the same project (or no project) and same pair.
  let query = supabase
    .from("conversations")
    .select("id")
    .or(
      `and(participant_a_id.eq.${profile.id},participant_b_id.eq.${otherUserId}),and(participant_a_id.eq.${otherUserId},participant_b_id.eq.${profile.id})`,
    );
  query = projectId ? query.eq("project_id", projectId) : query.is("project_id", null);
  const { data: existing } = await query.maybeSingle();

  if (existing) redirect(`/messages/${existing.id}`);

  const { data: created, error } = await supabase
    .from("conversations")
    .insert({
      project_id: projectId ?? null,
      participant_a_id: profile.id,
      participant_b_id: otherUserId,
    })
    .select("id")
    .single();

  if (error || !created) throw new Error(error?.message ?? "Could not start conversation");
  redirect(`/messages/${created.id}`);
}
