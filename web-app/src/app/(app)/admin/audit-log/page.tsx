import { AdminNav } from "@/components/layout/AdminNav";
import { Eyebrow } from "@/components/ui/Badge";
import { AuditLogClient } from "@/components/admin/AuditLogClient";
import { getAuditLog, AUDIT_LOG_PAGE_SIZE } from "@/lib/data/admin";
import { requireRole } from "@/lib/auth";

export default async function AuditLogPage() {
  await requireRole("admin");
  const entries = await getAuditLog({ limit: AUDIT_LOG_PAGE_SIZE });

  return (
    <div className="min-h-screen bg-white">
      <AdminNav active="/admin/audit-log" />

      <main id="main-content" className="mx-auto max-w-4xl px-6 py-10 sm:px-10">
        <Eyebrow>Accountability</Eyebrow>
        <h1 className="mt-3 font-(family-name:--font-unbounded) text-[32px] font-bold leading-tight text-[var(--color-ink)]">
          Audit log
        </h1>
        <p className="mt-2 font-(family-name:--font-space-grotesk) text-[15px] leading-7 text-black/60">
          Every suspend, verify, approve/reject, and report decision made by an admin.
        </p>
        <AuditLogClient initialEntries={entries} hasMore={entries.length === AUDIT_LOG_PAGE_SIZE} />
      </main>
    </div>
  );
}
