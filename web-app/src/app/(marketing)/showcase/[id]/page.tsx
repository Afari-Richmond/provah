import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PublicProjectDetail } from "@/components/marketing/showcase/PublicProjectDetail";
import { getProjectById, getPublishedProjects } from "@/lib/data/projects";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project || project.status !== "published") return {};
  return {
    title: `${project.title} | Provah`,
    description: project.problem,
  };
}

export default async function PublicProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project || project.status !== "published") notFound();

  const allPublished = await getPublishedProjects();
  const similarProjects = allPublished
    .filter((p) => p.id !== project.id && p.field === project.field)
    .slice(0, 3);

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <PublicProjectDetail project={project} similarProjects={similarProjects} />
    </div>
  );
}
