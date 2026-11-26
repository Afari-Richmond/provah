"use client";

import { useId, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { blockUser, unblockUser } from "@/lib/actions/blocks";
import { showErrorPopup, showSuccessPopup } from "@/lib/popup";
import type { BlockDirection } from "@/lib/data/blocks";

export function BlockButton({
  otherUserId,
  otherName,
  initialDirection,
}: {
  otherUserId: string;
  otherName: string;
  initialDirection: BlockDirection;
}) {
  const [direction, setDirection] = useState(initialDirection);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const titleId = useId();

  if (direction === "blocked_by_other") return null;

  function confirmBlock() {
    setConfirmOpen(false);
    startTransition(async () => {
      try {
        await blockUser(otherUserId);
        setDirection("viewer_blocked");
        showSuccessPopup(`Blocked ${otherName}`);
      } catch (err) {
        showErrorPopup("Couldn't block this person", err instanceof Error ? err.message : undefined);
      }
    });
  }

  function unblock() {
    startTransition(async () => {
      try {
        await unblockUser(otherUserId);
        setDirection("none");
        showSuccessPopup(`Unblocked ${otherName}`);
      } catch (err) {
        showErrorPopup("Couldn't unblock this person", err instanceof Error ? err.message : undefined);
      }
    });
  }

  if (direction === "viewer_blocked") {
    return (
      <Button variant="secondary" onClick={unblock} loading={isPending}>
        Unblock
      </Button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-black/30 hover:text-[var(--color-danger)]"
      >
        Block
      </button>
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} labelledBy={titleId}>
        <Card className="w-full max-w-sm p-6" shadow="dark">
          <h3 id={titleId} className="font-(family-name:--font-unbounded) text-lg font-bold text-[var(--color-ink)]">
            Block {otherName}?
          </h3>
          <p className="mt-2 font-(family-name:--font-space-grotesk) text-sm text-black/60">
            They won&apos;t be able to message or connect with you, and any existing connection
            between you will end. You can unblock them later from here.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="bg-[var(--color-danger)] text-white"
              onClick={confirmBlock}
              loading={isPending}
            >
              Block
            </Button>
          </div>
        </Card>
      </Modal>
    </>
  );
}
