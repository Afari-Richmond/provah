import { AppNav } from "@/components/layout/AppNav";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Badge";
import { mockNotifications } from "@/lib/mockData";
import { timeAgo } from "@/lib/format";
import { NotificationType } from "@/lib/types";

const iconMap: Record<NotificationType, string> = {
  project_approved: "✅",
  project_rejected: "⚠️",
  new_message: "💬",
  new_interest: "⭐",
};

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-white">
      <AppNav />

      <main className="mx-auto max-w-2xl px-6 py-10 sm:px-10">
        <Eyebrow>Notifications</Eyebrow>
        <h1 className="mt-3 font-(family-name:--font-unbounded) text-[32px] font-bold leading-tight text-[var(--color-ink)]">
          What&apos;s new
        </h1>

        <div className="mt-8 flex flex-col gap-3">
          {mockNotifications.map((n) => (
            <Card
              key={n.id}
              className={`flex items-start gap-4 p-5 ${n.read ? "" : "bg-[var(--color-surface)]"}`}
              shadow="dark"
            >
              <span className="text-xl">{iconMap[n.type]}</span>
              <div className="flex-1">
                <p className="font-(family-name:--font-space-grotesk) text-sm font-semibold text-[var(--color-ink)]">
                  {n.title}
                </p>
                <p className="mt-0.5 font-(family-name:--font-space-grotesk) text-sm text-black/50">
                  {n.description}
                </p>
              </div>
              <span className="shrink-0 font-(family-name:--font-space-mono) text-[10px] text-black/40">
                {timeAgo(n.createdAt)}
              </span>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
