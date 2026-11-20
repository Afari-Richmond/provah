import { FramerPage, buildMarketingMetadata } from "@/components/marketing/FramerPage";

export const metadata = buildMarketingMetadata("categories-fintech");

export default function FintechCategoryPage() {
  return <FramerPage slug="categories-fintech" />;
}
