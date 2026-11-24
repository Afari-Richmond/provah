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
          <p className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-danger)]">
            That confirmation link is invalid or expired. Log in to request a new one.
          </p>
        )}
        <TextField
          label="Email"
          name="email"
          type="email"
          placeholder="you@university.edu"
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          placeholder="Your password"
          required
        />

        {state.error && (
          <p className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-danger)]">
            {state.error}
          </p>
        )}

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 font-(family-name:--font-space-grotesk) text-sm text-black/60">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-2 border-[var(--color-ink)]/20 accent-[var(--color-primary)]"
            />
            Remember me
          </label>
          <a
            href="#"
            className="font-(family-name:--font-space-grotesk) text-sm font-semibold text-[var(--color-primary)]"
          >
            Forgot password?
          </a>
        </div>

        <Button type="submit" variant="primary" className="mt-2 w-full" loading={pending}>
          {pending ? "Logging in..." : "Log in"}
        </Button>
      </form>
    </AuthShell>
  );
}
