"use client";

import { AppNav } from "@/components/layout/AppNav";
import { Eyebrow } from "@/components/ui/Badge";
import { DiscoverProjectCard } from "@/components/project/DiscoverProjectCard";
import { mockProjects } from "@/lib/mockData";

// UI-only: pretending these two are bookmarked for now.
const savedIds = ["1", "5"];

export default function SavedPage() {
  const saved = mockProjects.filter((p) => savedIds.includes(p.id));

  return (
    <div className="min-h-screen bg-white">
      <AppNav active="/saved" />

      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
        <Eyebrow>Saved</Eyebrow>
        <h1 className="mt-3 font-(family-name:--font-unbounded) text-[32px] font-bold leading-tight text-[var(--color-ink)] sm:text-[40px]">
          Projects you&apos;ve saved
        </h1>
        <p className="mt-2 max-w-xl font-(family-name:--font-space-grotesk) text-[15px] leading-7 text-black/60">
          Come back to these whenever you&apos;re ready to reach out.
        </p>

        {saved.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((project) => (
              <DiscoverProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center text-center">
            <p className="font-(family-name:--font-unbounded) text-lg font-bold text-[var(--color-ink)]">
              Nothing saved yet
            </p>
            <p className="mt-2 font-(family-name:--font-space-grotesk) text-sm text-black/50">
              Browse Discover and save projects worth a second look.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
