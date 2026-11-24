"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { toggleLike, addComment, deletePost } from "@/lib/actions/feed";
import { FIELD_COLORS } from "@/lib/fields";
import type { Post, Profile } from "@/lib/types";

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

  function handleLike() {
    setLiked((v) => !v);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
    startTransition(async () => {
      await toggleLike(post.id);
    });
  }

  function submitComment() {
    if (!commentDraft.trim()) return;
    const optimistic = {
      id: `optimistic-${Date.now()}`,
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
      await addComment(post.id, body);
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
          {liked ? "★" : "☆"} {likeCount > 0 ? likeCount : ""} Like
        </button>
        <button
          type="button"
          onClick={() => setShowComments((v) => !v)}
          className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-black/50"
        >
          💬 {comments.length > 0 ? comments.length : ""} Comment
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
              className="flex-1 rounded-full border-2 border-[var(--color-ink)]/15 bg-white px-4 py-2 font-(family-name:--font-space-grotesk) text-sm outline-none placeholder:text-black/30 focus:border-[var(--color-primary)]"
            />
          </div>
        </div>
      )}
    </Card>
  );
}
