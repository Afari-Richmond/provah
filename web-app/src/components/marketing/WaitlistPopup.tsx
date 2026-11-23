"use client";

import { useEffect, useRef, useState } from "react";

const DISMISSED_KEY = "provah:mobile-waitlist-dismissed";

export function WaitlistPopup() {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const shown = useRef(false);

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

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 sm:bottom-6 sm:px-6">
      <div
        className="w-full max-w-md rounded-[20px] border-[3px] border-[#161616] bg-white p-6 shadow-[6px_6px_0_#161616]"
        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Dismiss"
          className="absolute right-4 top-4 -mt-2 -mr-2 text-black/30 hover:text-black"
          style={{ position: "relative", float: "right" }}
        >
          ✕
        </button>
        {submitted ? (
          <p className="text-[15px] leading-6 text-[#161616]">
            You&apos;re on the list. We&apos;ll email you the moment the mobile app
            is ready.
          </p>
        ) : (
          <>
            <p className="font-bold text-[#161616]" style={{ fontSize: 18 }}>
              Provah is going mobile
            </p>
            <p className="mt-2 text-sm leading-6 text-black/60">
              The web app is live right now. Want early access to the mobile
              app when it launches? Leave your email.
            </p>
            <form onSubmit={submit} className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-full border-2 border-[#161616]/15 px-4 py-2.5 text-sm outline-none focus:border-[#6C4CE0]"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full border-[3px] border-[#161616] bg-[#FF7A30] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.03em] text-[#161616]"
              >
                Notify me
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
