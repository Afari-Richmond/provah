"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="flex max-w-md flex-col items-center gap-4 p-8 text-center" shadow="dark">
        <p className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-danger)]">
          Something went wrong
        </p>
        <h1 className="font-(family-name:--font-unbounded) text-2xl font-bold text-[var(--color-ink)]">
          That didn&apos;t load right.
        </h1>
        <p className="font-(family-name:--font-space-grotesk) text-sm text-black/60">
          Something broke on our end. Try again, or head back to your dashboard.
        </p>
        <div className="mt-2 flex gap-3">
          <Button variant="secondary" onClick={() => reset()}>
            Try again
          </Button>
          <Link href="/dashboard">
            <Button variant="primary">Go home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
