import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Notification } from "@/lib/types";

export async function getNotifications(userId: string): Promise<Notification[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    type: row.type as Notification["type"],
    title: row.title,
    description: row.description ?? "",
    createdAt: row.created_at,
    read: row.read,
    link: row.link,
  }));
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);
  return count ?? 0;
}
