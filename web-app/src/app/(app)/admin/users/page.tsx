"use client";

import { useState } from "react";
import { AdminNav } from "@/components/layout/AdminNav";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Eyebrow, Chip } from "@/components/ui/Badge";
import { mockUsers, AdminUser } from "@/lib/mockAdmin";

type Filter = "all" | "student" | "professional";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [filter, setFilter] = useState<Filter>("all");
  const [target, setTarget] = useState<AdminUser | null>(null);

  const visible = users.filter((u) => filter === "all" || u.role === filter);

  function confirmToggle() {
    if (!target) return;
    setUsers((list) =>
      list.map((u) =>
        u.id === target.id
          ? { ...u, status: u.status === "active" ? "suspended" : "active" }
          : u,
      ),
    );
    setTarget(null);
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminNav active="/admin/users" />

      <main className="mx-auto max-w-4xl px-6 py-10 sm:px-10">
        <Eyebrow>User management</Eyebrow>
        <h1 className="mt-3 font-(family-name:--font-unbounded) text-[32px] font-bold leading-tight text-[var(--color-ink)]">
          All accounts
        </h1>

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
                <Avatar name={u.name} size={44} />
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
      </main>

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
    </div>
  );
}
