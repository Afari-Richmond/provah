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
  "framer-csenny-container": "/showcase?field=Engineering%20%26%20Technology",
  "framer-gblpw7-container": "/showcase?field=Health%20%26%20Medicine",
  "framer-1pd932a-container": "/showcase?field=Finance%20%26%20Accounting",
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
      /* "Why we built Provah" cards: each used a leftover stock photo of a
         person (from the tutoring template this site was cloned from) as
         its "image" — swap each for a plain brand-color tile with a
         centered icon instead. */
      .framer-13os3z3-container img,
      .framer-1lgttf6-container img,
      .framer-kxp0nb-container img {
        display: none !important;
      }
      .framer-13os3z3-container [data-framer-background-image-wrapper],
      .framer-1lgttf6-container [data-framer-background-image-wrapper],
      .framer-kxp0nb-container [data-framer-background-image-wrapper] {
        background-size: 56px !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
      }
      .framer-13os3z3-container,
      .framer-13os3z3-container [data-framer-background-image-wrapper] {
        background-color: #6C4CE0 !important;
        background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22/%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%226%22/%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%222%22/%3E%3C/svg%3E") !important;
      }
      .framer-1lgttf6-container,
      .framer-1lgttf6-container [data-framer-background-image-wrapper] {
        background-color: #FF7A30 !important;
        background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20width%3D%2220%22%20height%3D%225%22%20x%3D%222%22%20y%3D%223%22%20rx%3D%221%22/%3E%3Cpath%20d%3D%22M4%208v11a2%202%200%200%200%202%202h12a2%202%200%200%200%202-2V8%22/%3E%3Cpath%20d%3D%22M10%2012h4%22/%3E%3C/svg%3E") !important;
      }
      .framer-kxp0nb-container,
      .framer-kxp0nb-container [data-framer-background-image-wrapper] {
        background-color: #161221 !important;
        background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22/%3E%3Cpath%20d%3D%22m16.24%207.76-1.804%205.411a2%202%200%200%201-1.265%201.265L7.76%2016.24l1.804-5.411a2%202%200%200%201%201.265-1.265z%22/%3E%3C/svg%3E") !important;
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
