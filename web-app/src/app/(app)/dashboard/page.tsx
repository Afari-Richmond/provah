import { AppNav } from "@/components/layout/AppNav";
import { StatCard } from "@/components/ui/StatCard";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Eyebrow } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockProjects, currentStudent } from "@/lib/mockData";
import Link from "next/link";

export default function DashboardPage() {
  const myProjects = mockProjects.filter((p) => p.studentName === currentStudent.name);
  const totalViews = myProjects.reduce((sum, p) => sum + p.views, 0);
  const totalMessages = myProjects.reduce((sum, p) => sum + p.messages, 0);

  return (
    <div className="min-h-screen bg-white">
      <AppNav active="/dashboard" />

      <main className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
        <Eyebrow>Welcome back</Eyebrow>
        <h1 className="mt-3 font-(family-name:--font-unbounded) text-[32px] font-bold leading-tight text-[var(--color-ink)] sm:text-[40px]">
          Ama&apos;s projects
        </h1>
        <p className="mt-2 max-w-xl font-(family-name:--font-space-grotesk) text-[15px] leading-7 text-black/60">
          Everything you&apos;ve submitted, and how professionals are finding it.
        </p>

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

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {myProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </main>
    </div>
  );
}
