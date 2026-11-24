"use client";

import { useMemo, useState } from "react";
import { PublicProjectCard } from "@/components/marketing/showcase/PublicProjectCard";
import type { Project, ProjectField } from "@/lib/types";

const FIELDS: ProjectField[] = ["Engineering", "Health & Medicine", "Finance & Technology"];

const fieldColor: Record<ProjectField, string> = {
  Engineering: "#FF7A30",
  "Health & Medicine": "#6C4CE0",
  "Finance & Technology": "#161216",
};

function FilterButton({
  active,
  onClick,
  children,
  dot,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  dot?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        textAlign: "left",
        padding: "10px 14px",
        borderRadius: 12,
        border: "none",
        background: active ? "#161216" : "transparent",
        color: active ? "#fff" : "#161216",
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 14,
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
      }}
    >
      {dot && (
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: dot,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </button>
  );
}

export function ShowcaseClient({
  projects,
  initialField,
}: {
  projects: Project[];
  initialField: ProjectField | null;
}) {
  const [query, setQuery] = useState("");
  const [activeField, setActiveField] = useState<ProjectField | null>(initialField);

  const counts = useMemo(() => {
    const m = new Map<ProjectField, number>();
    for (const f of FIELDS) m.set(f, 0);
    for (const p of projects) m.set(p.field, (m.get(p.field) ?? 0) + 1);
    return m;
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesField = !activeField || p.field === activeField;
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.university.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesField && matchesQuery;
    });
  }, [projects, query, activeField]);

  return (
    <main
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "56px 32px 100px",
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        gap: 40,
        alignItems: "start",
      }}
      className="pv-showcase-grid"
    >
      <aside
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          position: "sticky",
          top: 24,
        }}
      >
        <div>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "rgba(22,18,22,0.4)",
            }}
          >
            Search
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Title, tech, tag..."
            style={{
              marginTop: 8,
              width: "100%",
              borderRadius: 999,
              border: "2px solid rgba(22,18,22,0.15)",
              padding: "10px 16px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "rgba(22,18,22,0.4)",
            }}
          >
            Field
          </span>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            <FilterButton active={activeField === null} onClick={() => setActiveField(null)}>
              All fields ({projects.length})
            </FilterButton>
            {FIELDS.map((f) => (
              <FilterButton
                key={f}
                active={activeField === f}
                onClick={() => setActiveField(f)}
                dot={fieldColor[f]}
              >
                {f} ({counts.get(f) ?? 0})
              </FilterButton>
            ))}
          </div>
        </div>
      </aside>

      <section>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "rgba(22,18,22,0.4)",
            margin: "0 0 16px",
          }}
        >
          {filtered.length} project{filtered.length === 1 ? "" : "s"}
        </p>

        {filtered.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {filtered.map((p) => (
              <PublicProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <div style={{ padding: "80px 0", textAlign: "center" }}>
            <p
              style={{
                fontFamily: "'Unbounded', sans-serif",
                fontSize: 18,
                fontWeight: 700,
                color: "#161216",
              }}
            >
              No projects match yet
            </p>
            <p
              style={{
                marginTop: 8,
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 14,
                color: "rgba(22,18,22,0.5)",
              }}
            >
              Try a different search term or clear the field filter.
            </p>
          </div>
        )}
      </section>

      <style>{`
        @media (max-width: 760px) {
          .pv-showcase-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
