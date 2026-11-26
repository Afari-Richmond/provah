import Link from "next/link";

const BODY: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 15,
  lineHeight: 1.6,
  color: "rgba(22,22,22,0.65)",
};

const CTA_STYLE: React.CSSProperties = {
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
};

export default function MarketingNotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 16,
        maxWidth: 480,
        margin: "0 auto",
        padding: "96px 24px",
      }}
    >
      <p
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "#FFA800",
        }}
      >
        404
      </p>
      <h1
        style={{
          fontFamily: "'Unbounded', sans-serif",
          fontSize: 32,
          fontWeight: 700,
          color: "#161616",
          margin: 0,
        }}
      >
        This page wandered off.
      </h1>
      <p style={BODY}>
        Whatever you were looking for isn&apos;t here anymore, or never was.
      </p>
      <Link href="/" style={{ ...CTA_STYLE, marginTop: 8 }}>
        Back to Provah
      </Link>
    </div>
  );
}
