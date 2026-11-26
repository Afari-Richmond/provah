import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import type { Project } from "@/lib/types";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"] & {
  profiles: { name: string; avatar_url: string | null } | null;
  project_team_members: { id: string; name: string }[];
  project_documents: { id: string; label: string; kind: string; url: string }[];
};

export const PUBLISHED_PROJECTS_PAGE_SIZE = 60;

const PROJECT_SELECT = `
  *,
  profiles:student_id ( name, avatar_url ),
  project_team_members ( id, name ),
  project_documents ( id, label, kind, url )
`;

function mapProject(
  row: ProjectRow,
  counts: { bookmarks: number; messages: number },
): Project {
  return {
    id: row.id,
    title: row.title,
    field: row.field as Project["field"],
    status: row.status as Project["status"],
    problem: row.problem ?? "",
    solution: row.solution ?? "",
    longDescription: row.long_description ?? undefined,
    techStack: row.tech_stack ?? [],
    tags: row.tags ?? [],
    team: row.project_team_members ?? [],
    githubUrl: row.github_url ?? undefined,
    demoUrl: row.demo_url ?? undefined,
    thesisUrl: row.thesis_url ?? undefined,
    documents: (row.project_documents ?? []).map((d) => ({
      id: d.id,
      label: d.label,
      kind: d.kind as Project["documents"][number]["kind"],
      url: d.url,
    })),
    imageUrl: row.image_url ?? undefined,
    views: row.views,
    bookmarks: counts.bookmarks,
    messages: counts.messages,
    createdAt: row.created_at,
    university: row.university ?? "",
    studentId: row.student_id,
    studentName: row.profiles?.name ?? "Unknown",
    studentAvatar: row.profiles?.avatar_url ?? undefined,
    rejectionReason: row.rejection_reason ?? undefined,
  };
}

async function withCounts(supabase: Awaited<ReturnType<typeof createClient>>, rows: ProjectRow[]) {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);

  const [{ data: bookmarkRows }, { data: convoRows }] = await Promise.all([
    supabase.from("bookmarks").select("project_id").in("project_id", ids),
    supabase.from("conversations").select("id, project_id").in("project_id", ids),
  ]);

  const bookmarkCounts = new Map<string, number>();
  for (const b of bookmarkRows ?? []) {
    bookmarkCounts.set(b.project_id, (bookmarkCounts.get(b.project_id) ?? 0) + 1);
  }

  const convoIds = (convoRows ?? []).map((c) => c.id);
  const messageCountByConvo = new Map<string, number>();
  if (convoIds.length > 0) {
    const { data: messageRows } = await supabase
      .from("messages")
      .select("conversation_id")
      .in("conversation_id", convoIds);
    for (const m of messageRows ?? []) {
      messageCountByConvo.set(m.conversation_id, (messageCountByConvo.get(m.conversation_id) ?? 0) + 1);
    }
  }
  const messageCounts = new Map<string, number>();
  for (const c of convoRows ?? []) {
    if (!c.project_id) continue;
    messageCounts.set(
      c.project_id,
      (messageCounts.get(c.project_id) ?? 0) + (messageCountByConvo.get(c.id) ?? 0),
    );
  }

  return rows.map((row) =>
    mapProject(row, {
      bookmarks: bookmarkCounts.get(row.id) ?? 0,
      messages: messageCounts.get(row.id) ?? 0,
    }),
  );
}

export async function getPublishedProjects(opts?: { limit?: number; offset?: number }): Promise<Project[]> {
  const supabase = await createClient();
  let query = supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (opts?.limit) {
    const offset = opts.offset ?? 0;
    query = query.range(offset, offset + opts.limit - 1);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return withCounts(supabase, data as unknown as ProjectRow[]);
}

export async function searchProjects(query: string): Promise<Project[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const published = await getPublishedProjects();
  return published.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.university.toLowerCase().includes(q) ||
      p.field.toLowerCase().includes(q) ||
      p.techStack.some((t) => t.toLowerCase().includes(q)) ||
      p.tags.some((t) => t.toLowerCase().includes(q)),
  );
}

export async function getProjectsByStudent(studentId: string): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return withCounts(supabase, data as unknown as ProjectRow[]);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  const [mapped] = await withCounts(supabase, [data as unknown as ProjectRow]);
  return mapped;
}

export async function getBookmarkedProjects(userId: string): Promise<Project[]> {
  const supabase = await createClient();
  const { data: bookmarkRows } = await supabase
    .from("bookmarks")
    .select("project_id")
    .eq("user_id", userId);

  const ids = (bookmarkRows ?? []).map((b) => b.project_id);
  if (ids.length === 0) return [];

  const { data, error } = await supabase.from("projects").select(PROJECT_SELECT).in("id", ids);
  if (error || !data) return [];
  return withCounts(supabase, data as unknown as ProjectRow[]);
}

export async function getBookmarkedProjectIds(userId: string): Promise<Set<string>> {
  const supabase = await createClient();
  const { data } = await supabase.from("bookmarks").select("project_id").eq("user_id", userId);
  return new Set((data ?? []).map((b) => b.project_id));
}

export async function getPendingReviewProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("status", "pending_review")
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return withCounts(supabase, data as unknown as ProjectRow[]);
}

export async function getAllProjectsForAdmin(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return withCounts(supabase, data as unknown as ProjectRow[]);
}
