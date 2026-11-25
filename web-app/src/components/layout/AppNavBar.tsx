import { requireProfile } from "@/lib/auth";
import { getNotifications, getUnreadNotificationCount } from "@/lib/data/notifications";
import { getUnreadConversationCount } from "@/lib/data/messaging";
import { AppNav } from "./AppNav";

export async function AppNavBar({ active }: { active?: string }) {
  const profile = await requireProfile();
  const [unreadCount, unreadMessageCount, notifications] = await Promise.all([
    getUnreadNotificationCount(profile.id),
    getUnreadConversationCount(profile.id),
    getNotifications(profile.id),
  ]);

  return (
    <AppNav
      active={active}
      profile={profile}
      unreadCount={unreadCount}
      unreadMessageCount={unreadMessageCount}
      notifications={notifications.slice(0, 8)}
    />
  );
}
