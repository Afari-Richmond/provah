import { FramerPage, buildMarketingMetadata } from "@/components/marketing/FramerPage";

export const metadata = buildMarketingMetadata("about");

export default function AboutPage() {
  return <FramerPage slug="about" />;
}
