"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { startConversationWithUser } from "@/lib/actions/messaging";
import { showErrorPopup } from "@/lib/popup";

export function MessageButton({ otherUserId }: { otherUserId: string }) {
  const [isPending, startTransition] = useTransition();

  function send() {
    startTransition(async () => {
      try {
        await startConversationWithUser(otherUserId);
      } catch (err) {
        showErrorPopup("Couldn't start conversation", err instanceof Error ? err.message : undefined);
      }
    });
  }

  return (
    <Button variant="dark" onClick={send} loading={isPending}>
      Message
    </Button>
  );
}
