import "server-only";
import { createClient } from "@/lib/supabase/server";

export type AdminUser = {
  id: string;
  role: "student" | "professional" | "admin";
  name: string;
  email: string;
  detail: string;
  verified: boolean;
  status: "active" | "suspended";
};

export async function getAllUsersForAdmin(): Promise<AdminUser[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_list_profiles");
  if (error || !data) return [];

  return data
    .filter((row) => row.role !== "admin")
    .map((row) => ({
      id: row.id,
      role: row.role as AdminUser["role"],
      name: row.name,
      email: row.email,
      detail:
        row.role === "student"
          ? [row.university, row.field_of_study].filter(Boolean).join(" · ")
          : [row.title, row.company].filter(Boolean).join(" at "),
      verified: row.verified,
      status: row.suspended ? "suspended" : "active",
    }));
}

export async function getPendingProfessionals(): Promise<AdminUser[]> {
  const users = await getAllUsersForAdmin();
  return users.filter((u) => u.role === "professional" && !u.verified);
}

export async function getAdminAnalytics() {
  const supabase = await createClient();

  const [{ data: profiles }, { data: projects }] = await Promise.all([
    supabase.from("profiles").select("role, created_at"),
    supabase.from("projects").select("status, created_at, updated_at"),
  ]);

  const students = (profiles ?? []).filter((p) => p.role === "student").length;
  const professionals = (profiles ?? []).filter((p) => p.role === "professional").length;
  const published = (projects ?? []).filter((p) => p.status === "published").length;
  const rejected = (projects ?? []).filter((p) => p.status === "rejected").length;
  const pending = (projects ?? []).filter((p) => p.status === "pending_review").length;
  const decided = published + rejected;
  const approvalRate = decided > 0 ? Math.round((published / decided) * 100) : 0;

  const decidedProjects = (projects ?? []).filter((p) => p.status === "published" || p.status === "rejected");
  const avgTurnaroundDays =
    decidedProjects.length > 0
      ? decidedProjects.reduce((sum, p) => {
          const days =
            (new Date(p.updated_at).getTime() - new Date(p.created_at).getTime()) / 86_400_000;
          return sum + days;
        }, 0) / decidedProjects.length
      : 0;

  const weeks: { label: string; students: number; professionals: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - i * 7 - 6);
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() - i * 7);

    const inWeek = (p: { created_at: string }) => {
      const d = new Date(p.created_at);
      return d >= weekStart && d <= weekEnd;
    };

    weeks.push({
      label: `W${6 - i}`,
      students: (profiles ?? []).filter((p) => p.role === "student" && inWeek(p)).length,
      professionals: (profiles ?? []).filter((p) => p.role === "professional" && inWeek(p)).length,
    });
  }

  return {
    students,
    professionals,
    approvalRate,
    pending,
    avgTurnaroundDays,
    signupsByWeek: weeks,
  };
}
