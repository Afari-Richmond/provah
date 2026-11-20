import { FramerPage, buildMarketingMetadata } from "@/components/marketing/FramerPage";

export const metadata = buildMarketingMetadata("categories-health");

export default function HealthCategoryPage() {
  return <FramerPage slug="categories-health" />;
}
