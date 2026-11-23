"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const BROKEN_CTA_SELECTOR =
  ".framer-24ono9-container, .framer-14hoj26-container";

export function HomeFixes() {
  const router = useRouter();

  useEffect(() => {
    function intercept(e: Event) {
      const target = (e.target as HTMLElement)?.closest(BROKEN_CTA_SELECTOR);
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (e.type === "click") router.push("/signup");
    }

    document.addEventListener("pointerdown", intercept, true);
    document.addEventListener("mousedown", intercept, true);
    document.addEventListener("click", intercept, true);
    return () => {
      document.removeEventListener("pointerdown", intercept, true);
      document.removeEventListener("mousedown", intercept, true);
      document.removeEventListener("click", intercept, true);
    };
  }, [router]);

  return (
    <style>{`
      .framer-24ono9-container,
      .framer-14hoj26-container {
        position: relative;
        cursor: pointer;
      }
      .framer-24ono9-container > a,
      .framer-14hoj26-container > a {
        visibility: hidden !important;
        pointer-events: none !important;
      }
      .framer-24ono9-container::after,
      .framer-14hoj26-container::after {
        content: "Sign Up Free";
        position: absolute;
        inset: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-family: 'Space Mono', monospace;
        font-weight: 700;
        line-height: 1;
        text-transform: uppercase;
        font-size: 14px;
        letter-spacing: 0.03em;
        border-radius: 999px;
        border: 3px solid #161616;
        background: #FFD23F;
        color: #161616;
        box-shadow: 6px 6px 0 #161616;
        pointer-events: none;
      }
      .framer-1l0zlq1 {
        display: none !important;
      }
      .framer-z7tt1d-container a.framer-W36AH {
        background: #FFD23F !important;
        box-shadow: 6px 6px 0 #161616 !important;
      }
      .framer-e9ndc6 img {
        display: none !important;
      }
      .framer-e9ndc6 [data-framer-background-image-wrapper] {
        background-image: url('/images/home-hero.jpg');
        background-size: cover;
        background-position: center;
      }
    `}</style>
  );
}
