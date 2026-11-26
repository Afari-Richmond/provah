import { AppNavBar } from "@/components/layout/AppNavBar";
import { ShowcaseClient } from "@/components/marketing/showcase/ShowcaseClient";
import { getPublishedProjects, PUBLISHED_PROJECTS_PAGE_SIZE } from "@/lib/data/projects";
import { PROJECT_FIELDS } from "@/lib/fields";
import type { ProjectField } from "@/lib/types";

const VALID_FIELDS: ProjectField[] = PROJECT_FIELDS;

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ field?: string }>;
}) {
  const { field } = await searchParams;
  const initialField = VALID_FIELDS.includes(field as ProjectField) ? (field as ProjectField) : null;
  const published = await getPublishedProjects({ limit: PUBLISHED_PROJECTS_PAGE_SIZE });

  return (
    <div className="min-h-screen bg-white">
      <AppNavBar active="/discover" />

      <div style={{ background: "#161216", padding: "56px 32px 40px" }}>
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
            Discover
          </span>
          <h1
            style={{
              marginTop: 12,
              fontFamily: "'Unbounded', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 40px)",
              lineHeight: 1.15,
              color: "#fff",
              maxWidth: 640,
            }}
          >
            Every project, searchable and open.
          </h1>
          <p
            style={{
              marginTop: 12,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 15,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.7)",
              maxWidth: 560,
            }}
          >
            Filter by field, tech, or university, then click through for the
            full story, team, and links.
          </p>
        </div>
      </div>

      <ShowcaseClient
        projects={published}
        initialField={initialField}
        basePath="/projects"
        hasMore={published.length === PUBLISHED_PROJECTS_PAGE_SIZE}
      />
    </div>
  );
}
