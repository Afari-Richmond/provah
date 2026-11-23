import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/Button";
import { confirmEmail } from "@/lib/actions/auth";

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
      subtitle="Click below to finish activating your Provah account."
      footer={<></>}
    >
      {token_hash && type ? (
        <form action={confirmEmail} className="flex flex-col gap-4">
          <input type="hidden" name="token_hash" value={token_hash} />
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="next" value={next ?? "/dashboard"} />
          <Button type="submit" variant="primary" className="w-full">
            Confirm email
          </Button>
        </form>
      ) : (
        <p className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-danger)]">
          This confirmation link is missing required information.
        </p>
      )}
    </AuthShell>
  );
}
