import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="flex max-w-md flex-col items-center gap-4 p-8 text-center" shadow="dark">
        <p className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-primary)]">
          404
        </p>
        <h1 className="font-(family-name:--font-unbounded) text-2xl font-bold text-[var(--color-ink)]">
          This page wandered off.
        </h1>
        <p className="font-(family-name:--font-space-grotesk) text-sm text-black/60">
          Whatever you were looking for isn&apos;t here anymore, or never was. It may have been
          moved, deleted, or the link was wrong.
        </p>
        <div className="mt-2 flex gap-3">
          <Link href="/discover">
            <Button variant="secondary">Browse Discover</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary">Go home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
