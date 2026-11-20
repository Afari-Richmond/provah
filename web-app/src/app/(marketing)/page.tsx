import { FramerPage, buildMarketingMetadata } from "@/components/marketing/FramerPage";

export const metadata = buildMarketingMetadata("home");

export default function HomePage() {
  return <FramerPage slug="home" />;
}
