"use server";

import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";

export async function exportAccountData() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [
    { data: fullProfile },
    { data: projects },
    { data: connections },
    { data: sentMessages },
    { data: bookmarks },
    { data: posts },
    { data: comments },
    { data: notifications },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", profile.id).single(),
    supabase.from("projects").select("*").eq("student_id", profile.id),
    supabase
      .from("connections")
      .select("id, requester_id, recipient_id, status, created_at, responded_at")
      .or(`requester_id.eq.${profile.id},recipient_id.eq.${profile.id}`),
    supabase.from("messages").select("id, conversation_id, body, created_at").eq("sender_id", profile.id),
    supabase.from("bookmarks").select("project_id, created_at").eq("user_id", profile.id),
    supabase.from("posts").select("*").eq("author_id", profile.id),
    supabase.from("post_comments").select("*").eq("author_id", profile.id),
    supabase.from("notifications").select("*").eq("user_id", profile.id),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    profile: fullProfile,
    projects: projects ?? [],
    connections: connections ?? [],
    sentMessages: sentMessages ?? [],
    bookmarks: bookmarks ?? [],
    posts: posts ?? [],
    comments: comments ?? [],
    notifications: notifications ?? [],
  };
}
