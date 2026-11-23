import { notFound } from "next/navigation";
import { AppNavBar } from "@/components/layout/AppNavBar";
import { EditProjectForm } from "@/components/project/EditProjectForm";
import { getProjectById } from "@/lib/data/projects";
import { requireProfile } from "@/lib/auth";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireProfile();
  const project = await getProjectById(id);

  if (!project || project.studentId !== profile.id) notFound();

  return (
    <div className="min-h-screen bg-white">
      <AppNavBar />
      <EditProjectForm project={project} />
    </div>
  );
}
