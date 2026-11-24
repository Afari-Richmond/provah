"use client";

import { useEffect } from "react";

const CREDIT_MARKER = "data-provah-footer-credit";

export function FooterFixes() {
  useEffect(() => {
    function run() {
      // Swap the footer wordmark for the current logo, on both the
      // desktop and mobile Framer variants.
      const logos = document.querySelectorAll<HTMLImageElement>(
        'img[src*="Z5sWa5sGK5nkEP5Yomtqjzd09Q"], img[src*="provah-logo-white"]',
      );
      logos.forEach((img) => {
        img.src = "/images/provah-logo-white.png";
        img.width = 148;
        // The old wordmark's fixed-width ancestor container (90px) crops
        // the new, wider logo via object-fit: cover — widen it to match.
        const sizedAncestor = img.closest<HTMLElement>(
          '[class*="framer-"][style*="width: 90px"], [class*="framer-"][style*="width:90px"]',
        );
        if (sizedAncestor) sizedAncestor.style.width = "148px";
        let el: HTMLElement | null = img.parentElement;
        for (let i = 0; i < 4 && el; i++, el = el.parentElement) {
          const w = getComputedStyle(el).width;
          if (w === "90px") {
            el.style.width = "148px";
            break;
          }
        }
      });

      // Add the agency credit line right under the copyright line, once.
      const nodes = Array.from(document.querySelectorAll("p")).filter(
        (p) => p.textContent?.includes("Built by students"),
      );
      let inserted = 0;
      for (const p of nodes) {
        if (p.parentElement?.querySelector(`[${CREDIT_MARKER}]`)) {
          inserted++;
          continue;
        }
        const credit = document.createElement("p");
        credit.setAttribute(CREDIT_MARKER, "true");
        credit.style.cssText =
          "font-family:'Space Grotesk', sans-serif;font-size:13px;line-height:22px;text-align:center;color:rgba(221,221,221,0.6);margin-top:4px;";
        const link = document.createElement("a");
        link.href = "https://www.designbalcony.com";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Design Balcony";
        link.style.textDecoration = "underline";
        credit.append("Designed & powered by ", link);
        p.insertAdjacentElement("afterend", credit);
        inserted++;
      }

    }

    // Framer's own client-side hydration keeps reconciling and replacing
    // the footer's DOM subtree asynchronously after mount, which undoes a
    // one-shot patch — keep this observer running for the component's
    // whole lifetime instead of disconnecting after the first match.
    const observer = new MutationObserver(run);
    run();
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
