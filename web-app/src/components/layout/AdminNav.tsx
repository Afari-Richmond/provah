import Link from "next/link";
import { TopDecor } from "./TopDecor";
import { Logo } from "./Logo";

const links = [
  { href: "/admin/review-queue", label: "Review queue" },
  { href: "/admin/professionals", label: "Professionals" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/analytics", label: "Analytics" },
];

export function AdminNav({ active }: { active?: string }) {
  return (
    <header className="sticky top-0 z-20 bg-white">
      <TopDecor />
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4 sm:px-10">
        <div className="flex items-center gap-10">
          <Logo href="/admin/review-queue" />
          <span className="pv-border rounded-full bg-[var(--color-ink)] px-3 py-1 font-(family-name:--font-space-mono) text-[10px] font-bold uppercase tracking-[0.05em] text-white">
            Admin
          </span>
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
        <Link
          href="/dashboard"
          className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40 hover:text-[var(--color-ink)]"
        >
          Exit admin
        </Link>
      </div>
    </header>
  );
}
