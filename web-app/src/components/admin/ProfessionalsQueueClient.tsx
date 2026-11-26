"use client";

import { useId, useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { decideProfessionalVerification } from "@/lib/actions/admin";
import type { AdminUser } from "@/lib/data/admin";

export function ProfessionalsQueueClient({ initialQueue }: { initialQueue: AdminUser[] }) {
  const [queue, setQueue] = useState(initialQueue);
  const [declining, setDeclining] = useState<AdminUser | null>(null);
  const [, startTransition] = useTransition();
  const titleId = useId();

  function verify(id: string) {
    setQueue((q) => q.filter((p) => p.id !== id));
    startTransition(() => decideProfessionalVerification(id, true));
  }

  function confirmDecline() {
    if (!declining) return;
    const id = declining.id;
    setQueue((q) => q.filter((p) => p.id !== id));
    setDeclining(null);
    startTransition(() => decideProfessionalVerification(id, false));
  }

  return (
    <div className="mt-8 flex flex-col gap-4">
      {queue.length === 0 && (
        <Card className="p-8 text-center" shadow="dark">
          <p className="font-(family-name:--font-space-grotesk) text-sm text-black/50">
            No pending professionals — nice work staying on top of it.
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
              <p className="font-(family-name:--font-space-grotesk) text-xs text-black/50">{p.detail}</p>
              <p className="font-(family-name:--font-space-mono) text-xs text-black/60">{p.email}</p>
            </div>
          </div>
          <div className="flex shrink-0 gap-3">
            <Button
              variant="secondary"
              className="border-[var(--color-danger)] text-[var(--color-danger)]"
              onClick={() => setDeclining(p)}
            >
              Decline
            </Button>
            <Button variant="primary" onClick={() => verify(p.id)}>
              Verify
            </Button>
          </div>
        </Card>
      ))}

      <Modal open={Boolean(declining)} onClose={() => setDeclining(null)} labelledBy={titleId}>
        {declining && (
          <Card className="w-full max-w-sm p-6" shadow="dark">
            <h3 id={titleId} className="font-(family-name:--font-unbounded) text-lg font-bold text-[var(--color-ink)]">
              Decline {declining.name}?
            </h3>
            <p className="mt-2 font-(family-name:--font-space-grotesk) text-sm text-black/60">
              This suspends their account. They won&apos;t be able to log in until reactivated
              from Users.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeclining(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-[var(--color-danger)] text-white"
                onClick={confirmDecline}
              >
                Decline
              </Button>
            </div>
          </Card>
        )}
      </Modal>
    </div>
  );
}
