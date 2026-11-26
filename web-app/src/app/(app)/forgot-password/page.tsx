import Link from "next/link";
import { AuthShell } from "@/components/layout/AuthShell";
import { ForgotPasswordClient } from "@/components/ForgotPasswordClient";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Reset password"
      title="Forgot your password?"
      subtitle="Enter the email on your account and we'll send you a link to set a new one."
      footer={
        <p className="text-center font-(family-name:--font-space-grotesk) text-sm text-black/50">
          Remembered it?{" "}
          <Link href="/login" className="font-semibold text-[var(--color-primary)]">
            Log in
          </Link>
        </p>
      }
    >
      <ForgotPasswordClient />
    </AuthShell>
  );
}
