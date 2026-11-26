"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { getAllUsersForAdmin, ADMIN_USERS_PAGE_SIZE, getAuditLog, AUDIT_LOG_PAGE_SIZE } from "@/lib/data/admin";
import { logAdminAction } from "@/lib/auditLog";

export async function loadMoreAdminUsers(offset: number) {
  await requireRole("admin");
  return getAllUsersForAdmin({ limit: ADMIN_USERS_PAGE_SIZE, offset });
}

export async function loadMoreAuditLog(offset: number) {
  await requireRole("admin");
  return getAuditLog({ limit: AUDIT_LOG_PAGE_SIZE, offset });
}

export async function toggleUserSuspension(userId: string, suspend: boolean) {
  const admin = await requireRole("admin");
  const supabase = await createClient();
  await supabase.from("profiles").update({ suspended: suspend }).eq("id", userId);
  await logAdminAction(supabase, admin.id, suspend ? "suspend_user" : "reactivate_user", "user", userId);
  revalidatePath("/admin/users");
}

export async function bulkSetUserSuspension(userIds: string[], suspend: boolean) {
  const admin = await requireRole("admin");
  const supabase = await createClient();
  await supabase.from("profiles").update({ suspended: suspend }).in("id", userIds);
  for (const userId of userIds) {
    await logAdminAction(
      supabase,
      admin.id,
      suspend ? "suspend_user" : "reactivate_user",
      "user",
      userId,
      "bulk action",
    );
  }
  revalidatePath("/admin/users");
}

export async function resolveProjectReport(reportId: string, outcome: "resolved" | "dismissed") {
  const admin = await requireRole("admin");
  const supabase = await createClient();
  await supabase
    .from("project_reports")
    .update({ status: outcome, resolved_at: new Date().toISOString() })
    .eq("id", reportId);
  await logAdminAction(supabase, admin.id, `${outcome}_project_report`, "project_report", reportId);
  revalidatePath("/admin/reports");
}

export async function resolveProfileReport(reportId: string, outcome: "resolved" | "dismissed") {
  const admin = await requireRole("admin");
  const supabase = await createClient();
  await supabase
    .from("profile_reports")
    .update({ status: outcome, resolved_at: new Date().toISOString() })
    .eq("id", reportId);
  await logAdminAction(supabase, admin.id, `${outcome}_profile_report`, "profile_report", reportId);
  revalidatePath("/admin/reports");
}

export async function decideProfessionalVerification(userId: string, approve: boolean) {
  const admin = await requireRole("admin");
  const supabase = await createClient();

  if (approve) {
    await supabase.from("profiles").update({ verified: true }).eq("id", userId);
  } else {
    await supabase.from("profiles").update({ suspended: true }).eq("id", userId);
  }
  await logAdminAction(
    supabase,
    admin.id,
    approve ? "verify_professional" : "decline_professional",
    "user",
    userId,
  );
  revalidatePath("/admin/professionals");
}
