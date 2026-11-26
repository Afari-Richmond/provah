import { AuthShell } from "@/components/layout/AuthShell";
import { ResetPasswordClient } from "@/components/ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      eyebrow="Reset password"
      title="Choose a new password"
      subtitle="Make it something you'll remember, at least 8 characters."
      footer={<></>}
    >
      <ResetPasswordClient />
    </AuthShell>
  );
}
