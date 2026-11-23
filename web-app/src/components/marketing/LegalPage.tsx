import { ReactNode } from "react";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "64px 24px 96px",
          fontFamily: "'Space Grotesk', sans-serif",
          color: "#161616",
        }}
      >
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(22,22,22,0.5)",
            margin: 0,
          }}
        >
          Last updated {updated}
        </p>
        <h1
          style={{
            fontFamily: "'Unbounded', sans-serif",
            fontWeight: 700,
            fontSize: 36,
            letterSpacing: "-0.4px",
            margin: "12px 0 32px",
          }}
        >
          {title}
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            fontSize: 15,
            lineHeight: "26px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2
        style={{
          fontFamily: "'Unbounded', sans-serif",
          fontWeight: 600,
          fontSize: 19,
          letterSpacing: "-0.2px",
          margin: "0 0 10px",
        }}
      >
        {heading}
      </h2>
      <div style={{ color: "rgba(22,22,22,0.75)" }}>{children}</div>
    </section>
  );
}
