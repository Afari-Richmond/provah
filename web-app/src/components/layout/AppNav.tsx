import Link from "next/link";
import { TopDecor } from "./TopDecor";
import { Logo } from "./Logo";
import { mockNotifications } from "@/lib/mockData";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/discover", label: "Discover" },
  { href: "/saved", label: "Saved" },
  { href: "/messages", label: "Messages" },
];

export function AppNav({ active }: { active?: string }) {
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 bg-white">
      <TopDecor />
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4 sm:px-10">
        <div className="flex items-center gap-10">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] transition-colors ${
                  active === l.href
                    ? "text-[var(--color-ink)]"
                    : "text-black/40 hover:text-[var(--color-ink)]"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/notifications"
            className="pv-border relative flex h-10 w-10 items-center justify-center rounded-full bg-white"
            aria-label="Notifications"
          >
            <BellIcon />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent)] font-(family-name:--font-space-mono) text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Link>
          <Link
            href="/profile"
            className="pv-border flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-muted)] font-(family-name:--font-space-mono) text-xs font-bold text-[var(--color-primary)]"
            aria-label="Profile"
          >
            AO
          </Link>
          <Link
            href="/projects/new"
            className="pv-border pv-shadow-sm hidden items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-2.5 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-ink)] sm:inline-flex"
          >
            + New project
          </Link>
        </div>
      </div>
    </header>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
