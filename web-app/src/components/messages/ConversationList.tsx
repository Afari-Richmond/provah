"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { mockConversations } from "@/lib/mockData";
import { timeAgo } from "@/lib/format";

export function ConversationList() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col divide-y divide-[var(--color-border)]">
      {mockConversations.map((c) => {
        const active = pathname === `/messages/${c.id}`;
        return (
          <Link
            key={c.id}
            href={`/messages/${c.id}`}
            className={`flex gap-3 px-4 py-4 transition-colors ${
              active ? "bg-[var(--color-surface)]" : "hover:bg-[var(--color-surface)]/60"
            }`}
          >
            <Avatar name={c.counterpartName} seed={c.counterpartId} size={44} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-(family-name:--font-space-grotesk) text-sm font-semibold text-[var(--color-ink)]">
                  {c.counterpartName}
                </span>
                <span className="shrink-0 font-(family-name:--font-space-mono) text-[10px] text-black/40">
                  {timeAgo(c.lastMessageAt)}
                </span>
              </div>
              <p className="truncate font-(family-name:--font-space-grotesk) text-xs text-black/50">
                {c.projectTitle}
              </p>
              <p
                className={`mt-1 truncate font-(family-name:--font-space-grotesk) text-sm ${
                  c.unread ? "font-semibold text-[var(--color-ink)]" : "text-black/50"
                }`}
              >
                {c.lastMessage}
              </p>
            </div>
            {c.unread && (
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
