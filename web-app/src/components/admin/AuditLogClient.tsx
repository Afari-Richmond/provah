"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { loadMoreAuditLog } from "@/lib/actions/admin";
import { timeAgo } from "@/lib/format";
import type { AuditLogEntry } from "@/lib/data/admin";

const ACTION_LABELS: Record<string, string> = {
  suspend_user: "suspended",
  reactivate_user: "reactivated",
  verify_professional: "verified",
  decline_professional: "declined",
  approve_project: "approved",
  reject_project: "rejected",
  resolved_project_report: "resolved a report on",
  dismissed_project_report: "dismissed a report on",
  resolved_profile_report: "resolved a report on",
  dismissed_profile_report: "dismissed a report on",
};

export function AuditLogClient({
  initialEntries,
  hasMore,
}: {
  initialEntries: AuditLogEntry[];
  hasMore: boolean;
}) {
  const [entries, setEntries] = useState(initialEntries);
  const [canLoadMore, setCanLoadMore] = useState(hasMore);
  const [loadingMore, setLoadingMore] = useState(false);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const next = await loadMoreAuditLog(entries.length);
      setEntries((list) => [...list, ...next]);
      if (next.length === 0) setCanLoadMore(false);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      {entries.length === 0 && (
        <Card className="p-8 text-center" shadow="dark">
          <p className="font-(family-name:--font-space-grotesk) text-sm text-black/50">
            No admin actions recorded yet.
          </p>
        </Card>
      )}

      {entries.map((entry) => (
        <Card key={entry.id} className="flex items-center justify-between gap-4 p-4" shadow="dark">
          <p className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-ink)]">
            <span className="font-semibold">{entry.adminName}</span>{" "}
            {ACTION_LABELS[entry.action] ?? entry.action}{" "}
            <span className="font-(family-name:--font-space-mono) text-xs text-black/60">
              {entry.targetType} · {entry.targetId?.slice(0, 8)}
            </span>
            {entry.detail && (
              <span className="block text-xs text-black/50">&quot;{entry.detail}&quot;</span>
            )}
          </p>
          <span className="shrink-0 font-(family-name:--font-space-mono) text-xs text-black/60">
            {timeAgo(entry.createdAt)}
          </span>
        </Card>
      ))}

      {canLoadMore && (
        <div className="mt-4 flex justify-center">
          <Button variant="secondary" onClick={loadMore} loading={loadingMore}>
            {loadingMore ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}
