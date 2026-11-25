"use client";

import { useMemo, useState } from "react";
import { PublicProjectCard } from "@/components/marketing/showcase/PublicProjectCard";
import type { Project, ProjectField } from "@/lib/types";
import { PROJECT_FIELDS, FIELD_COLORS } from "@/lib/fields";

const FIELDS: ProjectField[] = PROJECT_FIELDS;
const fieldColor = FIELD_COLORS;

type SortOrder = "newest" | "oldest" | "most_viewed";

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
  basePath = "/showcase",
}: {
  projects: Project[];
  initialField: ProjectField | null;
  basePath?: string;
}) {
  const [query, setQuery] = useState("");
  const [activeField, setActiveField] = useState<ProjectField | null>(initialField);
  const [activeUniversity, setActiveUniversity] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOrder>("newest");

  const counts = useMemo(() => {
    const m = new Map<ProjectField, number>();
    for (const f of FIELDS) m.set(f, 0);
    for (const p of projects) m.set(p.field, (m.get(p.field) ?? 0) + 1);
    return m;
  }, [projects]);

  const universities = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) if (p.university) set.add(p.university);
    return [...set].sort();
  }, [projects]);

  const tools = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of projects) for (const t of p.techStack) m.set(t, (m.get(t) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = projects.filter((p) => {
      const matchesField = !activeField || p.field === activeField;
      const matchesUniversity = !activeUniversity || p.university === activeUniversity;
      const matchesTool = !activeTool || p.techStack.includes(activeTool);
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.university.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesField && matchesUniversity && matchesTool && matchesQuery;
    });

    return [...matches].sort((a, b) => {
      if (sort === "most_viewed") return b.views - a.views;
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sort === "oldest" ? aTime - bTime : bTime - aTime;
    });
  }, [projects, query, activeField, activeUniversity, activeTool, sort]);

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
        className="pv-showcase-aside"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          position: "sticky",
          top: 24,
          maxHeight: "calc(100vh - 48px)",
          overflowY: "auto",
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

          <div
            className="pv-field-buttons"
            style={{ marginTop: 8, flexDirection: "column", gap: 4 }}
          >
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

          <select
            className="pv-field-select"
            value={activeField ?? ""}
            onChange={(e) => setActiveField((e.target.value || null) as ProjectField | null)}
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
              background: "#fff",
            }}
          >
            <option value="">All fields ({projects.length})</option>
            {FIELDS.map((f) => (
              <option key={f} value={f}>
                {f} ({counts.get(f) ?? 0})
              </option>
            ))}
          </select>
        </div>

        {universities.length > 0 && (
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
              University
            </span>
            <select
              value={activeUniversity ?? ""}
              onChange={(e) => setActiveUniversity(e.target.value || null)}
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
                background: "#fff",
              }}
            >
              <option value="">All universities</option>
              {universities.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        )}

        {tools.length > 0 && (
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
              Tools
            </span>
            <select
              value={activeTool ?? ""}
              onChange={(e) => setActiveTool(e.target.value || null)}
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
                background: "#fff",
              }}
            >
              <option value="">All tools</option>
              {tools.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}
      </aside>

      <section>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "rgba(22,18,22,0.4)",
              margin: 0,
            }}
          >
            {filtered.length} project{filtered.length === 1 ? "" : "s"}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOrder)}
            style={{
              borderRadius: 999,
              border: "2px solid rgba(22,18,22,0.15)",
              padding: "8px 14px",
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              outline: "none",
              background: "#fff",
            }}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="most_viewed">Most viewed</option>
          </select>
        </div>

        {filtered.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {filtered.map((p) => (
              <PublicProjectCard key={p.id} project={p} basePath={basePath} />
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
        .pv-field-buttons { display: flex; }
        .pv-field-select { display: none; }
        @media (max-width: 760px) {
          .pv-showcase-grid {
            grid-template-columns: 1fr !important;
          }
          .pv-showcase-aside {
            position: static !important;
            top: auto !important;
            max-height: none !important;
            overflow-y: visible !important;
          }
          .pv-field-buttons { display: none; }
          .pv-field-select { display: block; }
        }
      `}</style>
    </main>
  );
}
