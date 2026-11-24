import { AuthShell } from "@/components/layout/AuthShell";
import { ConfirmEmailClient } from "@/components/ConfirmEmailClient";

export default async function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string; next?: string }>;
}) {
  const { token_hash, type, next } = await searchParams;

  return (
    <AuthShell
      eyebrow="Verify your email"
      title="Confirm your email"
      subtitle="Hang tight, we're activating your Provah account."
      footer={<></>}
    >
      {token_hash && type ? (
        <ConfirmEmailClient tokenHash={token_hash} type={type} next={next ?? "/dashboard"} />
      ) : (
        <p className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-danger)]">
          This confirmation link is missing required information.
        </p>
      )}
    </AuthShell>
  );
}
