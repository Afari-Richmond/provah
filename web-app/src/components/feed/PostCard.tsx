"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { toggleLike, addComment, deletePost } from "@/lib/actions/feed";
import { showErrorPopup } from "@/lib/popup";
import { createClient } from "@/lib/supabase/client";
import { FIELD_COLORS } from "@/lib/fields";
import type { Post, Profile } from "@/lib/types";
import type { Database } from "@/lib/supabase/database.types";

type PostLikeRow = Database["public"]["Tables"]["post_likes"]["Row"];
type PostCommentRow = Database["public"]["Tables"]["post_comments"]["Row"];

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString();
}

export function PostCard({ post, viewer }: { post: Post; viewer: Profile }) {
  const [liked, setLiked] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [comments, setComments] = useState(post.comments);
  const [commentDraft, setCommentDraft] = useState("");
  const [showComments, setShowComments] = useState(post.comments.length > 0);
  const [isPending, startTransition] = useTransition();
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`post-${post.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "post_likes", filter: `post_id=eq.${post.id}` },
        (payload) => {
          const row = payload.new as PostLikeRow;
          if (row.user_id === viewer.id) return;
          setLikeCount((c) => c + 1);
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "post_likes", filter: `post_id=eq.${post.id}` },
        (payload) => {
          const row = payload.old as Partial<PostLikeRow>;
          if (row.user_id === viewer.id) return;
          setLikeCount((c) => Math.max(0, c - 1));
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "post_comments", filter: `post_id=eq.${post.id}` },
        async (payload) => {
          const row = payload.new as PostCommentRow;
          if (row.author_id === viewer.id) return;
          const { data: author } = await supabase
            .from("profiles")
            .select("name, avatar_url")
            .eq("id", row.author_id)
            .maybeSingle();
          setComments((c) =>
            c.some((existing) => existing.id === row.id)
              ? c
              : [
                  ...c,
                  {
                    id: row.id,
                    authorId: row.author_id,
                    authorName: author?.name ?? "Unknown",
                    authorAvatar: author?.avatar_url,
                    body: row.body,
                    createdAt: row.created_at,
                  },
                ],
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [post.id, viewer.id]);

  function handleLike() {
    setLiked((v) => !v);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
    startTransition(async () => {
      try {
        await toggleLike(post.id);
      } catch (err) {
        setLiked((v) => !v);
        setLikeCount((c) => (liked ? c + 1 : c - 1));
        showErrorPopup("Couldn't update like", err instanceof Error ? err.message : undefined);
      }
    });
  }

  function submitComment() {
    if (!commentDraft.trim()) return;
    const tempId = `optimistic-${Date.now()}`;
    const optimistic = {
      id: tempId,
      authorId: viewer.id,
      authorName: viewer.name,
      authorAvatar: viewer.avatarUrl,
      body: commentDraft.trim(),
      createdAt: new Date().toISOString(),
    };
    setComments((c) => [...c, optimistic]);
    const body = commentDraft;
    setCommentDraft("");
    startTransition(async () => {
      try {
        await addComment(post.id, body);
      } catch (err) {
        setComments((c) => c.filter((comment) => comment.id !== tempId));
        showErrorPopup("Couldn't post comment", err instanceof Error ? err.message : undefined);
      }
    });
  }

  function handleDelete() {
    setRemoved(true);
    startTransition(async () => {
      await deletePost(post.id);
    });
  }

  if (removed) return null;

  return (
    <Card className="flex flex-col gap-4 p-5" shadow="dark">
      <div className="flex items-start justify-between">
        <Link href={`/profile/${post.authorId}`} className="flex items-center gap-3">
          <Avatar name={post.authorName} seed={post.authorId} imageUrl={post.authorAvatar ?? undefined} size={44} />
          <div>
            <div className="font-(family-name:--font-space-grotesk) text-[15px] font-semibold text-[var(--color-ink)]">
              {post.authorName}
            </div>
            <div className="font-(family-name:--font-space-mono) text-xs text-black/40">
              {post.authorRole === "student" ? "Student" : "Professional"} · {timeAgo(post.createdAt)}
            </div>
          </div>
        </Link>
        {post.authorId === viewer.id && (
          <button
            type="button"
            onClick={handleDelete}
            className="font-(family-name:--font-space-mono) text-xs text-black/30 hover:text-[var(--color-danger)]"
          >
            Delete
          </button>
        )}
      </div>

      {post.body && (
        <p className="whitespace-pre-wrap font-(family-name:--font-space-grotesk) text-[15px] leading-7 text-black/80">
          {post.body}
        </p>
      )}

      {post.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.imageUrl} alt="" className="max-h-[480px] w-full rounded-2xl object-cover" />
      )}

      {post.project && (
        <Link
          href={`/projects/${post.project.id}`}
          className="pv-border flex items-center gap-2 rounded-2xl bg-[var(--color-surface)] px-4 py-3"
        >
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: FIELD_COLORS[post.project.field] }}
          />
          <span className="font-(family-name:--font-space-grotesk) text-sm font-semibold text-[var(--color-ink)]">
            {post.project.title}
          </span>
          <span className="ml-auto font-(family-name:--font-space-mono) text-xs text-[var(--color-primary)]">
            View →
          </span>
        </Link>
      )}

      <div className="flex items-center gap-5 border-t border-dashed border-black/10 pt-3">
        <button
          type="button"
          onClick={handleLike}
          disabled={isPending && false}
          className={`flex items-center gap-1.5 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] ${
            liked ? "text-[var(--color-accent)]" : "text-black/50"
          }`}
        >
          <StarIcon filled={liked} /> {likeCount > 0 ? likeCount : ""} Like
        </button>
        <button
          type="button"
          onClick={() => setShowComments((v) => !v)}
          className="flex items-center gap-1.5 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-black/50"
        >
          <CommentIcon /> {comments.length > 0 ? comments.length : ""} Comment
        </button>
      </div>

      {showComments && (
        <div className="flex flex-col gap-3 border-t border-dashed border-black/10 pt-3">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <Avatar name={c.authorName} seed={c.authorId} imageUrl={c.authorAvatar ?? undefined} size={32} />
              <div className="rounded-2xl bg-[var(--color-surface)] px-3 py-2">
                <div className="font-(family-name:--font-space-grotesk) text-xs font-semibold text-[var(--color-ink)]">
                  {c.authorName}
                </div>
                <div className="font-(family-name:--font-space-grotesk) text-sm text-black/70">{c.body}</div>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Avatar name={viewer.name} seed={viewer.id} imageUrl={viewer.avatarUrl ?? undefined} size={32} />
            <input
              value={commentDraft}
              onChange={(e) => setCommentDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitComment();
                }
              }}
              placeholder="Write a comment..."
              className="flex-1 rounded-full border-2 border-[var(--color-ink)]/15 bg-white px-4 py-2 font-(family-name:--font-space-grotesk) text-base outline-none placeholder:text-black/30 focus:border-[var(--color-primary)]"
            />
          </div>
        </div>
      )}
    </Card>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M12 3.5l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6-4.4-4.2 6-.8 2.6-5.6z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
