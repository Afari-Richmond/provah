import { AdminNav } from "@/components/layout/AdminNav";
import { Eyebrow } from "@/components/ui/Badge";
import { ReviewQueueClient } from "@/components/admin/ReviewQueueClient";
import { getPendingReviewProjects } from "@/lib/data/projects";

export default async function ReviewQueuePage() {
  const queue = await getPendingReviewProjects();

  return (
    <div className="min-h-screen bg-white">
      <AdminNav active="/admin/review-queue" />

      <main className="mx-auto max-w-4xl px-6 py-10 sm:px-10">
        <Eyebrow>Moderation</Eyebrow>
        <h1 className="mt-3 font-(family-name:--font-unbounded) text-[32px] font-bold leading-tight text-[var(--color-ink)]">
          Review queue
        </h1>
        <ReviewQueueClient initialQueue={queue} />
      </main>
    </div>
  );
}
