"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { startConversationWithUser } from "@/lib/actions/messaging";

export function MessageButton({ otherUserId }: { otherUserId: string }) {
  const [isPending, startTransition] = useTransition();

  function send() {
    startTransition(async () => {
      await startConversationWithUser(otherUserId);
    });
  }

  return (
    <Button variant="dark" onClick={send} loading={isPending}>
      Message
    </Button>
  );
}
