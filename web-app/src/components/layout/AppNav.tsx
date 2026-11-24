"use client";

import { useState } from "react";
import Link from "next/link";
import { TopDecor } from "./TopDecor";
import { Logo } from "./Logo";
import { Avatar } from "@/components/ui/Avatar";
import { logOut } from "@/lib/actions/auth";
import type { Profile } from "@/lib/types";

const studentLinks = [
  { href: "/feed", label: "Feed" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/discover", label: "Discover" },
  { href: "/saved", label: "Saved" },
  { href: "/messages", label: "Messages" },
];

const professionalLinks = [
  { href: "/feed", label: "Feed" },
  { href: "/discover", label: "Discover" },
  { href: "/saved", label: "Saved" },
  { href: "/messages", label: "Messages" },
];

export function AppNav({
  active,
  profile,
  unreadCount,
}: {
  active?: string;
  profile: Profile;
  unreadCount: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isStudent = profile.role === "student";
  const links = isStudent ? studentLinks : professionalLinks;

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
          <form action="/search" method="GET" className="hidden md:block">
            <input
              type="search"
              name="q"
              placeholder="Search people..."
              className="w-40 rounded-full border-2 border-[var(--color-ink)]/15 bg-white px-4 py-2 font-(family-name:--font-space-grotesk) text-sm text-[var(--color-ink)] outline-none placeholder:text-black/30 focus:w-56 focus:border-[var(--color-primary)]"
            />
          </form>
          <Link
            href="/search"
            className="pv-border flex h-10 w-10 items-center justify-center rounded-full bg-white md:hidden"
            aria-label="Search"
          >
            <SearchIcon />
          </Link>
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
          <Link href="/profile" aria-label="Profile">
            <Avatar name={profile.name} seed={profile.id} size={40} />
          </Link>
          <form action={logOut} className="hidden md:block">
            <button
              type="submit"
              className="pv-border flex h-10 w-10 items-center justify-center rounded-full bg-white text-black/50 hover:text-[var(--color-danger)]"
              aria-label="Log out"
              title="Log out"
            >
              <LogoutIcon />
            </button>
          </form>
          {isStudent && (
            <Link
              href="/projects/new"
              className="pv-border pv-shadow-sm hidden items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-2.5 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-ink)] lg:inline-flex"
            >
              + New project
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="pv-border flex h-10 w-10 items-center justify-center rounded-full bg-white md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-b border-[var(--color-border)] bg-white px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-3 py-3 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] ${
                  active === l.href
                    ? "bg-[var(--color-surface)] text-[var(--color-ink)]"
                    : "text-black/50"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {isStudent && (
              <Link
                href="/projects/new"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-full bg-[var(--color-accent)] px-4 py-3 text-center font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-ink)]"
              >
                + New project
              </Link>
            )}
            <Link
              href="/settings"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-3 py-3 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/50"
            >
              Settings
            </Link>
            <form action={logOut}>
              <button
                type="submit"
                className="w-full rounded-xl px-3 py-3 text-left font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-[var(--color-danger)]"
              >
                Log out
              </button>
            </form>
          </nav>
        </div>
      )}
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
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

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
