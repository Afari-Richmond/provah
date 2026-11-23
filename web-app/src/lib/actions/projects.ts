"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfile, requireRole } from "@/lib/auth";
import type { ProjectField } from "@/lib/types";

type ProjectFormInput = {
  title: string;
  field: ProjectField;
  problem: string;
  solution: string;
  techStack: string[];
  team: string[];
  githubUrl?: string;
  demoUrl?: string;
  submitForReview?: boolean;
};

async function upsertTeamMembers(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectId: string,
  names: string[],
) {
  await supabase.from("project_team_members").delete().eq("project_id", projectId);
  if (names.length === 0) return;
  await supabase
    .from("project_team_members")
    .insert(names.map((name) => ({ project_id: projectId, name })));
}

export async function createProject(input: ProjectFormInput) {
  const profile = await requireRole("student");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      student_id: profile.id,
      title: input.title,
      field: input.field,
      problem: input.problem,
      solution: input.solution,
      tech_stack: input.techStack,
      github_url: input.githubUrl || null,
      demo_url: input.demoUrl || null,
      university: profile.university ?? null,
      status: input.submitForReview ? "pending_review" : "draft",
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to create project");

  await upsertTeamMembers(supabase, data.id, input.team);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateProject(projectId: string, input: ProjectFormInput) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("projects")
    .select("student_id, status")
    .eq("id", projectId)
    .single();

  if (!existing || existing.student_id !== profile.id) {
    throw new Error("You can only edit your own projects");
  }

  const nextStatus = existing.status === "rejected" ? "pending_review" : existing.status;

  const { error } = await supabase
    .from("projects")
    .update({
      title: input.title,
      field: input.field,
      problem: input.problem,
      solution: input.solution,
      tech_stack: input.techStack,
      github_url: input.githubUrl || null,
      demo_url: input.demoUrl || null,
      status: nextStatus,
      rejection_reason: nextStatus === "pending_review" ? null : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId);

  if (error) throw new Error(error.message);

  await upsertTeamMembers(supabase, projectId, input.team);
  revalidatePath("/dashboard");
  revalidatePath(`/projects/${projectId}`);
  redirect("/dashboard");
}

export async function submitProjectForReview(projectId: string) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ status: "pending_review", updated_at: new Date().toISOString() })
    .eq("id", projectId)
    .eq("student_id", profile.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function deleteProject(projectId: string) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("student_id", profile.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function toggleBookmark(projectId: string) {
  const profile = await requireRole("professional");
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", profile.id)
    .eq("project_id", projectId)
    .maybeSingle();

  if (existing) {
    await supabase.from("bookmarks").delete().eq("id", existing.id);
  } else {
    await supabase.from("bookmarks").insert({ user_id: profile.id, project_id: projectId });
  }

  revalidatePath("/saved");
  revalidatePath("/discover");
  revalidatePath(`/projects/${projectId}`);
}

export async function incrementProjectViews(projectId: string) {
  const supabase = await createClient();
  await supabase.rpc("increment_project_views", { p_project_id: projectId }).throwOnError();
}

export async function moderateProject(
  projectId: string,
  action: "approve" | "reject",
  rejectionReason?: string,
) {
  await requireRole("admin");
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({
      status: action === "approve" ? "published" : "rejected",
      rejection_reason: action === "reject" ? (rejectionReason ?? "") : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/review-queue");
  revalidatePath("/discover");
}
