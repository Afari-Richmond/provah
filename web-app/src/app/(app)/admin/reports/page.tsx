import { AdminNav } from "@/components/layout/AdminNav";
import { Eyebrow } from "@/components/ui/Badge";
import { ReportsQueueClient } from "@/components/admin/ReportsQueueClient";
import { ProfileReportsQueueClient } from "@/components/admin/ProfileReportsQueueClient";
import { getOpenProjectReports, getOpenProfileReports } from "@/lib/data/admin";
import { requireRole } from "@/lib/auth";

export default async function ReportsPage() {
  await requireRole("admin");
  const [projectReports, profileReports] = await Promise.all([
    getOpenProjectReports(),
    getOpenProfileReports(),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <AdminNav active="/admin/reports" />

      <main id="main-content" className="mx-auto max-w-4xl px-6 py-10 sm:px-10">
        <Eyebrow>Moderation</Eyebrow>
        <h1 className="mt-3 font-(family-name:--font-unbounded) text-[32px] font-bold leading-tight text-[var(--color-ink)]">
          Reports
        </h1>
        <p className="mt-2 font-(family-name:--font-space-grotesk) text-[15px] leading-7 text-black/60">
          {projectReports.length + profileReports.length} report
          {projectReports.length + profileReports.length === 1 ? "" : "s"} waiting on a decision.
        </p>

        <h2 className="mt-10 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
          Projects
        </h2>
        <ReportsQueueClient initialReports={projectReports} />

        <h2 className="mt-10 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
          People
        </h2>
        <ProfileReportsQueueClient initialReports={profileReports} />
      </main>
    </div>
  );
}
