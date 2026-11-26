import { AuthShell } from "@/components/layout/AuthShell";
import { MfaChallengeClient } from "@/components/MfaChallengeClient";

export default function MfaChallengePage() {
  return (
    <AuthShell
      eyebrow="Two-factor authentication"
      title="Enter your code"
      subtitle="Open your authenticator app and enter the 6-digit code for Provah."
      footer={<></>}
    >
      <MfaChallengeClient />
    </AuthShell>
  );
}
