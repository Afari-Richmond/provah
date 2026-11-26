"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { verifyMfaChallenge, type MfaChallengeState } from "@/lib/actions/mfa";

const initialState: MfaChallengeState = { error: null };

export function MfaChallengeClient() {
  const [state, formAction, pending] = useActionState(verifyMfaChallenge, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <TextField
        label="Authentication code"
        name="code"
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="123456"
        maxLength={6}
        autoFocus
        required
      />
      {state.error && (
        <p role="alert" aria-live="assertive" className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-danger)]">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="primary" className="w-full" loading={pending}>
        {pending ? "Verifying..." : "Verify"}
      </Button>
    </form>
  );
}
