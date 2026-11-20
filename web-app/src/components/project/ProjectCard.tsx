import Link from "next/link";
import { Project } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/Badge";

const fieldDot: Record<Project["field"], string> = {
  Engineering: "bg-[var(--color-accent)]",
  "Health & Medicine": "bg-[var(--color-primary)]",
  "Finance & Technology": "bg-[var(--color-ink)]",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex flex-col gap-4 p-5" shadow="dark">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${fieldDot[project.field]}`} />
          <span className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-black/50">
            {project.field}
          </span>
        </div>
        <StatusPill status={project.status} />
      </div>

      <h3 className="font-(family-name:--font-unbounded) text-lg font-bold leading-snug text-[var(--color-ink)]">
        {project.title}
      </h3>

      <p className="line-clamp-2 font-(family-name:--font-space-grotesk) text-sm leading-6 text-black/60">
        {project.problem}
      </p>

      <div className="flex items-center justify-between border-t border-dashed border-black/15 pt-4">
        <div className="flex gap-4 font-(family-name:--font-space-mono) text-xs text-black/50">
          <span>{project.views} views</span>
          <span>{project.bookmarks} saved</span>
          <span>{project.messages} msgs</span>
        </div>
        <Link
          href={`/projects/${project.id}/edit`}
          className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-primary)]"
        >
          Manage →
        </Link>
      </div>
    </Card>
  );
}
