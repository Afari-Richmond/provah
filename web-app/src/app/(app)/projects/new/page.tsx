import { AppNavBar } from "@/components/layout/AppNavBar";
import { NewProjectForm } from "@/components/project/NewProjectForm";
import { requireProfile } from "@/lib/auth";

export default async function NewProjectPage() {
  const profile = await requireProfile();

  return (
    <div className="min-h-screen bg-white">
      <AppNavBar />
      <NewProjectForm userId={profile.id} />
    </div>
  );
}
