"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import {
  sendConnectionRequest,
  respondToConnectionRequest,
  cancelConnection,
} from "@/lib/actions/connections";
import { showSuccessPopup, showErrorPopup } from "@/lib/popup";
import type { ConnectionStatus } from "@/lib/types";

export function ConnectButton({
  otherUserId,
  initialStatus,
  initialConnectionId,
}: {
  otherUserId: string;
  initialStatus: ConnectionStatus;
  initialConnectionId: string | null;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [connectionId, setConnectionId] = useState(initialConnectionId);
  const [isPending, startTransition] = useTransition();

  function connect() {
    startTransition(async () => {
      try {
        await sendConnectionRequest(otherUserId);
        setStatus("pending_sent");
        showSuccessPopup("Connection request sent");
      } catch (err) {
        showErrorPopup("Couldn't send request", err instanceof Error ? err.message : undefined);
      }
    });
  }

  function cancel() {
    startTransition(async () => {
      try {
        await cancelConnection(otherUserId);
        setStatus("none");
        setConnectionId(null);
      } catch (err) {
        showErrorPopup("Couldn't cancel request", err instanceof Error ? err.message : undefined);
      }
    });
  }

  function respond(accept: boolean) {
    if (!connectionId) return;
    startTransition(async () => {
      try {
        await respondToConnectionRequest(connectionId, accept);
        setStatus(accept ? "accepted" : "declined");
        if (accept) showSuccessPopup("You're connected");
      } catch (err) {
        showErrorPopup("Couldn't respond to request", err instanceof Error ? err.message : undefined);
      }
    });
  }

  if (status === "accepted") {
    return (
      <Button variant="secondary" disabled loading={isPending}>
        ✓ Connected
      </Button>
    );
  }

  if (status === "pending_received") {
    return (
      <div className="flex gap-2">
        <Button variant="primary" onClick={() => respond(true)} loading={isPending}>
          Accept
        </Button>
        <Button variant="secondary" onClick={() => respond(false)} loading={isPending}>
          Decline
        </Button>
      </div>
    );
  }

  if (status === "pending_sent") {
    return (
      <Button variant="secondary" onClick={cancel} loading={isPending}>
        Request sent · Cancel
      </Button>
    );
  }

  return (
    <Button variant="primary" onClick={connect} loading={isPending}>
      + Connect
    </Button>
  );
}
