"use client";

import { useId, useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { moderateProject } from "@/lib/actions/projects";
import type { Project } from "@/lib/types";

export function ReviewQueueClient({ initialQueue }: { initialQueue: Project[] }) {
  const [queue, setQueue] = useState(initialQueue);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [, startTransition] = useTransition();
  const titleId = useId();

  function approve(id: string) {
    setQueue((q) => q.filter((p) => p.id !== id));
    startTransition(() => moderateProject(id, "approve"));
  }

  function confirmReject() {
    if (!rejectingId) return;
    const id = rejectingId;
    setQueue((q) => q.filter((p) => p.id !== id));
    setRejectingId(null);
    startTransition(() => moderateProject(id, "reject", reason));
    setReason("");
  }

  return (
    <>
      <p className="mt-2 font-(family-name:--font-space-grotesk) text-[15px] leading-7 text-black/60">
        {queue.length} project{queue.length === 1 ? "" : "s"} waiting on a decision.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {queue.length === 0 && (
          <Card className="p-8 text-center" shadow="dark">
            <p className="font-(family-name:--font-space-grotesk) text-sm text-black/50">
              Queue is empty, nice work.
            </p>
          </Card>
        )}

        {queue.map((project) => (
          <Card key={project.id} className="p-6" shadow="dark">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-black/40">
                  {project.field} · {project.university}
                </p>
                <h3 className="mt-1 font-(family-name:--font-unbounded) text-lg font-bold text-[var(--color-ink)]">
                  {project.title}
                </h3>
                <p className="mt-1 font-(family-name:--font-space-grotesk) text-sm text-black/50">
                  by {project.studentName}
                </p>
                <p className="mt-3 max-w-xl font-(family-name:--font-space-grotesk) text-sm leading-6 text-black/70">
                  {project.problem}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.techStack.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-[var(--color-surface)] px-2.5 py-1 font-(family-name:--font-space-grotesk) text-xs text-black/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 gap-3">
                <Button
                  variant="secondary"
                  className="border-[var(--color-danger)] text-[var(--color-danger)]"
                  onClick={() => setRejectingId(project.id)}
                >
                  Reject
                </Button>
                <Button variant="primary" onClick={() => approve(project.id)}>
                  Approve
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={Boolean(rejectingId)} onClose={() => setRejectingId(null)} labelledBy={titleId}>
        <Card className="w-full max-w-md p-6" shadow="dark">
          <h3 id={titleId} className="font-(family-name:--font-unbounded) text-lg font-bold text-[var(--color-ink)]">
            Reject project
          </h3>
          <p className="mt-2 font-(family-name:--font-space-grotesk) text-sm text-black/60">
            The student will see this reason and can resubmit after fixing it.
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Please add more detail on your technical approach."
            className="mt-4 min-h-[100px] w-full rounded-2xl border-2 border-[var(--color-ink)]/15 bg-white px-4 py-3 font-(family-name:--font-space-grotesk) text-base text-[var(--color-ink)] outline-none placeholder:text-black/30 focus:border-[var(--color-primary)]"
          />
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setRejectingId(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmReject}>
              Confirm reject
            </Button>
          </div>
        </Card>
      </Modal>
    </>
  );
}
