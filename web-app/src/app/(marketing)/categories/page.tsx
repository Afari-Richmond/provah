import { FramerPage, buildMarketingMetadata } from "@/components/marketing/FramerPage";

export const metadata = buildMarketingMetadata("categories");

export default function CategoriesPage() {
  return <FramerPage slug="categories" />;
}
