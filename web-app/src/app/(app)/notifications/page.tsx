import { AppNavBar } from "@/components/layout/AppNavBar";
import { Eyebrow } from "@/components/ui/Badge";
import { NotificationRow } from "@/components/NotificationRow";
import { requireProfile } from "@/lib/auth";
import { getNotifications } from "@/lib/data/notifications";
import { markAllNotificationsRead } from "@/lib/actions/notifications";

export default async function NotificationsPage() {
  const profile = await requireProfile();
  const notifications = await getNotifications(profile.id);
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="min-h-screen bg-white">
      <AppNavBar />

      <main className="mx-auto max-w-2xl px-6 py-10 sm:px-10">
        <div className="flex items-center justify-between">
          <div>
            <Eyebrow>Notifications</Eyebrow>
            <h1 className="mt-3 font-(family-name:--font-unbounded) text-[32px] font-bold leading-tight text-[var(--color-ink)]">
              What&apos;s new
            </h1>
          </div>
          {hasUnread && (
            <form action={markAllNotificationsRead}>
              <button
                type="submit"
                className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-primary)]"
              >
                Mark all read
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {notifications.length === 0 ? (
            <p className="font-(family-name:--font-space-grotesk) text-sm text-black/50">
              Nothing here yet.
            </p>
          ) : (
            notifications.map((n) => <NotificationRow key={n.id} notification={n} />)
          )}
        </div>
      </main>
    </div>
  );
}
