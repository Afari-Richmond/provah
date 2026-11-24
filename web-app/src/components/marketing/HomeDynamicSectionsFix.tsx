"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { PublicProjectCard } from "@/components/marketing/showcase/PublicProjectCard";
import type { Project } from "@/lib/types";

const MARKER = "data-provah-dynamic-sections";

/**
 * Framer's own compiled runtime fails to hydrate the "What students are
 * building" and "Meet a few of our students" sections on this page (a
 * pre-existing responsive-variant hydration crash inside its bundle,
 * confirmed present even in the untouched original export). React's
 * Suspense boundary "recovers" by discarding the server-rendered DOM for
 * that subtree and doing a fresh client-only render — which wipes out
 * anything inserted as a child of it, even moments after insertion.
 *
 * So this never inserts into Framer's tree at all: it appends its own
 * container directly to <body> (a node neither React instance owns) and
 * absolutely-positions it over the gap, while pushing the next real
 * section down by the same height via a self-healing margin-top (applied
 * on every observed mutation, since Framer's retries can reset it).
 */
export function HomeDynamicSectionsFix({ projects }: { projects: Project[] }) {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function findAnchor(): HTMLElement | null {
      const heading = Array.from(document.querySelectorAll("*")).find(
        (el) =>
          el.children.length === 0 &&
          el.textContent?.trim() === "Why professionals choose Provah",
      );
      if (!heading) return null;
      let el: HTMLElement | null = heading as HTMLElement;
      for (let i = 0; i < 6 && el; i++) {
        const parent: HTMLElement | null = el.parentElement;
        if (!parent) break;
        const bg = getComputedStyle(parent).backgroundColor;
        if (bg.startsWith("rgb(2")) return parent;
        el = parent;
      }
      return null;
    }

    function reposition() {
      const container = containerRef.current;
      const anchor = anchorRef.current;
      if (!container || !anchor) return;
      // The anchor's own measured position already includes whatever
      // marginTop we previously applied to it — subtract that back out
      // first, or each tick compounds the margin and the gap drifts
      // further down the page forever.
      const currentMargin = parseFloat(anchor.style.marginTop || "0");
      const rect = anchor.getBoundingClientRect();
      const naturalTop = rect.top + window.scrollY - currentMargin;
      container.style.top = `${naturalTop}px`;
      anchor.style.marginTop = `${container.offsetHeight}px`;
    }

    function run() {
      const anchor = findAnchor();
      if (!anchor) return;
      anchorRef.current = anchor;

      if (!containerRef.current) {
        const existing = document.querySelectorAll<HTMLDivElement>(`[${MARKER}]`);
        existing.forEach((el) => el.remove());

        const container = document.createElement("div");
        container.setAttribute(MARKER, "true");
        container.style.position = "absolute";
        container.style.left = "0";
        container.style.width = "100%";
        container.style.zIndex = "1";
        document.body.appendChild(container);
        containerRef.current = container;
        setHost(container);
      }
      reposition();
    }

    run();
    const observer = new MutationObserver(run);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", reposition);

    const interval = window.setInterval(reposition, 500);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", reposition);
      window.clearInterval(interval);
    };
  }, []);

  if (!host) return null;

  return createPortal(
    <>
      <section style={{ padding: "80px 32px", textAlign: "center", background: "#fff" }}>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "#6C4CE0",
          }}
        >
          Real projects, right now
        </span>
        <h2
          style={{
            marginTop: 12,
            fontFamily: "'Unbounded', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(28px, 4vw, 36px)",
            color: "#161216",
          }}
        >
          What students are building
        </h2>

        {projects.length > 0 ? (
          <div
            style={{
              marginTop: 40,
              maxWidth: 1100,
              marginInline: "auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
              textAlign: "left",
            }}
          >
            {projects.slice(0, 3).map((p) => (
              <PublicProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <div
            style={{
              marginTop: 32,
              maxWidth: 420,
              marginInline: "auto",
              padding: "32px 24px",
              borderRadius: 20,
              border: "2px dashed rgba(22,18,22,0.25)",
            }}
          >
            <p
              style={{
                fontFamily: "'Unbounded', sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: "#161216",
                margin: 0,
              }}
            >
              No projects yet
            </p>
            <p
              style={{
                marginTop: 8,
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 14,
                color: "rgba(22,18,22,0.55)",
              }}
            >
              Be the first student to submit yours.
            </p>
          </div>
        )}

        <Link
          href="/showcase"
          style={{
            display: "inline-flex",
            marginTop: 32,
            alignItems: "center",
            gap: 8,
            padding: "14px 24px",
            borderRadius: 999,
            border: "3px solid #161216",
            background: "#fff",
            color: "#161216",
            boxShadow: "6px 6px 0 #161216",
            textDecoration: "none",
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.03em",
          }}
        >
          Browse all projects &rarr;
        </Link>
      </section>

      <section style={{ background: "#161216", padding: "72px 32px", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "'Unbounded', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(28px, 4vw, 36px)",
            color: "#fff",
            margin: 0,
          }}
        >
          Meet a few of our students
        </h2>
        <p
          style={{
            marginTop: 12,
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 15,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          Real final-year students, now building things people can actually find.
        </p>
        <div
          style={{
            marginTop: 32,
            maxWidth: 420,
            marginInline: "auto",
            padding: "32px 24px",
            borderRadius: 20,
            border: "2px dashed rgba(255,255,255,0.25)",
          }}
        >
          <p
            style={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: "#fff",
              margin: 0,
            }}
          >
            Be one of our first
          </p>
          <p
            style={{
              marginTop: 8,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 14,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Sign up, submit your capstone, and get featured here.
          </p>
          <Link
            href="/signup"
            style={{
              display: "inline-flex",
              marginTop: 20,
              alignItems: "center",
              gap: 8,
              padding: "14px 24px",
              borderRadius: 999,
              border: "3px solid #161216",
              background: "#FFA800",
              color: "#161216",
              boxShadow: "6px 6px 0 #161216",
              textDecoration: "none",
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
            }}
          >
            Sign up free &rarr;
          </Link>
        </div>
      </section>
    </>,
    host,
  );
}
