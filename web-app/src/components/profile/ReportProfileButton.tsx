"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { reportProfile } from "@/lib/actions/reports";

export function ReportProfileButton({ otherUserId }: { otherUserId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const titleId = useId();

  function close() {
    setOpen(false);
    setError(null);
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      await reportProfile(otherUserId, reason);
      setSent(true);
      setTimeout(() => {
        setOpen(false);
        setSent(false);
        setReason("");
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send your report. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-black/30 hover:text-[var(--color-danger)]"
      >
        Report
      </button>
      <Modal open={open} onClose={close} labelledBy={titleId}>
        <Card className="w-full max-w-sm p-6" shadow="dark">
          {sent ? (
            <p role="status" aria-live="polite" className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-ink)]">
              Thanks, our team will take a look. ✓
            </p>
          ) : (
            <>
              <h3 id={titleId} className="font-(family-name:--font-unbounded) text-lg font-bold text-[var(--color-ink)]">
                Report this account
              </h3>
              <p className="mt-2 font-(family-name:--font-space-grotesk) text-sm text-black/60">
                Let us know what&apos;s wrong: harassment, impersonation, spam, or something else.
              </p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tell us what's going on..."
                className="mt-4 min-h-[100px] w-full rounded-2xl border-2 border-[var(--color-ink)]/15 bg-white px-4 py-3 font-(family-name:--font-space-grotesk) text-base text-[var(--color-ink)] outline-none placeholder:text-black/30 focus:border-[var(--color-primary)]"
              />
              {error && (
                <p role="alert" aria-live="assertive" className="mt-2 font-(family-name:--font-space-grotesk) text-sm text-[var(--color-danger)]">
                  {error}
                </p>
              )}
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="secondary" onClick={close}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={submit} disabled={!reason.trim()} loading={submitting}>
                  Submit report
                </Button>
              </div>
            </>
          )}
        </Card>
      </Modal>
    </>
  );
}
