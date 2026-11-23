"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { decideProfessionalVerification } from "@/lib/actions/admin";
import type { AdminUser } from "@/lib/data/admin";

export function ProfessionalsQueueClient({ initialQueue }: { initialQueue: AdminUser[] }) {
  const [queue, setQueue] = useState(initialQueue);
  const [, startTransition] = useTransition();

  function decide(id: string, approve: boolean) {
    setQueue((q) => q.filter((p) => p.id !== id));
    startTransition(() => decideProfessionalVerification(id, approve));
  }

  return (
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
              <p className="font-(family-name:--font-space-grotesk) text-xs text-black/50">{p.detail}</p>
              <p className="font-(family-name:--font-space-mono) text-xs text-black/40">{p.email}</p>
            </div>
          </div>
          <div className="flex shrink-0 gap-3">
            <Button
              variant="secondary"
              className="border-[var(--color-danger)] text-[var(--color-danger)]"
              onClick={() => decide(p.id, false)}
            >
              Decline
            </Button>
            <Button variant="primary" onClick={() => decide(p.id, true)}>
              Verify
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
