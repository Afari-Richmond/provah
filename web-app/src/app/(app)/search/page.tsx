import Link from "next/link";
import { AppNavBar } from "@/components/layout/AppNavBar";
import { Eyebrow } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { requireProfile } from "@/lib/auth";
import { searchProfiles } from "@/lib/data/users";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const viewer = await requireProfile();
  const results = q ? await searchProfiles(q, viewer.id) : [];

  return (
    <div className="min-h-screen bg-white">
      <AppNavBar />

      <main className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
        <Eyebrow>Search</Eyebrow>
        <h1 className="mt-3 font-(family-name:--font-unbounded) text-[28px] font-bold leading-tight text-[var(--color-ink)] sm:text-[34px]">
          {q ? `Results for "${q}"` : "Search students & professionals"}
        </h1>

        <form action="/search" method="GET" className="mt-6">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by name, university, company, field..."
            className="w-full rounded-full border-2 border-[var(--color-ink)]/15 bg-white px-5 py-3 font-(family-name:--font-space-grotesk) text-[15px] text-[var(--color-ink)] outline-none placeholder:text-black/30 focus:border-[var(--color-primary)]"
          />
        </form>

        {q && (
          <p className="mt-6 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
            {results.length} result{results.length === 1 ? "" : "s"}
          </p>
        )}

        <div className="mt-4 flex flex-col gap-3">
          {results.map((profile) => (
            <Link
              key={profile.id}
              href={`/profile/${profile.id}`}
              className="pv-border flex items-center gap-4 rounded-2xl p-4 transition-transform hover:-translate-y-0.5"
            >
              <Avatar name={profile.name} seed={profile.id} imageUrl={profile.avatarUrl ?? undefined} size={48} />
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

        {q && results.length === 0 && (
          <p className="mt-10 text-center font-(family-name:--font-space-grotesk) text-sm text-black/40">
            No one matches that search yet.
          </p>
        )}
      </main>
    </div>
  );
}
