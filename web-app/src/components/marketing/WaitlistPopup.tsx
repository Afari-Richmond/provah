"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { joinMobileWaitlist, type WaitlistState } from "@/lib/actions/waitlist";

const DISMISSED_KEY = "provah:mobile-waitlist-dismissed";

const initialState: WaitlistState = { status: "idle" };

export function WaitlistPopup() {
  const [visible, setVisible] = useState(false);
  const shown = useRef(false);
  const [state, formAction, pending] = useActionState(joinMobileWaitlist, initialState);

  useEffect(() => {
    if (window.sessionStorage.getItem(DISMISSED_KEY)) {
      shown.current = true;
    }

    function onScroll() {
      if (shown.current) return;
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 200;
      if (scrolledToBottom) {
        shown.current = true;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVisible(true);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function close() {
    setVisible(false);
    window.sessionStorage.setItem(DISMISSED_KEY, "1");
  }

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        insetInline: 0,
        bottom: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          borderRadius: 20,
          border: "3px solid #161616",
          background: "#fff",
          padding: 24,
          boxShadow: "6px 6px 0 #161616",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Dismiss"
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            color: "rgba(22,22,22,0.4)",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          ✕
        </button>
        {state.status === "success" ? (
          <p style={{ fontSize: 15, lineHeight: "24px", color: "#161616", paddingRight: 24 }}>
            You&apos;re on the list. We&apos;ll email you the moment the mobile app
            is ready.
          </p>
        ) : (
          <>
            <p
              style={{
                fontFamily: "'Unbounded', sans-serif",
                fontWeight: 700,
                fontSize: 17,
                color: "#161616",
                paddingRight: 24,
                margin: 0,
              }}
            >
              Provah is going mobile
            </p>
            <p
              style={{
                marginTop: 8,
                fontSize: 14,
                lineHeight: "22px",
                color: "rgba(22,22,22,0.6)",
              }}
            >
              The web app is live right now. Want early access to the mobile
              app when it launches? Leave your email.
            </p>
            <form
              action={formAction}
              style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}
            >
              <input
                type="email"
                name="email"
                required
                placeholder="you@email.com"
                style={{
                  flex: 1,
                  minWidth: 160,
                  borderRadius: 999,
                  border: "2px solid rgba(22,22,22,0.15)",
                  padding: "10px 16px",
                  fontSize: 14,
                  fontFamily: "'Space Grotesk', sans-serif",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={pending}
                style={{
                  flexShrink: 0,
                  borderRadius: 999,
                  border: "3px solid #161616",
                  background: "#FF7A30",
                  padding: "10px 20px",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                  color: "#161616",
                  cursor: pending ? "default" : "pointer",
                  opacity: pending ? 0.6 : 1,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {pending && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      border: "2px solid rgba(22,22,22,0.25)",
                      borderTopColor: "#161616",
                      animation: "pv-spin 0.7s linear infinite",
                    }}
                  />
                )}
                {pending ? "Sending..." : "Notify me"}
              </button>
              <style>{`@keyframes pv-spin { to { transform: rotate(360deg); } }`}</style>
            </form>
            {state.status === "error" && (
              <p style={{ marginTop: 8, fontSize: 13, color: "#D64545" }}>{state.message}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
