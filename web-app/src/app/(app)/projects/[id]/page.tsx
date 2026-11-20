"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppNav } from "@/components/layout/AppNav";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { mockProjects } from "@/lib/mockData";

const fieldDot: Record<string, string> = {
  Engineering: "bg-[var(--color-accent)]",
  "Health & Medicine": "bg-[var(--color-primary)]",
  "Finance & Technology": "bg-[var(--color-ink)]",
};

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const project = mockProjects.find((p) => p.id === id);
  const [bookmarked, setBookmarked] = useState(false);
  const [messaged, setMessaged] = useState(false);

  if (!project) notFound();

  return (
    <div className="min-h-screen bg-white">
      <AppNav />

      <main className="mx-auto max-w-4xl px-6 py-10 sm:px-10">
        <Link
          href="/discover"
          className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-black/40 hover:text-[var(--color-ink)]"
        >
          ← Back to Discover
        </Link>

        <div className="mt-6 flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${fieldDot[project.field]}`} />
          <span className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-black/50">
            {project.field}
          </span>
        </div>

        <h1 className="mt-3 font-(family-name:--font-unbounded) text-[32px] font-bold leading-tight text-[var(--color-ink)] sm:text-[40px]">
          {project.title}
        </h1>

        <div className="mt-5 flex items-center gap-3">
          <Avatar name={project.studentName} />
          <div>
            <div className="font-(family-name:--font-space-grotesk) text-sm font-semibold text-[var(--color-ink)]">
              {project.studentName}
            </div>
            <div className="font-(family-name:--font-space-grotesk) text-xs text-black/50">
              {project.university}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_280px]">
          <div className="flex flex-col gap-6">
            <Card className="p-6" shadow="dark">
              <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
                The problem
              </h2>
              <p className="mt-3 font-(family-name:--font-space-grotesk) text-[15px] leading-7 text-black/70">
                {project.problem}
              </p>
            </Card>

            <Card className="p-6" shadow="dark">
              <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
                The solution
              </h2>
              <p className="mt-3 font-(family-name:--font-space-grotesk) text-[15px] leading-7 text-black/70">
                {project.solution || "No write-up provided yet."}
              </p>
            </Card>

            {project.team.length > 0 && (
              <Card className="p-6" shadow="dark">
                <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
                  Team
                </h2>
                <div className="mt-3 flex flex-wrap gap-3">
                  {project.team.map((m) => (
                    <div key={m.id} className="flex items-center gap-2">
                      <Avatar name={m.name} size={32} />
                      <span className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-ink)]">
                        {m.name}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Card className="p-5" shadow="dark">
              <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
                Tech stack
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.techStack.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[var(--color-surface)] px-3 py-1 font-(family-name:--font-space-grotesk) text-sm text-[var(--color-ink)]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {(project.githubUrl || project.demoUrl) && (
                <div className="mt-5 flex flex-col gap-2 border-t border-dashed border-black/15 pt-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-primary)]"
                    >
                      View on GitHub →
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-primary)]"
                    >
                      View live demo →
                    </a>
                  )}
                </div>
              )}
            </Card>

            <Button
              variant={messaged ? "secondary" : "dark"}
              className="w-full"
              onClick={() => setMessaged(true)}
              disabled={messaged}
            >
              {messaged ? "Message sent ✓" : "Message student"}
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setBookmarked((b) => !b)}
            >
              {bookmarked ? "★ Saved" : "☆ Save for later"}
            </Button>

            <div className="flex items-center justify-between px-1 font-(family-name:--font-space-mono) text-xs text-black/40">
              <span>{project.views} views</span>
              <span>{project.bookmarks + (bookmarked ? 1 : 0)} saved</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
