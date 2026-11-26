"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/actions/notifications";
import { timeAgo } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import type { Notification, NotificationType } from "@/lib/types";
import type { Database } from "@/lib/supabase/database.types";

type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];

function mapRow(row: NotificationRow): Notification {
  return {
    id: row.id,
    type: row.type as NotificationType,
    title: row.title,
    description: row.description ?? "",
    read: row.read,
    link: row.link ?? null,
    createdAt: row.created_at,
  };
}

const iconMap: Record<NotificationType, string> = {
  project_approved: "✅",
  project_rejected: "⚠️",
  new_message: "💬",
  new_interest: "⭐",
  connection_request: "🤝",
  connection_accepted: "🎉",
};

export function NotificationsDropdown({
  notifications: initialNotifications,
  unreadCount: initialUnreadCount,
  userId,
}: {
  notifications: Notification[];
  unreadCount: number;
  userId: string;
}) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const router = useRouter();
  const [, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        (payload) => {
          const next = mapRow(payload.new as NotificationRow);
          setNotifications((list) => [next, ...list].slice(0, 20));
          setUnreadCount((c) => c + 1);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  function openNotification(n: Notification) {
    setOpen(false);
    if (!n.read) {
      setNotifications((list) => list.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
      setUnreadCount((c) => Math.max(0, c - 1));
      startTransition(() => markNotificationRead(n.id));
    }
    if (n.link) router.push(n.link);
  }

  function markAll() {
    setNotifications((list) => list.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    startTransition(() => markAllNotificationsRead());
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="pv-border relative flex h-10 w-10 items-center justify-center rounded-full bg-white"
        aria-label="Notifications"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent)] font-(family-name:--font-space-mono) text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="pv-border pv-shadow-sm fixed inset-x-4 top-20 z-[var(--z-dropdown)] rounded-2xl bg-white md:absolute md:inset-x-auto md:right-0 md:top-12 md:w-[22rem] md:max-w-[calc(100vw-2rem)]">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
            <span className="font-(family-name:--font-unbounded) text-sm font-bold text-[var(--color-ink)]">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAll}
                className="font-(family-name:--font-space-mono) text-[10px] font-bold uppercase tracking-[0.03em] text-[var(--color-primary)]"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[22rem] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center font-(family-name:--font-space-grotesk) text-sm text-black/40">
                Nothing yet — we&apos;ll let you know when something happens.
              </p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => openNotification(n)}
                  className={`flex w-full items-start gap-3 border-b border-[var(--color-border)] px-4 py-3 text-left last:border-0 hover:bg-[var(--color-surface)]/60 ${
                    n.read ? "" : "bg-[var(--color-surface)]"
                  }`}
                >
                  <span className="text-base">{iconMap[n.type]}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-(family-name:--font-space-grotesk) text-sm font-semibold text-[var(--color-ink)]">
                      {n.title}
                    </p>
                    <p className="line-clamp-1 font-(family-name:--font-space-grotesk) text-xs text-black/50">
                      {n.description}
                    </p>
                  </div>
                  <span className="shrink-0 font-(family-name:--font-space-mono) text-[10px] text-black/60">
                    {timeAgo(n.createdAt)}
                  </span>
                </button>
              ))
            )}
          </div>

          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="block border-t border-[var(--color-border)] px-4 py-3 text-center font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-primary)]"
          >
            View all
          </Link>
        </div>
      )}
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
