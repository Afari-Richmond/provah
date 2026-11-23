import { requireProfile } from "@/lib/auth";
import { getUnreadNotificationCount } from "@/lib/data/notifications";
import { AppNav } from "./AppNav";

export async function AppNavBar({ active }: { active?: string }) {
  const profile = await requireProfile();
  const unreadCount = await getUnreadNotificationCount(profile.id);

  return <AppNav active={active} profile={profile} unreadCount={unreadCount} />;
}
