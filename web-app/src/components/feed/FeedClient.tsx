"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { PostCard } from "@/components/feed/PostCard";
import { createPost, loadMoreFeedPosts } from "@/lib/actions/feed";
import { uploadToBucket } from "@/lib/uploads";
import { createClient } from "@/lib/supabase/client";
import type { Post, Profile, Project, ProjectField } from "@/lib/types";

const POST_SELECT = `
  id, author_id, body, image_url, project_id, created_at,
  author:author_id ( name, avatar_url, role ),
  projects ( id, title, field )
`;

export function FeedClient({
  initialPosts,
  viewer,
  myProjects,
  hasMore = false,
}: {
  initialPosts: Post[];
  viewer: Profile;
  myProjects: Project[];
  hasMore?: boolean;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [canLoadMore, setCanLoadMore] = useState(hasMore);
  const [loadingMore, setLoadingMore] = useState(false);
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [projectId, setProjectId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const offsetRef = useRef(initialPosts.length);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const next = await loadMoreFeedPosts(offsetRef.current);
      offsetRef.current += next.length;
      setPosts((p) => [...p, ...next]);
      if (next.length === 0) setCanLoadMore(false);
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("feed-posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        async (payload) => {
          const newId = payload.new.id as string;
          const authorId = payload.new.author_id as string;
          if (authorId === viewer.id) return;

          const { data: row } = await supabase.from("posts").select(POST_SELECT).eq("id", newId).single();
          if (!row) return;

          const post: Post = {
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
            likeCount: 0,
            likedByMe: false,
            comments: [],
          };
          setPosts((p) => (p.some((existing) => existing.id === post.id) ? p : [post, ...p]));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [viewer.id]);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToBucket("project-media", viewer.id, file);
      setImageUrl(url);
    } finally {
      setUploading(false);
    }
  }

  function submit() {
    if (!body.trim() && !imageUrl) return;
    const attached = myProjects.find((p) => p.id === projectId);
    const tempId = `optimistic-${Date.now()}`;
    const optimistic: Post = {
      id: tempId,
      authorId: viewer.id,
      authorName: viewer.name,
      authorAvatar: viewer.avatarUrl,
      authorRole: viewer.role,
      body: body.trim(),
      imageUrl,
      project: attached ? { id: attached.id, title: attached.title, field: attached.field } : null,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      likedByMe: false,
      comments: [],
    };
    setPosts((p) => [optimistic, ...p]);
    const payload = { body, imageUrl, projectId: projectId || null };
    setBody("");
    setImageUrl(null);
    setProjectId("");
    startTransition(async () => {
      // Swap the temporary client-side id for the real DB id once the
      // insert resolves — any later like/comment/delete on this post needs
      // a real UUID, not the placeholder, or the server rejects it.
      const { id: realId } = await createPost(payload);
      setPosts((p) => p.map((post) => (post.id === tempId ? { ...post, id: realId } : post)));
    });
  }

  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-10 sm:px-10">
      <h1 className="font-(family-name:--font-unbounded) text-[28px] font-bold leading-tight text-[var(--color-ink)]">
        Feed
      </h1>
      <p className="mt-1 font-(family-name:--font-space-grotesk) text-sm text-black/50">
        See what students and professionals are building, sharing, and asking.
      </p>

      <Card className="mt-6 flex flex-col gap-3 p-5" shadow="dark">
        <div className="flex items-start gap-3">
          <Avatar name={viewer.name} seed={viewer.id} imageUrl={viewer.avatarUrl ?? undefined} size={44} />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={
              viewer.role === "student"
                ? "Share progress, ask a question, or shout out something you built..."
                : "Share advice, an opportunity, or feedback for students..."
            }
            rows={3}
            className="flex-1 resize-none rounded-2xl border-2 border-[var(--color-ink)]/15 bg-white px-4 py-3 font-(family-name:--font-space-grotesk) text-base text-[var(--color-ink)] outline-none placeholder:text-black/30 focus:border-[var(--color-primary)]"
          />
        </div>

        {imageUrl && (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="" className="max-h-64 w-full rounded-2xl object-cover" />
            <button
              type="button"
              onClick={() => setImageUrl(null)}
              className="pv-border absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {myProjects.length > 0 && (
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="rounded-full border-2 border-[var(--color-ink)]/15 bg-white px-4 py-2 font-(family-name:--font-space-grotesk) text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)]"
          >
            <option value="">Attach a project (optional)</option>
            {myProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        )}

        <div className="flex items-center justify-between border-t border-dashed border-black/10 pt-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-black/50"
          >
            {uploading ? <Spinner size={14} /> : "📷"} Photo
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          <Button variant="primary" onClick={submit} loading={isPending} disabled={!body.trim() && !imageUrl}>
            Post
          </Button>
        </div>
      </Card>

      <div className="mt-6 flex flex-col gap-5">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} viewer={viewer} />)
        ) : (
          <p className="mt-10 text-center font-(family-name:--font-space-grotesk) text-sm text-black/40">
            No posts yet — be the first to share something.
          </p>
        )}
      </div>

      {canLoadMore && (
        <div className="mt-6 flex justify-center">
          <Button variant="secondary" onClick={loadMore} loading={loadingMore}>
            {loadingMore ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </main>
  );
}
