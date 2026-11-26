"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { requestPasswordReset, type RequestResetState } from "@/lib/actions/auth";

const initialState: RequestResetState = { sent: false, error: null };

export function ForgotPasswordClient() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  if (state.sent) {
    return (
      <p role="status" aria-live="polite" className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-ink)]">
        If an account exists for that email, we&apos;ve sent a link to reset your password.
        Check your inbox.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@university.edu"
        required
      />
      {state.error && (
        <p role="alert" aria-live="assertive" className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-danger)]">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="primary" className="w-full" loading={pending}>
        {pending ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
}
