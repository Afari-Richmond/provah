import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type BlockedProfile = {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: string;
  university: string | null;
  company: string | null;
  title: string | null;
};

export async function getBlockedUsers(userId: string): Promise<BlockedProfile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blocked_users")
    .select("blocked:blocked_id ( id, name, avatar_url, role, university, company, title )")
    .eq("blocker_id", userId);

  if (error || !data) return [];
  return data
    .filter((row) => row.blocked)
    .map((row) => ({
      id: row.blocked!.id,
      name: row.blocked!.name,
      avatarUrl: row.blocked!.avatar_url,
      role: row.blocked!.role,
      university: row.blocked!.university,
      company: row.blocked!.company,
      title: row.blocked!.title,
    }));
}

// Every user id involved in a block with this user, either direction — used
// to filter someone out of search results rather than checking pair by pair.
export async function getBlockedIds(userId: string): Promise<string[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("blocked_users")
    .select("blocker_id, blocked_id")
    .or(`blocker_id.eq.${userId},blocked_id.eq.${userId}`);

  const ids = new Set<string>();
  for (const row of data ?? []) {
    ids.add(row.blocker_id === userId ? row.blocked_id : row.blocker_id);
  }
  return [...ids];
}

// Whether either side has blocked the other. Deliberately uses the
// service-role client: RLS only lets a user read blocks they created, but
// this check has to hold regardless of which side is acting, without ever
// exposing to either user who specifically blocked whom.
export async function isBlockedEitherWay(userA: string, userB: string): Promise<boolean> {
  const admin = createAdminClient();
  const { count } = await admin
    .from("blocked_users")
    .select("id", { count: "exact", head: true })
    .or(
      `and(blocker_id.eq.${userA},blocked_id.eq.${userB}),and(blocker_id.eq.${userB},blocked_id.eq.${userA})`,
    );
  return (count ?? 0) > 0;
}

export type BlockDirection = "none" | "viewer_blocked" | "blocked_by_other";

export async function getBlockDirection(viewerId: string, otherId: string): Promise<BlockDirection> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("blocked_users")
    .select("blocker_id")
    .or(
      `and(blocker_id.eq.${viewerId},blocked_id.eq.${otherId}),and(blocker_id.eq.${otherId},blocked_id.eq.${viewerId})`,
    );
  const rows = data ?? [];
  if (rows.some((r) => r.blocker_id === viewerId)) return "viewer_blocked";
  if (rows.some((r) => r.blocker_id === otherId)) return "blocked_by_other";
  return "none";
}
