import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Post, ProjectField } from "@/lib/types";

const POST_SELECT = `
  id, author_id, body, image_url, project_id, created_at,
  author:author_id ( name, avatar_url, role ),
  projects ( id, title, field )
`;

export const FEED_PAGE_SIZE = 20;

export async function getFeedPosts(
  viewerId: string,
  limit = FEED_PAGE_SIZE,
  offset = 0,
): Promise<Post[]> {
  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error || !rows || rows.length === 0) return [];

  const postIds = rows.map((r) => r.id);

  const [{ data: likeRows }, { data: commentRows }] = await Promise.all([
    supabase.from("post_likes").select("post_id, user_id").in("post_id", postIds),
    supabase
      .from("post_comments")
      .select("id, post_id, author_id, body, created_at, author:author_id ( name, avatar_url )")
      .in("post_id", postIds)
      .order("created_at", { ascending: true }),
  ]);

  const likeCounts = new Map<string, number>();
  const likedByMe = new Set<string>();
  for (const l of likeRows ?? []) {
    likeCounts.set(l.post_id, (likeCounts.get(l.post_id) ?? 0) + 1);
    if (l.user_id === viewerId) likedByMe.add(l.post_id);
  }

  const commentsByPost = new Map<string, Post["comments"]>();
  for (const c of commentRows ?? []) {
    const list = commentsByPost.get(c.post_id) ?? [];
    list.push({
      id: c.id,
      authorId: c.author_id,
      authorName: c.author?.name ?? "Unknown",
      authorAvatar: c.author?.avatar_url,
      body: c.body,
      createdAt: c.created_at,
    });
    commentsByPost.set(c.post_id, list);
  }

  return rows.map((row) => ({
    id: row.id,
    authorId: row.author_id,
    authorName: row.author?.name ?? "Unknown",
    authorAvatar: row.author?.avatar_url,
    authorRole: (row.author?.role as Post["authorRole"]) ?? "student",
    body: row.body,
    imageUrl: row.image_url,
    project: row.projects
      ? { id: row.projects.id, title: row.projects.title, field: row.projects.field as ProjectField }
      : null,
    createdAt: row.created_at,
    likeCount: likeCounts.get(row.id) ?? 0,
    likedByMe: likedByMe.has(row.id),
    comments: commentsByPost.get(row.id) ?? [],
  }));
}
