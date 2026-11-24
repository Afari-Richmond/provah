import { AppNavBar } from "@/components/layout/AppNavBar";
import { Eyebrow } from "@/components/ui/Badge";
import { DiscoverProjectCard } from "@/components/project/DiscoverProjectCard";
import { requireProfile } from "@/lib/auth";
import { getBookmarkedProjects } from "@/lib/data/projects";

export default async function SavedPage() {
  const profile = await requireProfile();

  const saved = await getBookmarkedProjects(profile.id);

  return (
    <div className="min-h-screen bg-white">
      <AppNavBar active="/saved" />

      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
        <Eyebrow>Saved</Eyebrow>
        <h1 className="mt-3 font-(family-name:--font-unbounded) text-[32px] font-bold leading-tight text-[var(--color-ink)] sm:text-[40px]">
          Your saved projects
        </h1>
        <p className="mt-2 max-w-xl font-(family-name:--font-space-grotesk) text-[15px] leading-7 text-black/60">
          Projects you&apos;ve bookmarked for later.
        </p>

        {saved.length === 0 ? (
          <div className="pv-border mt-8 rounded-2xl bg-[var(--color-surface)] p-10 text-center">
            <p className="font-(family-name:--font-space-grotesk) text-sm text-black/50">
              Nothing saved yet. Browse Discover and tap &quot;Save for later&quot; on a project.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((project) => (
              <DiscoverProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
