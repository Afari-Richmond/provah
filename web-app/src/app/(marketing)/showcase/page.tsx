import { FramerPage, buildMarketingMetadata } from "@/components/marketing/FramerPage";

export const metadata = buildMarketingMetadata("showcase");

export default function ShowcasePage() {
  return <FramerPage slug="showcase" />;
}
