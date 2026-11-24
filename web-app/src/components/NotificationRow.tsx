"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { markNotificationRead } from "@/lib/actions/notifications";
import { timeAgo } from "@/lib/format";
import type { Notification, NotificationType } from "@/lib/types";

const iconMap: Record<NotificationType, string> = {
  project_approved: "✅",
  project_rejected: "⚠️",
  new_message: "💬",
  new_interest: "⭐",
};

export function NotificationRow({ notification }: { notification: Notification }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        if (!notification.read) startTransition(() => markNotificationRead(notification.id));
        if (notification.link) router.push(notification.link);
      }}
      className="text-left"
    >
      <Card
        className={`flex items-start gap-4 p-5 ${notification.read ? "" : "bg-[var(--color-surface)]"}`}
        shadow="dark"
      >
        <span className="text-xl">{iconMap[notification.type]}</span>
        <div className="flex-1">
          <p className="font-(family-name:--font-space-grotesk) text-sm font-semibold text-[var(--color-ink)]">
            {notification.title}
          </p>
          <p className="mt-0.5 font-(family-name:--font-space-grotesk) text-sm text-black/50">
            {notification.description}
          </p>
        </div>
        <span className="shrink-0 font-(family-name:--font-space-mono) text-[10px] text-black/40">
          {timeAgo(notification.createdAt)}
        </span>
      </Card>
    </button>
  );
}
