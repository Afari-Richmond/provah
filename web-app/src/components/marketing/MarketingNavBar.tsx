"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { LogoutLink } from "@/components/marketing/LogoutLink";
import type { Profile } from "@/lib/types";

const NAV_LINKS = [
  { href: "/showcase", label: "PROJECTS" },
  { href: "/categories", label: "CATEGORIES" },
  { href: "/how-it-works", label: "HOW IT WORKS" },
  { href: "/about", label: "ABOUT" },
];

const NAV_LINK_STYLE: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: 14,
  letterSpacing: 0,
  color: "#161616",
  textDecoration: "none",
  whiteSpace: "nowrap",
};

const CTA_STYLE: React.CSSProperties = {
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontFamily: "'Space Mono', monospace",
  fontWeight: 700,
  lineHeight: 1,
  textTransform: "uppercase",
  fontSize: 14,
  letterSpacing: "0.03em",
  padding: "15px 28px",
  borderRadius: 999,
  border: "3px solid #161616",
  background: "#FFA800",
  color: "#161616",
  boxShadow: "6px 6px 0 #161616",
  textDecoration: "none",
  whiteSpace: "nowrap",
};

/**
 * Marketing pages don't load Tailwind (only the (app) layout does), so the
 * mobile/desktop split here is a plain inline <style> media query toggling
 * two classes, not a `md:` utility — same constraint LogoutLink works
 * around.
 */
export function MarketingNavBar({ profile }: { profile: Profile | null }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <style>{`
        .pv-marketing-links, .pv-marketing-actions { display: flex; }
        .pv-marketing-toggle { display: none; }
        @media (max-width: 760px) {
          .pv-marketing-links, .pv-marketing-actions { display: none; }
          .pv-marketing-toggle { display: flex; }
        }
      `}</style>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "18px 32px",
        }}
      >
        {profile ? (
          <a href="/discover" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/provah-logo.png"
              alt="Provah"
              width={152}
              height={36}
              style={{ height: 36, width: "auto" }}
            />
          </a>
        ) : (
          <Link href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/provah-logo.png"
              alt="Provah"
              width={152}
              height={36}
              style={{ height: 36, width: "auto" }}
            />
          </Link>
        )}

        <nav className="pv-marketing-links" style={{ alignItems: "center", gap: 28 }}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} style={NAV_LINK_STYLE}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="pv-marketing-actions" style={{ alignItems: "center", gap: 20 }}>
          {profile ? (
            <>
              <LogoutLink style={NAV_LINK_STYLE} />
              <a
                href="/profile"
                style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
                aria-label="My profile"
              >
                <Avatar
                  name={profile.name}
                  seed={profile.id}
                  imageUrl={profile.avatarUrl ?? undefined}
                  size={36}
                />
              </a>
              <a href="/dashboard" style={CTA_STYLE}>
                Dashboard
              </a>
            </>
          ) : (
            <>
              <a href="/login" style={NAV_LINK_STYLE}>
                LOG IN
              </a>
              <a href="/signup" style={CTA_STYLE}>
                Sign Up Free
              </a>
            </>
          )}
        </div>

        <button
          type="button"
          className="pv-marketing-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "3px solid #161616",
            background: "#fff",
            flexShrink: 0,
          }}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <div
          style={{
            borderTop: "1px solid #ddd",
            padding: "8px 32px 20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{ ...NAV_LINK_STYLE, padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}
            >
              {link.label}
            </Link>
          ))}

          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {profile ? (
              <>
                <a
                  href="/profile"
                  onClick={() => setOpen(false)}
                  style={{ ...NAV_LINK_STYLE, display: "flex", alignItems: "center", gap: 10 }}
                >
                  <Avatar
                    name={profile.name}
                    seed={profile.id}
                    imageUrl={profile.avatarUrl ?? undefined}
                    size={32}
                  />
                  My profile
                </a>
                <a href="/dashboard" onClick={() => setOpen(false)} style={CTA_STYLE}>
                  Dashboard
                </a>
                <LogoutLink style={{ ...NAV_LINK_STYLE, textAlign: "left" }} />
              </>
            ) : (
              <>
                <a href="/login" onClick={() => setOpen(false)} style={NAV_LINK_STYLE}>
                  LOG IN
                </a>
                <a href="/signup" onClick={() => setOpen(false)} style={CTA_STYLE}>
                  Sign Up Free
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#161616" strokeWidth="2">
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#161616" strokeWidth="2">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
