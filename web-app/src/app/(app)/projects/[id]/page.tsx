import { notFound } from "next/navigation";
import { AppNavBar } from "@/components/layout/AppNavBar";
import { ProjectDetailView } from "@/components/project/ProjectDetailView";
import { getProjectById, getPublishedProjects, getBookmarkedProjectIds } from "@/lib/data/projects";
import { requireProfile } from "@/lib/auth";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const viewer = await requireProfile();
  const project = await getProjectById(id);

  if (!project) notFound();
  if (project.status !== "published" && project.studentId !== viewer.id && viewer.role !== "admin") {
    notFound();
  }

  const [allPublished, bookmarkedIds] = await Promise.all([
    getPublishedProjects(),
    viewer.role === "professional" ? getBookmarkedProjectIds(viewer.id) : Promise.resolve(new Set<string>()),
  ]);

  const similarProjects = allPublished
    .filter((p) => p.id !== project.id && p.field === project.field)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <AppNavBar />
      <ProjectDetailView
        project={project}
        similarProjects={similarProjects}
        viewer={viewer}
        initiallyBookmarked={bookmarkedIds.has(project.id)}
      />
    </div>
  );
}
