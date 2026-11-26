"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/Button";
import { TextField, SelectField } from "@/components/ui/Field";
import { signUp, type AuthFormState } from "@/lib/actions/auth";
import { PROJECT_FIELDS } from "@/lib/fields";

type Role = "student" | "professional";

const initialState: AuthFormState = { error: null };

export default function SignupPage() {
  const [role, setRole] = useState<Role>("student");
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <AuthShell
      eyebrow="Join Provah"
      title="Create your account"
      subtitle="Free for students and industry professionals, always."
      footer={
        <p className="text-center font-(family-name:--font-space-grotesk) text-sm text-black/50">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[var(--color-primary)]">
            Log in
          </Link>
        </p>
      }
    >
      <div role="radiogroup" aria-label="Account type" className="pv-border flex w-full rounded-full bg-white p-1">
        <button
          type="button"
          role="radio"
          aria-checked={role === "student"}
          onClick={() => setRole("student")}
          className={`flex-1 rounded-full px-4 py-2.5 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] transition-colors ${
            role === "student"
              ? "bg-[var(--color-primary)] text-white"
              : "text-[var(--color-ink)]"
          }`}
        >
          I&apos;m a student
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={role === "professional"}
          onClick={() => setRole("professional")}
          className={`flex-1 rounded-full px-4 py-2.5 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] transition-colors ${
            role === "professional"
              ? "bg-[var(--color-primary)] text-white"
              : "text-[var(--color-ink)]"
          }`}
        >
          I&apos;m a professional
        </button>
      </div>

      <form action={formAction} className="mt-6 flex flex-col gap-5">
        <input type="hidden" name="role" value={role} />
        <TextField label="Full name" name="name" autoComplete="name" placeholder="Ama Owusu" required />
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@university.edu"
          hint={role === "student" ? "University email preferred" : undefined}
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          minLength={8}
          required
        />

        {role === "student" ? (
          <>
            <TextField label="University" name="university" placeholder="e.g. KNUST" required />
            <SelectField label="Field of study" name="field" defaultValue="">
              <option value="" disabled>
                Select a field
              </option>
              {PROJECT_FIELDS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </SelectField>
          </>
        ) : (
          <>
            <TextField label="Company / organization" name="company" placeholder="e.g. MTN Group" required />
            <TextField label="Title" name="title" placeholder="e.g. Product Manager" required />
          </>
        )}

        {state.error && (
          <p role="alert" aria-live="assertive" className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-danger)]">
            {state.error}
          </p>
        )}

        <Button type="submit" variant="primary" className="mt-2 w-full" loading={pending}>
          {pending ? "Creating account..." : "Create account"}
        </Button>
        <p className="text-center font-(family-name:--font-space-grotesk) text-xs leading-5 text-black/40">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="font-semibold text-[var(--color-primary)]">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-semibold text-[var(--color-primary)]">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </AuthShell>
  );
}
