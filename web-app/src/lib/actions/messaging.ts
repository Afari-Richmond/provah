"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";

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

export async function markConversationRead(conversationId: string) {
  const profile = await requireProfile();
  const supabase = await createClient();
  await supabase
    .from("conversation_reads")
    .upsert({ conversation_id: conversationId, user_id: profile.id, last_read_at: new Date().toISOString() });
  revalidatePath("/messages");
}

// Called from a project page when a professional wants to reach out to the
// student behind it. Reuses an existing conversation for the same pair if
// one already exists, otherwise starts a new one.
export async function startConversation(projectId: string) {
  const profile = await requireProfile();
  if (profile.role !== "professional") throw new Error("Only professionals can start a conversation");
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("student_id")
    .eq("id", projectId)
    .single();
  if (!project) throw new Error("Project not found");

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("project_id", projectId)
    .eq("student_id", project.student_id)
    .eq("professional_id", profile.id)
    .maybeSingle();

  if (existing) redirect(`/messages/${existing.id}`);

  const { data: created, error } = await supabase
    .from("conversations")
    .insert({ project_id: projectId, student_id: project.student_id, professional_id: profile.id })
    .select("id")
    .single();

  if (error || !created) throw new Error(error?.message ?? "Could not start conversation");
  redirect(`/messages/${created.id}`);
}
