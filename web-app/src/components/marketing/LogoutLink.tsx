"use client";

import { useState, useTransition } from "react";
import { logOut } from "@/lib/actions/auth";

/**
 * Marketing pages don't load Tailwind/globals.css (only the (app) layout
 * does), so this can't reuse components/ui/LogoutButton or its Card/Button —
 * every style here has to be inline, matching how the rest of this nav and
 * WaitlistPopup are built.
 */
export function LogoutLink({ style }: { style?: React.CSSProperties }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function confirmLogout() {
    startTransition(async () => {
      await logOut();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ ...style, background: "none", border: "none" }}
      >
        LOG OUT
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 997,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            background: "rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 380,
              borderRadius: 20,
              border: "3px solid #161616",
              background: "#fff",
              padding: 24,
              boxShadow: "6px 6px 0 #161616",
            }}
          >
            <p
              style={{
                fontFamily: "'Unbounded', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: "#161616",
                margin: 0,
              }}
            >
              Log out?
            </p>
            <p
              style={{
                marginTop: 8,
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 14,
                lineHeight: "22px",
                color: "rgba(22,22,22,0.6)",
              }}
            >
              You&apos;ll need to sign in again to get back to your dashboard, messages, and
              projects.
            </p>
            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                style={{
                  borderRadius: 999,
                  border: "3px solid #161616",
                  background: "#fff",
                  padding: "10px 20px",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                  color: "#161616",
                  cursor: isPending ? "default" : "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                disabled={isPending}
                style={{
                  borderRadius: 999,
                  border: "3px solid #161616",
                  background: "#D64545",
                  padding: "10px 20px",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                  color: "#fff",
                  cursor: isPending ? "default" : "pointer",
                  opacity: isPending ? 0.7 : 1,
                }}
              >
                {isPending ? "Logging out..." : "Log out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
