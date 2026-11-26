"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { logIn, type AuthFormState } from "@/lib/actions/auth";

const initialState: AuthFormState = { error: null };

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [state, formAction, pending] = useActionState(logIn, initialState);
  const searchParams = useSearchParams();
  const confirmationFailed = searchParams.get("error") === "confirmation_failed";

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to Provah"
      subtitle="Pick up right where you left off."
      footer={
        <p className="text-center font-(family-name:--font-space-grotesk) text-sm text-black/50">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-[var(--color-primary)]">
            Sign up
          </Link>
        </p>
      }
    >
      <form action={formAction} className="flex flex-col gap-5">
        {confirmationFailed && (
          <p role="alert" className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-danger)]">
            That confirmation link is invalid or expired. Log in to request a new one.
          </p>
        )}
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@university.edu"
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          required
        />

        {state.error && (
          <p role="alert" aria-live="assertive" className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-danger)]">
            {state.error}
          </p>
        )}

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="font-(family-name:--font-space-grotesk) text-sm font-semibold text-[var(--color-primary)]"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" className="mt-2 w-full" loading={pending}>
          {pending ? "Logging in..." : "Log in"}
        </Button>
      </form>
    </AuthShell>
  );
}
