import { AdminNav } from "@/components/layout/AdminNav";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Eyebrow } from "@/components/ui/Badge";
import { getAdminAnalytics } from "@/lib/data/admin";
import { requireRole } from "@/lib/auth";

export default async function AdminAnalyticsPage() {
  await requireRole("admin");
  const { students, professionals, approvalRate, pending, avgTurnaroundDays, signupsByWeek } =
    await getAdminAnalytics();

  const maxSignups = Math.max(1, ...signupsByWeek.map((w) => w.students + w.professionals));

  return (
    <div className="min-h-screen bg-white">
      <AdminNav active="/admin/analytics" />

      <main id="main-content" className="mx-auto max-w-4xl px-6 py-10 sm:px-10">
        <Eyebrow>Platform analytics</Eyebrow>
        <h1 className="mt-3 font-(family-name:--font-unbounded) text-[32px] font-bold leading-tight text-[var(--color-ink)]">
          How Provah is doing
        </h1>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard value={students} label="Students" />
          <StatCard value={professionals} label="Professionals" />
          <StatCard value={`${approvalRate}%`} label="Approval rate" />
          <StatCard value={pending} label="Awaiting review" />
        </div>

        <Card className="mt-8 p-6 sm:p-8" shadow="dark">
          <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
            Signups by week
          </h2>
          <div className="mt-6 flex h-48 items-end gap-4">
            {signupsByWeek.map((w) => {
              const total = w.students + w.professionals;
              const studentHeight = (w.students / maxSignups) * 100;
              const proHeight = (w.professionals / maxSignups) * 100;
              return (
                <div key={w.label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-36 w-full flex-col justify-end gap-1">
                    <div
                      className="w-full rounded-t-md bg-[var(--color-accent)]"
                      style={{ height: `${proHeight}%` }}
                      title={`${w.professionals} professionals`}
                    />
                    <div
                      className="w-full rounded-t-md bg-[var(--color-primary)]"
                      style={{ height: `${studentHeight}%` }}
                      title={`${w.students} students`}
                    />
                  </div>
                  <span className="font-(family-name:--font-space-mono) text-[10px] text-black/40">
                    {w.label}
                  </span>
                  <span className="font-(family-name:--font-space-mono) text-[10px] font-bold text-black/60">
                    {total}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex gap-5 font-(family-name:--font-space-mono) text-[10px] font-bold uppercase tracking-[0.03em] text-black/50">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-[var(--color-primary)]" /> Students
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-[var(--color-accent)]" /> Professionals
            </span>
          </div>
        </Card>

        <Card className="mt-6 p-6 sm:p-8" shadow="dark">
          <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
            Review turnaround
          </h2>
          <p className="mt-3 font-(family-name:--font-space-grotesk) text-2xl font-bold text-[var(--color-ink)]">
            {avgTurnaroundDays.toFixed(1)} days
          </p>
          <p className="mt-1 font-(family-name:--font-space-grotesk) text-sm text-black/50">
            Average time from submission to a published/rejected decision.
          </p>
        </Card>
      </main>
    </div>
  );
}
