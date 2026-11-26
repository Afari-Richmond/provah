"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { resetPassword, type ResetPasswordState } from "@/lib/actions/auth";

const initialState: ResetPasswordState = { error: null };

export function ResetPasswordClient() {
  const [state, formAction, pending] = useActionState(resetPassword, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <TextField
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        minLength={8}
        required
      />
      {state.error && (
        <p role="alert" aria-live="assertive" className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-danger)]">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="primary" className="w-full" loading={pending}>
        {pending ? "Saving..." : "Set new password"}
      </Button>
    </form>
  );
}
