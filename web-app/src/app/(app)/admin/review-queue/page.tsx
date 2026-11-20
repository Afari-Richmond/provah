"use client";

import { useState } from "react";
import { AdminNav } from "@/components/layout/AdminNav";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Badge";
import { mockProjects } from "@/lib/mockData";
import { Project } from "@/lib/types";

export default function ReviewQueuePage() {
  const [queue, setQueue] = useState<Project[]>(
    mockProjects.filter((p) => p.status === "pending_review"),
  );
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  function approve(id: string) {
    setQueue((q) => q.filter((p) => p.id !== id));
  }

  function confirmReject() {
    if (!rejectingId) return;
    setQueue((q) => q.filter((p) => p.id !== rejectingId));
    setRejectingId(null);
    setReason("");
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminNav active="/admin/review-queue" />

      <main className="mx-auto max-w-4xl px-6 py-10 sm:px-10">
        <Eyebrow>Moderation</Eyebrow>
        <h1 className="mt-3 font-(family-name:--font-unbounded) text-[32px] font-bold leading-tight text-[var(--color-ink)]">
          Review queue
        </h1>
        <p className="mt-2 font-(family-name:--font-space-grotesk) text-[15px] leading-7 text-black/60">
          {queue.length} project{queue.length === 1 ? "" : "s"} waiting on a decision.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          {queue.length === 0 && (
            <Card className="p-8 text-center" shadow="dark">
              <p className="font-(family-name:--font-space-grotesk) text-sm text-black/50">
                Queue is empty — nice work.
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

        {rejectingId && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
            <Card className="w-full max-w-md p-6" shadow="dark">
              <h3 className="font-(family-name:--font-unbounded) text-lg font-bold text-[var(--color-ink)]">
                Reject project
              </h3>
              <p className="mt-2 font-(family-name:--font-space-grotesk) text-sm text-black/60">
                The student will see this reason and can resubmit after fixing it.
              </p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Please add more detail on your technical approach."
                className="mt-4 min-h-[100px] w-full rounded-2xl border-2 border-[var(--color-ink)]/15 bg-white px-4 py-3 font-(family-name:--font-space-grotesk) text-[15px] text-[var(--color-ink)] outline-none placeholder:text-black/30 focus:border-[var(--color-primary)]"
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
          </div>
        )}
      </main>
    </div>
  );
}
