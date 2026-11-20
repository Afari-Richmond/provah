"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/Button";
import { TextField, SelectField } from "@/components/ui/Field";

type Role = "student" | "professional";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("student");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
  }

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
      <div className="pv-border flex w-full rounded-full bg-white p-1">
        <button
          type="button"
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

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <TextField label="Full name" name="name" placeholder="Ama Owusu" required />
        <TextField
          label="Email"
          name="email"
          type="email"
          placeholder="you@university.edu"
          hint={role === "student" ? "University email preferred" : undefined}
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          required
        />

        {role === "student" ? (
          <>
            <TextField label="University" name="university" placeholder="e.g. KNUST" required />
            <SelectField label="Field of study" name="field" defaultValue="">
              <option value="" disabled>
                Select a field
              </option>
              <option value="engineering">Engineering &amp; Technology</option>
              <option value="health">Health &amp; Medicine</option>
              <option value="fintech">Finance &amp; Technology</option>
            </SelectField>
          </>
        ) : (
          <>
            <TextField label="Company / organization" name="company" placeholder="e.g. MTN Group" required />
            <TextField label="Title" name="title" placeholder="e.g. Product Manager" required />
          </>
        )}

        <Button type="submit" variant="primary" className="mt-2 w-full">
          Create account
        </Button>
        <p className="text-center font-(family-name:--font-space-grotesk) text-xs leading-5 text-black/40">
          By continuing you agree to Provah&apos;s Terms and Privacy Policy.
        </p>
      </form>
    </AuthShell>
  );
}
