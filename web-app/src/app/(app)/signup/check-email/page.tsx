import { CheckEmailClient } from "@/components/CheckEmailClient";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return <CheckEmailClient email={email ?? ""} />;
}
