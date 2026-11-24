import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ShowcaseClient } from "@/components/marketing/showcase/ShowcaseClient";
import { getPublishedProjects } from "@/lib/data/projects";
import { getCurrentProfile } from "@/lib/auth";
import type { ProjectField } from "@/lib/types";
import { PROJECT_FIELDS } from "@/lib/fields";

export const metadata: Metadata = {
  title: "Browse Projects | Provah",
  description:
    "Browse real capstone projects from African final-year students, filter by field, and connect with the builders behind them.",
};

const VALID_FIELDS: ProjectField[] = PROJECT_FIELDS;

export default async function ShowcasePage({
  searchParams,
}: {
  searchParams: Promise<{ field?: string }>;
}) {
  const { field } = await searchParams;
  const viewer = await getCurrentProfile();
  if (viewer) redirect(field ? `/discover?field=${encodeURIComponent(field)}` : "/discover");

  const initialField = VALID_FIELDS.includes(field as ProjectField) ? (field as ProjectField) : null;
  const projects = await getPublishedProjects();

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <div style={{ background: "#161216", padding: "72px 32px 56px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#9B80EC",
            }}
          >
            Free to browse · Africa-wide
          </span>
          <h1
            style={{
              marginTop: 12,
              fontFamily: "'Unbounded', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(32px, 5vw, 48px)",
              lineHeight: 1.15,
              color: "#fff",
              maxWidth: 640,
            }}
          >
            Every project, searchable and open.
          </h1>
          <p
            style={{
              marginTop: 16,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 16,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.7)",
              maxWidth: 560,
            }}
          >
            Real capstone builds from African final-year students. Filter by
            field, search by tech, and click through for the full story,
            team, and links.
          </p>
        </div>
      </div>

      <ShowcaseClient projects={projects} initialField={initialField} />
    </div>
  );
}
