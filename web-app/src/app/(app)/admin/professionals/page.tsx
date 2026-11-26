import { AdminNav } from "@/components/layout/AdminNav";
import { Eyebrow } from "@/components/ui/Badge";
import { ProfessionalsQueueClient } from "@/components/admin/ProfessionalsQueueClient";
import { getPendingProfessionals } from "@/lib/data/admin";
import { requireRole } from "@/lib/auth";

export default async function AdminProfessionalsPage() {
  await requireRole("admin");
  const queue = await getPendingProfessionals();

  return (
    <div className="min-h-screen bg-white">
      <AdminNav active="/admin/professionals" />

      <main id="main-content" className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
        <Eyebrow>Verification</Eyebrow>
        <h1 className="mt-3 font-(family-name:--font-unbounded) text-[32px] font-bold leading-tight text-[var(--color-ink)]">
          Professional accounts
        </h1>
        <p className="mt-2 font-(family-name:--font-space-grotesk) text-[15px] leading-7 text-black/60">
          Verify before they can message students.
        </p>

        <ProfessionalsQueueClient initialQueue={queue} />
      </main>
    </div>
  );
}
