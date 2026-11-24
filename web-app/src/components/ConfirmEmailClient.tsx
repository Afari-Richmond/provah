"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { confirmEmail } from "@/lib/actions/auth";

/**
 * Auto-submits the confirmation form on mount so clicking the email link
 * confirms in one step instead of two. The form + button stay as a real
 * fallback (no-JS, or if the auto-submit races the page load) — this only
 * fires from a live browser executing JS, so a bare GET from a link-scanning
 * bot never triggers it.
 */
export function ConfirmEmailClient({
  tokenHash,
  type,
  next,
}: {
  tokenHash: string;
  type: string;
  next: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.requestSubmit();
  }, []);

  return (
    <form ref={formRef} action={confirmEmail} className="flex flex-col gap-4">
      <input type="hidden" name="token_hash" value={tokenHash} />
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="next" value={next} />
      <Button type="submit" variant="primary" className="w-full" loading>
        Confirming...
      </Button>
    </form>
  );
}
