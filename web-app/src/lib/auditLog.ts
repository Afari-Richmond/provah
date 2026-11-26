import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export async function logAdminAction(
  supabase: SupabaseClient<Database>,
  adminId: string,
  action: string,
  targetType: string,
  targetId: string | null,
  detail?: string,
) {
  await supabase.from("admin_audit_log").insert({
    admin_id: adminId,
    action,
    target_type: targetType,
    target_id: targetId,
    detail: detail ?? null,
  });
}
