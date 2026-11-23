import { FramerPage, buildMarketingMetadata } from "@/components/marketing/FramerPage";
import { HomeFixes } from "@/components/marketing/HomeFixes";

export const metadata = buildMarketingMetadata("home");

export default function HomePage() {
  return (
    <>
      <HomeFixes />
      <FramerPage slug="home" />
    </>
  );
}
