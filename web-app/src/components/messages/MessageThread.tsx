"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { AppNav } from "@/components/layout/AppNav";
import { ConversationList } from "@/components/messages/ConversationList";
import { Avatar } from "@/components/ui/Avatar";
import { sendMessage } from "@/lib/actions/messaging";
import type { Conversation, Message, Profile } from "@/lib/types";

export function MessageThread({
  conversations,
  conversation,
  initialMessages,
  profile,
  unreadCount,
}: {
  conversations: Conversation[];
  conversation: Conversation;
  initialMessages: Message[];
  profile: Profile;
  unreadCount: number;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [isPending, startTransition] = useTransition();

  function send() {
    const body = draft.trim();
    if (!body) return;
    setDraft("");
    setMessages((m) => [
      ...m,
      {
        id: `temp-${Date.now()}`,
        conversationId: conversation.id,
        senderId: "me",
        body,
        createdAt: new Date().toISOString(),
      },
    ]);
    startTransition(async () => {
      await sendMessage(conversation.id, body);
    });
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      <AppNav active="/messages" profile={profile} unreadCount={unreadCount} />
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-full max-w-sm shrink-0 overflow-y-auto border-r border-[var(--color-border)] sm:block">
          <div className="px-4 py-5">
            <h1 className="font-(family-name:--font-unbounded) text-xl font-bold text-[var(--color-ink)]">
              Messages
            </h1>
          </div>
          <ConversationList conversations={conversations} />
        </aside>

        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-6 py-4">
            <Link href="/messages" className="sm:hidden">
              ←
            </Link>
            <Avatar name={conversation.counterpartName} seed={conversation.counterpartId} size={40} />
            <div>
              <p className="font-(family-name:--font-space-grotesk) text-sm font-semibold text-[var(--color-ink)]">
                {conversation.counterpartName}
              </p>
              <Link
                href={`/projects/${conversation.projectId}`}
                className="font-(family-name:--font-space-grotesk) text-xs text-[var(--color-primary)]"
              >
                {conversation.projectTitle}
              </Link>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="flex flex-col gap-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 font-(family-name:--font-space-grotesk) text-[15px] leading-6 ${
                    m.senderId === "me"
                      ? "self-end bg-[var(--color-primary)] text-white"
                      : "self-start bg-[var(--color-surface)] text-[var(--color-ink)]"
                  }`}
                >
                  {m.body}
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-3 border-t border-[var(--color-border)] px-6 py-4"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a message..."
              className="flex-1 rounded-full border-2 border-[var(--color-ink)]/15 bg-white px-5 py-3 font-(family-name:--font-space-grotesk) text-[15px] text-[var(--color-ink)] outline-none placeholder:text-black/30 focus:border-[var(--color-primary)]"
            />
            <button
              type="submit"
              disabled={isPending}
              className="pv-border pv-shadow-sm flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] font-bold text-[var(--color-ink)] disabled:opacity-50"
              aria-label="Send"
            >
              →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
