import { FramerPage, buildMarketingMetadata } from "@/components/marketing/FramerPage";
import { HomeFixes } from "@/components/marketing/HomeFixes";
import { HomeDynamicSectionsFix } from "@/components/marketing/HomeDynamicSectionsFix";
import { getPublishedProjects } from "@/lib/data/projects";

export const metadata = buildMarketingMetadata("home");

export default async function HomePage() {
  const projects = await getPublishedProjects();

  return (
    <>
      <HomeFixes />
      <HomeDynamicSectionsFix projects={projects} />
      <FramerPage slug="home" />
    </>
  );
}
