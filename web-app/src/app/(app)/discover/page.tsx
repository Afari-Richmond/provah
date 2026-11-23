import { AppNavBar } from "@/components/layout/AppNavBar";
import { DiscoverClient } from "@/components/project/DiscoverClient";
import { getPublishedProjects } from "@/lib/data/projects";

export default async function DiscoverPage() {
  const published = await getPublishedProjects();

  return (
    <div className="min-h-screen bg-white">
      <AppNavBar active="/discover" />
      <DiscoverClient published={published} />
    </div>
  );
}
