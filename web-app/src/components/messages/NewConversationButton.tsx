"use client";

import { useEffect, useId, useState, useTransition } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Spinner } from "@/components/ui/Spinner";
import { Modal } from "@/components/ui/Modal";
import { searchUsersToMessage, startConversationWithUser } from "@/lib/actions/messaging";

type SearchResult = Awaited<ReturnType<typeof searchUsersToMessage>>[number];

export function NewConversationButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [isPending, startTransition] = useTransition();
  const titleId = useId();

  const trimmedQuery = query.trim();

  useEffect(() => {
    if (!open || !trimmedQuery) return;
    const timeout = setTimeout(async () => {
      const r = await searchUsersToMessage(trimmedQuery);
      setResults(r);
      setSearching(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [trimmedQuery, open]);

  function handleQueryChange(value: string) {
    setQuery(value);
    if (value.trim()) setSearching(true);
  }

  function pick(userId: string) {
    startTransition(async () => {
      await startConversationWithUser(userId);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="New message"
        className={
          className ??
          "pv-border flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-ink)]"
        }
      >
        {children ?? <ComposeIcon />}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} labelledBy={titleId}>
        <div className="pv-border pv-shadow-sm w-full max-w-md rounded-2xl bg-white">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
            <span id={titleId} className="font-(family-name:--font-unbounded) text-sm font-bold text-[var(--color-ink)]">
              New message
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-black/40"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="px-4 pt-4">
            <input
              autoFocus
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search people to message..."
              className="w-full rounded-full border-2 border-[var(--color-ink)]/15 bg-white px-4 py-2.5 font-(family-name:--font-space-grotesk) text-base text-[var(--color-ink)] outline-none placeholder:text-black/30 focus:border-[var(--color-primary)]"
            />
          </div>
          <div className="max-h-80 overflow-y-auto px-2 py-3">
            {searching ? (
              <div className="flex justify-center py-6">
                <Spinner size={22} />
              </div>
            ) : trimmedQuery && results.length > 0 ? (
              results.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  disabled={isPending}
                  onClick={() => pick(r.id)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[var(--color-surface)] disabled:opacity-50"
                >
                  <Avatar name={r.name} seed={r.id} imageUrl={r.avatarUrl ?? undefined} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-(family-name:--font-space-grotesk) text-sm font-semibold text-[var(--color-ink)]">
                      {r.name}
                    </p>
                    {r.subtitle && (
                      <p className="truncate font-(family-name:--font-space-grotesk) text-xs text-black/50">
                        {r.subtitle}
                      </p>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <p className="px-3 py-6 text-center font-(family-name:--font-space-grotesk) text-sm text-black/40">
                {trimmedQuery ? "No one found." : "Start typing a name, university, or company."}
              </p>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

function ComposeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" strokeLinecap="round" />
      <path
        d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
