import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Conversation, Message } from "@/lib/types";

export async function getConversations(userId: string): Promise<Conversation[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("conversations")
    .select(
      `
      id, project_id, participant_a_id, participant_b_id, last_message, last_message_at,
      projects ( title ),
      a:participant_a_id ( name, avatar_url, role ),
      b:participant_b_id ( name, avatar_url, role ),
      conversation_reads ( user_id, last_read_at )
    `,
    )
    .or(`participant_a_id.eq.${userId},participant_b_id.eq.${userId}`)
    .order("last_message_at", { ascending: false, nullsFirst: false });

  if (error || !data) return [];

  return data.map((row) => {
    const isA = row.participant_a_id === userId;
    const counterpart = isA ? row.b : row.a;
    const myRead = row.conversation_reads?.find((r) => r.user_id === userId);
    const unread = Boolean(
      row.last_message_at && (!myRead || new Date(myRead.last_read_at) < new Date(row.last_message_at)),
    );

    return {
      id: row.id,
      projectId: row.project_id ?? undefined,
      projectTitle: row.projects?.title ?? "",
      counterpartId: isA ? row.participant_b_id : row.participant_a_id,
      counterpartName: counterpart?.name ?? "Unknown",
      counterpartRole: (counterpart?.role as Conversation["counterpartRole"]) ?? "student",
      counterpartAvatar: counterpart?.avatar_url ?? undefined,
      lastMessage: row.last_message ?? "",
      lastMessageAt: row.last_message_at ?? "",
      unread,
    } satisfies Conversation;
  });
}

export async function getConversationById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .select(
      `
      id, project_id, participant_a_id, participant_b_id,
      projects ( title ),
      a:participant_a_id ( name, avatar_url ),
      b:participant_b_id ( name, avatar_url )
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export async function getMessages(conversationId: string, viewerId: string): Promise<Message[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id === viewerId ? "me" : "them",
    body: row.body,
    createdAt: row.created_at,
  }));
}
