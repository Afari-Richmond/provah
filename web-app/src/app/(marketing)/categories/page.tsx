import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/data/projects";
import type { ProjectField } from "@/lib/types";
import { PROJECT_FIELDS, FIELD_COLORS, FIELD_BLURBS } from "@/lib/fields";

export const metadata: Metadata = {
  title: "Browse Projects by Field | Provah",
  description:
    "Every field Provah covers: engineering, health, fintech, and more. Pick a field to see real capstone projects from African final-year students.",
};

const FIELDS: {
  field: ProjectField;
  color: string;
  blurb: string;
}[] = PROJECT_FIELDS.map((field) => ({
  field,
  color: FIELD_COLORS[field],
  blurb: FIELD_BLURBS[field],
}));

export default async function CategoriesPage() {
  const projects = await getPublishedProjects();
  const counts = new Map<ProjectField, number>();
  for (const p of projects) counts.set(p.field, (counts.get(p.field) ?? 0) + 1);

  return (
    <div id="main-content" style={{ background: "#fff", minHeight: "100vh" }}>
      <div style={{ padding: "72px 32px 56px", textAlign: "center" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "#6C4CE0",
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: 2, background: "#6C4CE0" }} />
          Free to browse · Africa-wide
        </span>
        <h1
          style={{
            marginTop: 16,
            fontFamily: "'Unbounded', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(32px, 5vw, 48px)",
            lineHeight: 1.15,
            color: "#161216",
          }}
        >
          Every field we cover,
          <br />
          in one place.
        </h1>
        <p
          style={{
            margin: "16px auto 0",
            maxWidth: 560,
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 16,
            lineHeight: 1.6,
            color: "rgba(22,18,22,0.6)",
          }}
        >
          Browse real capstone projects by field, from engineering and
          health to agritech, energy, and more.
        </p>
        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 16,
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 13,
            color: "rgba(22,18,22,0.5)",
          }}
        >
          <span>● Free to browse</span>
          <span>● Verified projects</span>
          <span>● Always free</span>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 32px 100px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}
      >
        {FIELDS.map(({ field, color, blurb }) => (
          <Link
            key={field}
            href={`/showcase?field=${encodeURIComponent(field)}`}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              padding: 28,
              borderRadius: 20,
              border: "2px solid #161216",
              boxShadow: "6px 6px 0 #161216",
              background: "#fff",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: 4,
                background: color,
              }}
            />
            <h2
              style={{
                fontFamily: "'Unbounded', sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#161216",
                margin: 0,
              }}
            >
              {field}
            </h2>
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 14,
                lineHeight: 1.6,
                color: "rgba(22,18,22,0.6)",
                margin: 0,
                flex: 1,
              }}
            >
              {blurb}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px dashed rgba(22,18,22,0.15)",
                paddingTop: 16,
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              <span style={{ color: "rgba(22,18,22,0.4)" }}>
                {counts.get(field) ?? 0} project{(counts.get(field) ?? 0) === 1 ? "" : "s"}
              </span>
              <span style={{ color: "#6C4CE0" }}>Browse →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
