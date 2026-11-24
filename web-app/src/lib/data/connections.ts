import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ConnectionStatus } from "@/lib/types";

export async function getConnectionStatus(
  viewerId: string,
  otherUserId: string,
): Promise<{ status: ConnectionStatus; connectionId: string | null }> {
  if (viewerId === otherUserId) return { status: "none", connectionId: null };
  const supabase = await createClient();
  const { data } = await supabase
    .from("connections")
    .select("id, requester_id, recipient_id, status")
    .or(
      `and(requester_id.eq.${viewerId},recipient_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},recipient_id.eq.${viewerId})`,
    )
    .maybeSingle();

  if (!data) return { status: "none", connectionId: null };
  if (data.status === "accepted") return { status: "accepted", connectionId: data.id };
  if (data.status === "declined") return { status: "declined", connectionId: data.id };
  return {
    status: data.requester_id === viewerId ? "pending_sent" : "pending_received",
    connectionId: data.id,
  };
}

export async function getConnectionCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("connections")
    .select("id", { count: "exact", head: true })
    .eq("status", "accepted")
    .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);
  return count ?? 0;
}

export async function getPendingConnectionRequests(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("connections")
    .select("id, created_at, requester:requester_id ( id, name, role, avatar_url, university, company, title )")
    .eq("recipient_id", userId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}

export async function getConnections(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("connections")
    .select(
      "id, requester_id, recipient_id, requester:requester_id ( id, name, role, avatar_url, university, company, title ), recipient:recipient_id ( id, name, role, avatar_url, university, company, title )",
    )
    .eq("status", "accepted")
    .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);

  if (error || !data) return [];
  return data.map((row) => (row.requester_id === userId ? row.recipient : row.requester));
}
