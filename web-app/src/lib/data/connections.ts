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

export type PendingConnectionRequest = {
  id: string;
  createdAt: string;
  requester: {
    id: string;
    name: string;
    role: string;
    avatarUrl: string | null;
    university: string | null;
    company: string | null;
    title: string | null;
  };
};

export async function getPendingConnectionRequests(
  userId: string,
): Promise<PendingConnectionRequest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("connections")
    .select("id, created_at, requester:requester_id ( id, name, role, avatar_url, university, company, title )")
    .eq("recipient_id", userId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data
    .filter((row) => row.requester)
    .map((row) => ({
      id: row.id,
      createdAt: row.created_at,
      requester: {
        id: row.requester!.id,
        name: row.requester!.name,
        role: row.requester!.role,
        avatarUrl: row.requester!.avatar_url,
        university: row.requester!.university,
        company: row.requester!.company,
        title: row.requester!.title,
      },
    }));
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
