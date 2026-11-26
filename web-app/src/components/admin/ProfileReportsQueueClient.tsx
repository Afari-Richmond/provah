"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { resolveProfileReport } from "@/lib/actions/admin";
import { timeAgo } from "@/lib/format";
import type { ProfileReport } from "@/lib/data/admin";

export function ProfileReportsQueueClient({ initialReports }: { initialReports: ProfileReport[] }) {
  const [reports, setReports] = useState(initialReports);
  const [, startTransition] = useTransition();

  function resolve(id: string, outcome: "resolved" | "dismissed") {
    setReports((r) => r.filter((report) => report.id !== id));
    startTransition(() => resolveProfileReport(id, outcome));
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      {reports.length === 0 && (
        <Card className="p-8 text-center" shadow="dark">
          <p className="font-(family-name:--font-space-grotesk) text-sm text-black/50">
            No open reports. Nothing flagged right now.
          </p>
        </Card>
      )}

      {reports.map((report) => (
        <Card key={report.id} className="p-6" shadow="dark">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-black/60">
                Reported {timeAgo(report.createdAt)} by {report.reporterName}
              </p>
              <Link
                href={`/profile/${report.reportedId}`}
                className="mt-1 block font-(family-name:--font-unbounded) text-lg font-bold text-[var(--color-ink)] hover:underline"
              >
                {report.reportedName}
              </Link>
              <p className="mt-3 max-w-xl font-(family-name:--font-space-grotesk) text-sm leading-6 text-black/70">
                {report.reason}
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <Button variant="secondary" onClick={() => resolve(report.id, "dismissed")}>
                Dismiss
              </Button>
              <Button
                variant="primary"
                className="bg-[var(--color-danger)]"
                onClick={() => resolve(report.id, "resolved")}
              >
                Mark resolved
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
