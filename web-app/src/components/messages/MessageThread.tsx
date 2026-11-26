"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { AppNav } from "@/components/layout/AppNav";
import { ConversationList } from "@/components/messages/ConversationList";
import { NewConversationButton } from "@/components/messages/NewConversationButton";
import { Avatar } from "@/components/ui/Avatar";
import { Spinner } from "@/components/ui/Spinner";
import { sendMessage } from "@/lib/actions/messaging";
import { createClient } from "@/lib/supabase/client";
import { timeAgo } from "@/lib/format";
import type { Conversation, Message, Notification, Profile } from "@/lib/types";
import type { Database } from "@/lib/supabase/database.types";

type MessageRow = Database["public"]["Tables"]["messages"]["Row"];
type ConversationReadRow = Database["public"]["Tables"]["conversation_reads"]["Row"];
type RealtimeChannel = ReturnType<ReturnType<typeof createClient>["channel"]>;

const TYPING_IDLE_MS = 3_000;

export function MessageThread({
  conversations,
  conversation,
  initialMessages,
  profile,
  unreadCount,
  unreadMessageCount,
  notifications,
}: {
  conversations: Conversation[];
  conversation: Conversation;
  initialMessages: Message[];
  profile: Profile;
  unreadCount: number;
  unreadMessageCount: number;
  notifications: Notification[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isOnline, setIsOnline] = useState(false);
  const [counterpartTyping, setCounterpartTyping] = useState(false);
  const [counterpartLastReadAt, setCounterpartLastReadAt] = useState(
    conversation.counterpartLastReadAt ?? null,
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingSentRef = useRef(0);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const composeRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = composeRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [draft]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`conversation-${conversation.id}`, { config: { presence: { key: profile.id } } })
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setIsOnline(Boolean(state[conversation.counterpartId]?.length));
      })
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        if (payload?.userId !== conversation.counterpartId) return;
        setCounterpartTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setCounterpartTyping(false), TYPING_IDLE_MS);
      })
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversation.id}` },
        (payload) => {
          const row = payload.new as MessageRow;
          if (row.sender_id === profile.id) return;
          setMessages((m) =>
            m.some((msg) => msg.id === row.id)
              ? m
              : [
                  ...m,
                  {
                    id: row.id,
                    conversationId: row.conversation_id,
                    senderId: "them",
                    body: row.body,
                    createdAt: row.created_at,
                    status: "sent",
                  },
                ],
          );
          setCounterpartTyping(false);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversation_reads",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          const row = payload.new as ConversationReadRow | undefined;
          if (!row || row.user_id !== conversation.counterpartId) return;
          setCounterpartLastReadAt(row.last_read_at);
        },
      )
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") await channel.track({ online_at: new Date().toISOString() });
      });

    channelRef.current = channel;

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      channelRef.current = null;
      supabase.removeChannel(channel);
    };
  }, [conversation.id, conversation.counterpartId, profile.id]);

  function broadcastTyping() {
    const now = Date.now();
    if (now - lastTypingSentRef.current < 1500) return;
    lastTypingSentRef.current = now;
    channelRef.current?.send({
      type: "broadcast",
      event: "typing",
      payload: { userId: profile.id },
    });
  }

  function send() {
    const body = draft.trim();
    if (!body) return;
    const tempId = `temp-${Date.now()}`;
    setDraft("");
    setMessages((m) => [
      ...m,
      {
        id: tempId,
        conversationId: conversation.id,
        senderId: "me",
        body,
        createdAt: new Date().toISOString(),
        status: "sending",
      },
    ]);
    startTransition(async () => {
      try {
        await sendMessage(conversation.id, body);
        setMessages((m) => m.map((msg) => (msg.id === tempId ? { ...msg, status: "sent" } : msg)));
      } catch {
        setMessages((m) => m.map((msg) => (msg.id === tempId ? { ...msg, status: "failed" } : msg)));
      }
    });
  }

  function retry(messageId: string) {
    const target = messages.find((m) => m.id === messageId);
    if (!target) return;
    setMessages((m) => m.map((msg) => (msg.id === messageId ? { ...msg, status: "sending" } : msg)));
    startTransition(async () => {
      try {
        await sendMessage(conversation.id, target.body);
        setMessages((m) => m.map((msg) => (msg.id === messageId ? { ...msg, status: "sent" } : msg)));
      } catch {
        setMessages((m) => m.map((msg) => (msg.id === messageId ? { ...msg, status: "failed" } : msg)));
      }
    });
  }

  const lastMineId = [...messages].reverse().find((m) => m.senderId === "me")?.id;

  return (
    <div className="flex h-screen flex-col bg-white">
      <AppNav
        active="/messages"
        profile={profile}
        unreadCount={unreadCount}
        unreadMessageCount={unreadMessageCount}
        notifications={notifications}
      />
      <main id="main-content" className="flex flex-1 overflow-hidden">
        <aside className="hidden w-full max-w-sm shrink-0 overflow-y-auto border-r border-[var(--color-border)] sm:block">
          <div className="flex items-center justify-between px-4 py-5">
            <h1 className="font-(family-name:--font-unbounded) text-xl font-bold text-[var(--color-ink)]">
              Messages
            </h1>
            <NewConversationButton />
          </div>
          <ConversationList conversations={conversations} />
        </aside>

        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-6 py-4">
            <Link href="/messages" className="sm:hidden" aria-label="Back to conversations">
              <BackIcon />
            </Link>
            <Link href={`/profile/${conversation.counterpartId}`} className="relative">
              <Avatar name={conversation.counterpartName} seed={conversation.counterpartId} size={40} />
              {isOnline && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-[var(--color-success)]"
                />
              )}
            </Link>
            <div>
              <Link
                href={`/profile/${conversation.counterpartId}`}
                className="font-(family-name:--font-space-grotesk) text-sm font-semibold text-[var(--color-ink)]"
              >
                {conversation.counterpartName}
              </Link>
              <p
                role="status"
                className="font-(family-name:--font-space-grotesk) text-xs text-black/60"
              >
                {counterpartTyping
                  ? "Typing..."
                  : isOnline
                    ? "Online"
                    : conversation.counterpartLastSeenAt
                      ? `Last seen ${timeAgo(conversation.counterpartLastSeenAt)}`
                      : null}
              </p>
              {conversation.projectId && (
                <Link
                  href={`/projects/${conversation.projectId}`}
                  className="block font-(family-name:--font-space-grotesk) text-xs text-[var(--color-primary)]"
                >
                  {conversation.projectTitle}
                </Link>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-[var(--color-surface)]/40 px-6 py-6">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
                <p className="font-(family-name:--font-space-grotesk) text-sm text-black/40">
                  No messages yet.
                </p>
                <p className="font-(family-name:--font-space-grotesk) text-sm text-black/40">
                  Say hello to {conversation.counterpartName.split(" ")[0]}.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((m) => {
                  const mine = m.senderId === "me";
                  const seen = mine && counterpartLastReadAt && counterpartLastReadAt >= m.createdAt;
                  return (
                    <div key={m.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                      <div
                        className={`flex max-w-[75%] flex-col gap-1 rounded-2xl px-4 py-2.5 font-(family-name:--font-space-grotesk) text-[15px] leading-6 ${
                          mine
                            ? "self-end bg-[var(--color-primary)] text-white"
                            : "self-start bg-white text-[var(--color-ink)]"
                        }`}
                      >
                        <span>{m.body}</span>
                        <span
                          className={`font-(family-name:--font-space-mono) text-[10px] ${
                            mine ? "self-end text-white/60" : "self-end text-black/60"
                          }`}
                        >
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      {mine && m.id === lastMineId && (
                        <p
                          role={m.status === "failed" ? "alert" : "status"}
                          className={`mt-1 font-(family-name:--font-space-mono) text-[10px] ${
                            m.status === "failed" ? "text-[var(--color-danger)]" : "text-black/60"
                          }`}
                        >
                          {m.status === "failed" ? (
                            <>
                              Failed to send ·{" "}
                              <button type="button" onClick={() => retry(m.id)} className="underline">
                                Retry
                              </button>
                            </>
                          ) : m.status === "sending" ? (
                            "Sending..."
                          ) : seen ? (
                            "Seen"
                          ) : (
                            "Sent"
                          )}
                        </p>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-end gap-3 border-t border-[var(--color-border)] px-6 py-4"
          >
            <textarea
              ref={composeRef}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                if (e.target.value.trim()) broadcastTyping();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Write a message..."
              rows={1}
              className="max-h-32 flex-1 resize-none overflow-y-auto rounded-3xl border-2 border-[var(--color-ink)]/15 bg-white px-5 py-3 font-(family-name:--font-space-grotesk) text-base text-[var(--color-ink)] outline-none placeholder:text-black/30 focus:border-[var(--color-primary)]"
            />
            <button
              type="submit"
              disabled={isPending}
              className="pv-border pv-shadow-sm flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] font-bold text-[var(--color-ink)] disabled:opacity-50"
              aria-label="Send"
            >
              {isPending ? <Spinner size={16} /> : "→"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
