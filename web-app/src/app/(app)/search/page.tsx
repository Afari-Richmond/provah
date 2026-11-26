import Link from "next/link";
import { AppNavBar } from "@/components/layout/AppNavBar";
import { Eyebrow } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { DiscoverProjectCard } from "@/components/project/DiscoverProjectCard";
import { requireProfile } from "@/lib/auth";
import { searchProfiles } from "@/lib/data/users";
import { searchProjects } from "@/lib/data/projects";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const viewer = await requireProfile();
  const [people, projects] = q
    ? await Promise.all([searchProfiles(q, viewer.id), searchProjects(q)])
    : [[], []];
  const totalResults = people.length + projects.length;

  return (
    <div className="min-h-screen bg-white">
      <AppNavBar />

      <main id="main-content" className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
        <Eyebrow>Search</Eyebrow>
        <h1 className="mt-3 font-(family-name:--font-unbounded) text-[28px] font-bold leading-tight text-[var(--color-ink)] sm:text-[34px]">
          {q ? `Results for "${q}"` : "Search people & projects"}
        </h1>

        <form action="/search" method="GET" className="mt-6">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by name, project title, tools, field..."
            className="w-full rounded-full border-2 border-[var(--color-ink)]/15 bg-white px-5 py-3 font-(family-name:--font-space-grotesk) text-base text-[var(--color-ink)] outline-none placeholder:text-black/30 focus:border-[var(--color-primary)]"
          />
        </form>

        {q && (
          <p className="mt-6 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
            {totalResults} result{totalResults === 1 ? "" : "s"}
          </p>
        )}

        {projects.length > 0 && (
          <div className="mt-6">
            <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
              Projects
            </h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {projects.map((project) => (
                <DiscoverProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {people.length > 0 && (
          <div className="mt-8">
            <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
              People
            </h2>
            <div className="mt-3 flex flex-col gap-3">
              {people.map((profile) => (
                <Link
                  key={profile.id}
                  href={`/profile/${profile.id}`}
                  className="pv-border flex items-center gap-4 rounded-2xl p-4 transition-transform hover:-translate-y-0.5"
                >
                  <Avatar
                    name={profile.name}
                    seed={profile.id}
                    imageUrl={profile.avatarUrl ?? undefined}
                    size={48}
                  />
                  <div>
                    <div className="font-(family-name:--font-space-grotesk) text-[15px] font-semibold text-[var(--color-ink)]">
                      {profile.name}
                    </div>
                    <div className="font-(family-name:--font-space-grotesk) text-xs text-black/50">
                      {profile.role === "student"
                        ? [profile.fieldOfStudy, profile.university].filter(Boolean).join(" · ")
                        : [profile.title, profile.company].filter(Boolean).join(" at ")}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {q && totalResults === 0 && (
          <p className="mt-10 text-center font-(family-name:--font-space-grotesk) text-sm text-black/40">
            Nothing matches that search yet — try a different term, or browse Discover instead.
          </p>
        )}
      </main>
    </div>
  );
}
