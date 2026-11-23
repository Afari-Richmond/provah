"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Chip } from "@/components/ui/Badge";
import { toggleUserSuspension } from "@/lib/actions/admin";
import type { AdminUser } from "@/lib/data/admin";

type Filter = "all" | "student" | "professional";

export function UsersClient({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [filter, setFilter] = useState<Filter>("all");
  const [target, setTarget] = useState<AdminUser | null>(null);
  const [, startTransition] = useTransition();

  const visible = users.filter((u) => filter === "all" || u.role === filter);

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

  return (
    <>
      <div className="mt-6 flex gap-2">
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

      <div className="mt-6 flex flex-col gap-3">
        {visible.map((u) => (
          <Card key={u.id} className="flex items-center justify-between gap-4 p-5" shadow="dark">
            <div className="flex items-center gap-4">
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

      {target && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-sm p-6" shadow="dark">
            <h3 className="font-(family-name:--font-unbounded) text-lg font-bold text-[var(--color-ink)]">
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
        </div>
      )}
    </>
  );
}
