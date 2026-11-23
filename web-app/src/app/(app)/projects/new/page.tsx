import { AppNavBar } from "@/components/layout/AppNavBar";
import { NewProjectForm } from "@/components/project/NewProjectForm";

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-white">
      <AppNavBar />
      <NewProjectForm />
    </div>
  );
}
