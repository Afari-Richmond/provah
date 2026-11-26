"use client";

import { useId, useMemo, useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Chip } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { toggleUserSuspension, bulkSetUserSuspension, loadMoreAdminUsers } from "@/lib/actions/admin";
import type { AdminUser } from "@/lib/data/admin";

type Filter = "all" | "student" | "professional";
type BulkAction = { suspend: boolean; ids: string[] } | null;

export function UsersClient({
  initialUsers,
  hasMore = false,
}: {
  initialUsers: AdminUser[];
  hasMore?: boolean;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [canLoadMore, setCanLoadMore] = useState(hasMore);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [target, setTarget] = useState<AdminUser | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<BulkAction>(null);
  const [, startTransition] = useTransition();
  const titleId = useId();
  const bulkTitleId = useId();

  const visible = users.filter((u) => filter === "all" || u.role === filter);
  const selectedUsers = useMemo(() => users.filter((u) => selected.has(u.id)), [users, selected]);
  const selectedActiveIds = selectedUsers.filter((u) => u.status === "active").map((u) => u.id);
  const selectedSuspendedIds = selectedUsers.filter((u) => u.status === "suspended").map((u) => u.id);

  function toggleSelected(id: string, checked: boolean) {
    setSelected((s) => {
      const next = new Set(s);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleSelectAllVisible(checked: boolean) {
    setSelected((s) => {
      const next = new Set(s);
      for (const u of visible) {
        if (checked) next.add(u.id);
        else next.delete(u.id);
      }
      return next;
    });
  }

  async function loadMore() {
    setLoadingMore(true);
    try {
      const next = await loadMoreAdminUsers(users.length);
      setUsers((list) => [...list, ...next]);
      if (next.length === 0) setCanLoadMore(false);
    } finally {
      setLoadingMore(false);
    }
  }

  function confirmToggle() {
    if (!target) return;
    const nextSuspended = target.status === "active";
    setUsers((list) =>
      list.map((u) =>
        u.id === target.id ? { ...u, status: nextSuspended ? "suspended" : "active" } : u,
      ),
    );
    startTransition(() => toggleUserSuspension(target.id, nextSuspended));
    setTarget(null);
  }

  function confirmBulk() {
    if (!bulkAction) return;
    const { suspend, ids } = bulkAction;
    setUsers((list) =>
      list.map((u) => (ids.includes(u.id) ? { ...u, status: suspend ? "suspended" : "active" } : u)),
    );
    setSelected(new Set());
    setBulkAction(null);
    startTransition(() => bulkSetUserSuspension(ids, suspend));
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Chip active={filter === "all"} onClick={() => setFilter("all")}>
            All
          </Chip>
          <Chip active={filter === "student"} onClick={() => setFilter("student")}>
            Students
          </Chip>
          <Chip active={filter === "professional"} onClick={() => setFilter("professional")}>
            Professionals
          </Chip>
        </div>
        {visible.length > 0 && (
          <label className="flex items-center gap-2 font-(family-name:--font-space-grotesk) text-xs text-black/50">
            <input
              type="checkbox"
              checked={visible.every((u) => selected.has(u.id))}
              onChange={(e) => toggleSelectAllVisible(e.target.checked)}
              className="h-4 w-4 rounded border-2 border-[var(--color-ink)]/20 accent-[var(--color-primary)]"
            />
            Select all
          </label>
        )}
      </div>

      {selected.size > 0 && (
        <Card className="mt-4 flex flex-wrap items-center justify-between gap-3 p-4" shadow="dark">
          <p className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-ink)]">
            {selected.size} selected
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="border-[var(--color-danger)] text-[var(--color-danger)]"
              disabled={selectedActiveIds.length === 0}
              onClick={() => setBulkAction({ suspend: true, ids: selectedActiveIds })}
            >
              Suspend {selectedActiveIds.length || ""}
            </Button>
            <Button
              variant="secondary"
              disabled={selectedSuspendedIds.length === 0}
              onClick={() => setBulkAction({ suspend: false, ids: selectedSuspendedIds })}
            >
              Reactivate {selectedSuspendedIds.length || ""}
            </Button>
          </div>
        </Card>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {visible.length === 0 && (
          <Card className="p-8 text-center" shadow="dark">
            <p className="font-(family-name:--font-space-grotesk) text-sm text-black/50">
              No users match this filter — try &quot;All&quot;.
            </p>
          </Card>
        )}
        {visible.map((u) => (
          <Card key={u.id} className="flex items-center justify-between gap-4 p-5" shadow="dark">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={selected.has(u.id)}
                onChange={(e) => toggleSelected(u.id, e.target.checked)}
                aria-label={`Select ${u.name}`}
                className="h-4 w-4 shrink-0 rounded border-2 border-[var(--color-ink)]/20 accent-[var(--color-primary)]"
              />
              <Avatar name={u.name} seed={u.id} size={44} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-(family-name:--font-space-grotesk) text-sm font-semibold text-[var(--color-ink)]">
                    {u.name}
                  </span>
                  <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 font-(family-name:--font-space-mono) text-[10px] font-bold uppercase tracking-[0.03em] text-black/50">
                    {u.role}
                  </span>
                  {u.status === "suspended" && (
                    <span className="rounded-full bg-[var(--color-danger)]/10 px-2 py-0.5 font-(family-name:--font-space-mono) text-[10px] font-bold uppercase tracking-[0.03em] text-[var(--color-danger)]">
                      Suspended
                    </span>
                  )}
                </div>
                <p className="font-(family-name:--font-space-grotesk) text-xs text-black/50">
                  {u.detail} · {u.email}
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              className={u.status === "active" ? "border-[var(--color-danger)] text-[var(--color-danger)]" : ""}
              onClick={() => setTarget(u)}
            >
              {u.status === "active" ? "Suspend" : "Reactivate"}
            </Button>
          </Card>
        ))}
      </div>

      {canLoadMore && (
        <div className="mt-6 flex justify-center">
          <Button variant="secondary" onClick={loadMore} loading={loadingMore}>
            {loadingMore ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}

      <Modal open={Boolean(target)} onClose={() => setTarget(null)} labelledBy={titleId}>
        {target && (
          <Card className="w-full max-w-sm p-6" shadow="dark">
            <h3 id={titleId} className="font-(family-name:--font-unbounded) text-lg font-bold text-[var(--color-ink)]">
              {target.status === "active" ? "Suspend" : "Reactivate"} {target.name}?
            </h3>
            <p className="mt-2 font-(family-name:--font-space-grotesk) text-sm text-black/60">
              {target.status === "active"
                ? "They won't be able to log in or be visible on Discover until reactivated."
                : "They'll regain full access immediately."}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setTarget(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={confirmToggle}>
                Confirm
              </Button>
            </div>
          </Card>
        )}
      </Modal>

      <Modal open={Boolean(bulkAction)} onClose={() => setBulkAction(null)} labelledBy={bulkTitleId}>
        {bulkAction && (
          <Card className="w-full max-w-sm p-6" shadow="dark">
            <h3 id={bulkTitleId} className="font-(family-name:--font-unbounded) text-lg font-bold text-[var(--color-ink)]">
              {bulkAction.suspend ? "Suspend" : "Reactivate"} {bulkAction.ids.length} account
              {bulkAction.ids.length === 1 ? "" : "s"}?
            </h3>
            <p className="mt-2 font-(family-name:--font-space-grotesk) text-sm text-black/60">
              {bulkAction.suspend
                ? "They won't be able to log in or be visible on Discover until reactivated."
                : "They'll regain full access immediately."}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setBulkAction(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={confirmBulk}>
                Confirm
              </Button>
            </div>
          </Card>
        )}
      </Modal>
    </>
  );
}
