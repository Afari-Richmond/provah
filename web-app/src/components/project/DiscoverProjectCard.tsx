import Link from "next/link";
import { Project } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { ProjectThumbnail } from "@/components/project/ProjectThumbnail";

const fieldDot: Record<Project["field"], string> = {
  "Engineering & Technology": "bg-[#FF7A30]",
  "Health & Medicine": "bg-[#6C4CE0]",
  "Finance & Technology": "bg-[#161221]",
  "Agriculture & Agritech": "bg-[#1E9E5A]",
  "Energy & Sustainability": "bg-[#FFB380]",
  "Education & EdTech": "bg-[#9B80EC]",
  "Creative & Media": "bg-[#D64545]",
  "Business & Social Impact": "bg-[#4C6FE0]",
};

export function DiscoverProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="flex h-full flex-col gap-4 p-5 transition-transform hover:-translate-y-1" shadow="dark">
        <ProjectThumbnail projectId={project.id} imageUrl={project.imageUrl} title={project.title} />

        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${fieldDot[project.field]}`} />
          <span className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-black/50">
            {project.field}
          </span>
        </div>

        <h3 className="font-(family-name:--font-unbounded) text-lg font-bold leading-snug text-[var(--color-ink)]">
          {project.title}
        </h3>

        <p className="line-clamp-2 flex-1 font-(family-name:--font-space-grotesk) text-sm leading-6 text-black/60">
          {project.problem}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full bg-[var(--color-surface)] px-2.5 py-1 font-(family-name:--font-space-grotesk) text-xs text-black/60"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-dashed border-black/15 pt-4 font-(family-name:--font-space-grotesk) text-xs text-black/50">
          <span>{project.studentName}</span>
          <span>{project.university}</span>
        </div>
      </Card>
    </Link>
  );
}
