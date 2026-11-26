import { AppNavBar } from "@/components/layout/AppNavBar";
import { Eyebrow } from "@/components/ui/Badge";
import { SettingsClient } from "@/components/SettingsClient";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { getConnections, getPendingConnectionRequests } from "@/lib/data/connections";
import { getBlockedUsers } from "@/lib/data/blocks";
import { listMfaFactors } from "@/lib/actions/mfa";

export default async function SettingsPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const [
    {
      data: { user },
    },
    connections,
    pendingRequests,
    blockedUsers,
    mfaFactors,
  ] = await Promise.all([
    supabase.auth.getUser(),
    getConnections(profile.id),
    getPendingConnectionRequests(profile.id),
    getBlockedUsers(profile.id),
    listMfaFactors(),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <AppNavBar active="/settings" />

      <main id="main-content" className="mx-auto max-w-2xl px-6 py-10 sm:px-10">
        <Eyebrow>Settings</Eyebrow>
        <h1 className="mt-3 font-(family-name:--font-unbounded) text-[32px] font-bold leading-tight text-[var(--color-ink)]">
          Account settings
        </h1>

        <SettingsClient
          email={user?.email ?? ""}
          notificationPreferences={profile.notificationPreferences}
          connections={connections}
          pendingRequests={pendingRequests}
          blockedUsers={blockedUsers}
          mfaFactors={mfaFactors}
        />
      </main>
    </div>
  );
}
