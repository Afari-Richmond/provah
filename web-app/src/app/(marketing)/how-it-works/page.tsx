import { FramerPage, buildMarketingMetadata } from "@/components/marketing/FramerPage";

export const metadata = buildMarketingMetadata("how-it-works");

export default function HowItWorksPage() {
  return <FramerPage slug="how-it-works" />;
}
