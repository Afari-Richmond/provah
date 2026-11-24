"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const BROKEN_CTA_SELECTOR =
  ".framer-24ono9-container, .framer-14hoj26-container";

// Buttons that already render correctly but whose Framer "page link" target
// needs to be swapped for a real route — no visual replacement needed, just
// redirect the click.
const REDIRECT_ONLY_SELECTOR = ".framer-akfuzt-container";

// "Pick a field" cards: all three compile to the same internal Framer page
// link, so every card currently lands on the same unfiltered page. Route
// each one to the real showcase, pre-filtered to its own field.
const FIELD_CARD_TARGETS: Record<string, string> = {
  "framer-csenny-container": "/showcase?field=Engineering",
  "framer-gblpw7-container": "/showcase?field=Health%20%26%20Medicine",
  "framer-1pd932a-container": "/showcase?field=Finance%20%26%20Technology",
};

export function HomeFixes() {
  const router = useRouter();

  useEffect(() => {
    function intercept(e: Event) {
      const redirectOnlyTarget = (e.target as HTMLElement)?.closest(
        REDIRECT_ONLY_SELECTOR,
      );
      if (redirectOnlyTarget) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (e.type === "click") router.push("/signup");
        return;
      }

      const fieldCardEl = (e.target as HTMLElement)?.closest(
        Object.keys(FIELD_CARD_TARGETS)
          .map((c) => `.${c}`)
          .join(", "),
      );
      if (fieldCardEl) {
        const matchedClass = Object.keys(FIELD_CARD_TARGETS).find((c) =>
          fieldCardEl.classList.contains(c),
        );
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (e.type === "click" && matchedClass) {
          router.push(FIELD_CARD_TARGETS[matchedClass]);
        }
        return;
      }

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
        background: #FFA800;
        color: #161616;
        box-shadow: 6px 6px 0 #161616;
        pointer-events: none;
      }
      .framer-csenny-container,
      .framer-gblpw7-container,
      .framer-1pd932a-container {
        cursor: pointer;
      }
      .framer-e9ndc6 img {
        display: none !important;
      }
      /* "What students are building" and "Meet a few of our students":
         Framer's own hydration for these two sections crashes on first
         paint, then recovers moments later showing stale placeholder
         content (stock photos, fake project cards) from the tutoring
         template this site was cloned from. HomeDynamicSectionsFix
         renders the real replacement — hide the native one whenever it
         eventually mounts, by its stable data-framer-name. */
      [data-framer-name="Showcase"],
      [data-framer-name="Our Teachers"] {
        display: none !important;
      }
      .framer-e9ndc6 [data-framer-background-image-wrapper] {
        background-image: url('/images/home-hero.jpg');
        background-size: cover;
        background-position: center;
      }
      /* Mentors & Investors pricing card: checkmarks are purple-on-purple
         (same token as the card background), so they're invisible. Force
         them white to match the rest of that card's text. */
      .framer-10xgs2x-container .framer-f9wb8t p,
      .framer-10xgs2x-container .framer-1ra83wk p,
      .framer-10xgs2x-container .framer-8a6x1k p,
      .framer-10xgs2x-container .framer-eshmxw p {
        color: #ffffff !important;
      }
    `}</style>
  );
}
