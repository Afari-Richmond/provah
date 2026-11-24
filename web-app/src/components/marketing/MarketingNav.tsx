import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { Avatar } from "@/components/ui/Avatar";
import { LogoutLink } from "@/components/marketing/LogoutLink";

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

export async function MarketingNav() {
  const profile = await getCurrentProfile();

  return (
    <div
      style={{
        position: "relative",
        zIndex: 20,
        width: "100%",
        background: "#fff",
        borderBottom: "1px solid #ddd",
      }}
    >
      <div style={{ display: "flex", width: "100%", height: 5 }}>
        <div style={{ flex: 1, background: "#6C4CE0" }} />
        <div style={{ flex: 1, background: "#FF7A30" }} />
        <div style={{ flex: 1, background: "#161221" }} />
        <div style={{ flex: 1, background: "#9B80EC" }} />
        <div style={{ flex: 1, background: "#FFB380" }} />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          rowGap: 14,
          gap: 24,
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
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            flexWrap: "wrap",
            rowGap: 10,
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} style={NAV_LINK_STYLE}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
            rowGap: 10,
          }}
        >
          {profile ? (
            <>
              <LogoutLink style={NAV_LINK_STYLE} />
              <a
                href="/profile"
                style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
                aria-label="My profile"
              >
                <Avatar name={profile.name} seed={profile.id} imageUrl={profile.avatarUrl ?? undefined} size={36} />
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
      </div>
    </div>
  );
}
