import Link from "next/link";
import { redirect } from "next/navigation";
import { AppNavBar } from "@/components/layout/AppNavBar";
import { StatCard } from "@/components/ui/StatCard";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Avatar } from "@/components/ui/Avatar";
import { Eyebrow } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { requireProfile } from "@/lib/auth";
import { getProjectsByStudent } from "@/lib/data/projects";

export default async function DashboardPage() {
  const profile = await requireProfile();
  if (profile.role === "professional") redirect("/discover");
  if (profile.role === "admin") redirect("/admin/review-queue");

  const myProjects = await getProjectsByStudent(profile.id);
  const totalViews = myProjects.reduce((sum, p) => sum + p.views, 0);
  const totalMessages = myProjects.reduce((sum, p) => sum + p.messages, 0);
  const firstName = profile.name.split(" ")[0];

  return (
    <div className="min-h-screen bg-white">
      <AppNavBar active="/dashboard" />

      <main className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Eyebrow>Welcome back</Eyebrow>
            <h1 className="mt-3 font-(family-name:--font-unbounded) text-[32px] font-bold leading-tight text-[var(--color-ink)] sm:text-[40px]">
              {firstName}&apos;s projects
            </h1>
            <p className="mt-2 max-w-xl font-(family-name:--font-space-grotesk) text-[15px] leading-7 text-black/60">
              Everything you&apos;ve submitted, and how professionals are finding it.
            </p>
          </div>
          <Link
            href="/profile"
            className="pv-border pv-shadow-sm flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-5"
          >
            <Avatar name={profile.name} seed={profile.id} imageUrl={profile.avatarUrl ?? undefined} size={44} />
            <div>
              <p className="font-(family-name:--font-space-grotesk) text-sm font-semibold text-[var(--color-ink)]">
                {profile.name}
              </p>
              <p className="font-(family-name:--font-space-mono) text-[10px] font-bold uppercase tracking-[0.03em] text-[var(--color-primary)]">
                View profile →
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard value={myProjects.length} label="Projects" />
          <StatCard value={totalViews} label="Total views" />
          <StatCard value={totalMessages} label="Messages" />
        </div>

        <div className="mt-12 flex items-center justify-between">
          <h2 className="font-(family-name:--font-unbounded) text-xl font-bold text-[var(--color-ink)]">
            Your projects
          </h2>
          <Link href="/projects/new">
            <Button variant="primary">+ New project</Button>
          </Link>
        </div>

        {myProjects.length === 0 ? (
          <div className="pv-border mt-6 rounded-2xl bg-[var(--color-surface)] p-10 text-center">
            <p className="font-(family-name:--font-space-grotesk) text-sm text-black/50">
              You haven&apos;t submitted a project yet.
            </p>
            <Link href="/projects/new" className="mt-4 inline-block">
              <Button variant="primary">Submit your first project</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {myProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
