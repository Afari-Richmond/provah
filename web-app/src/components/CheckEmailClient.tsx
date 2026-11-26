"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/Button";
import { resendConfirmation, type ResendState } from "@/lib/actions/auth";

const initialState: ResendState = { sent: false, error: null };

export function CheckEmailClient({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState(resendConfirmation, initialState);

  return (
    <AuthShell
      eyebrow="Verify your email"
      title="Check your inbox"
      subtitle={
        email
          ? `We sent a confirmation link to ${email}. Click it to activate your account.`
          : "We sent a confirmation link to your email. Click it to activate your account."
      }
      footer={
        <p className="text-center font-(family-name:--font-space-grotesk) text-sm text-black/50">
          Wrong email?{" "}
          <Link href="/signup" className="font-semibold text-[var(--color-primary)]">
            Sign up again
          </Link>
        </p>
      }
    >
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="email" value={email} />

        {state.sent && (
          <p role="status" aria-live="polite" className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-success)]">
            Confirmation email resent. Check your inbox.
          </p>
        )}
        {state.error && (
          <p role="alert" aria-live="assertive" className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-danger)]">
            {state.error}
          </p>
        )}

        <Button type="submit" variant="secondary" className="w-full" disabled={!email} loading={pending}>
          {pending ? "Resending..." : "Resend confirmation email"}
        </Button>
        <p className="text-center font-(family-name:--font-space-grotesk) text-xs leading-5 text-black/40">
          Didn&apos;t get it? Check spam, or resend above.
        </p>
      </form>
    </AuthShell>
  );
}
