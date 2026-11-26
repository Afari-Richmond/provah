import { FramerPage, buildMarketingMetadata } from "@/components/marketing/FramerPage";

export const metadata = buildMarketingMetadata("categories-engineering");

export default function EngineeringCategoryPage() {
  return <FramerPage slug="categories-engineering" />;
}
