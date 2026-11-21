"use client";

import { useState } from "react";
import { AdminNav } from "@/components/layout/AdminNav";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Eyebrow } from "@/components/ui/Badge";
import { pendingProfessionals, PendingProfessional } from "@/lib/mockAdmin";

export default function AdminProfessionalsPage() {
  const [queue, setQueue] = useState<PendingProfessional[]>(pendingProfessionals);

  function decide(id: string) {
    setQueue((q) => q.filter((p) => p.id !== id));
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminNav active="/admin/professionals" />

      <main className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
        <Eyebrow>Verification</Eyebrow>
        <h1 className="mt-3 font-(family-name:--font-unbounded) text-[32px] font-bold leading-tight text-[var(--color-ink)]">
          Professional accounts
        </h1>
        <p className="mt-2 font-(family-name:--font-space-grotesk) text-[15px] leading-7 text-black/60">
          Verify before they can message students.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          {queue.length === 0 && (
            <Card className="p-8 text-center" shadow="dark">
              <p className="font-(family-name:--font-space-grotesk) text-sm text-black/50">
                No pending professionals.
              </p>
            </Card>
          )}

          {queue.map((p) => (
            <Card key={p.id} className="flex items-center justify-between gap-4 p-5" shadow="dark">
              <div className="flex items-center gap-4">
                <Avatar name={p.name} seed={p.id} size={48} />
                <div>
                  <p className="font-(family-name:--font-space-grotesk) text-sm font-semibold text-[var(--color-ink)]">
                    {p.name}
                  </p>
                  <p className="font-(family-name:--font-space-grotesk) text-xs text-black/50">
                    {p.title} at {p.company}
                  </p>
                  <p className="font-(family-name:--font-space-mono) text-xs text-black/40">
                    {p.email}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-3">
                <Button
                  variant="secondary"
                  className="border-[var(--color-danger)] text-[var(--color-danger)]"
                  onClick={() => decide(p.id)}
                >
                  Decline
                </Button>
                <Button variant="primary" onClick={() => decide(p.id)}>
                  Verify
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
