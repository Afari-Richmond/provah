"use client";

import { useEffect } from "react";

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
  cursor: "pointer",
}

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
          color: "#C23B3B",
        }}
      >
        Something went wrong
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
        That didn&apos;t load right.
      </h1>
      <p style={BODY}>Something broke on our end. Try again in a moment.</p>
      <button type="button" style={{ ...CTA_STYLE, marginTop: 8 }} onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
