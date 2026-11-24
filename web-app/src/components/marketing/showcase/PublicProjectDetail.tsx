import Link from "next/link";
import { PublicProjectCard } from "@/components/marketing/showcase/PublicProjectCard";
import { MiniAvatar } from "@/components/marketing/showcase/MiniAvatar";
import type { Project } from "@/lib/types";

const fieldColor: Record<Project["field"], string> = {
  Engineering: "#FF7A30",
  "Health & Medicine": "#6C4CE0",
  "Finance & Technology": "#161216",
};

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        border: "2px solid #161216",
        borderRadius: 20,
        boxShadow: "6px 6px 0 #161216",
        background: "#fff",
        padding: 24,
      }}
    >
      <h2
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "rgba(22,18,22,0.4)",
          margin: 0,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          marginTop: 12,
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 15,
          lineHeight: 1.7,
          color: "rgba(22,18,22,0.75)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function PublicProjectDetail({
  project,
  similarProjects,
}: {
  project: Project;
  similarProjects: Project[];
}) {
  const thesis = project.documents.find(
    (d) => d.label.toLowerCase().includes("thesis") || d.kind === "pdf",
  );

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "48px 32px 100px" }}>
      <Link
        href="/showcase"
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.03em",
          color: "rgba(22,18,22,0.4)",
          textDecoration: "none",
        }}
      >
        ← Back to Showcase
      </Link>

      <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: fieldColor[project.field],
          }}
        />
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            color: "rgba(22,18,22,0.5)",
          }}
        >
          {project.field}
        </span>
      </div>

      <h1
        style={{
          marginTop: 12,
          fontFamily: "'Unbounded', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(28px, 4vw, 40px)",
          lineHeight: 1.2,
          color: "#161216",
        }}
      >
        {project.title}
      </h1>

      {project.tags.length > 0 && (
        <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                borderRadius: 999,
                border: "1.5px solid rgba(22,18,22,0.15)",
                padding: "5px 12px",
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
                color: "rgba(22,18,22,0.5)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <MiniAvatar name={project.studentName} seed={project.studentId} size={40} />
        <div>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: "#161216",
            }}
          >
            {project.studentName}
          </div>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 12,
              color: "rgba(22,18,22,0.5)",
            }}
          >
            {project.university}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 32,
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: 24,
        }}
        className="pv-detail-grid"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <SectionCard title="The problem">{project.problem}</SectionCard>
          <SectionCard title="The solution">
            {project.solution || "No write-up provided yet."}
          </SectionCard>

          {project.team.length > 0 && (
            <SectionCard title="Team">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 0 }}>
                {project.team.map((m) => (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <MiniAvatar name={m.name} seed={m.id} size={32} />
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 14,
                        color: "#161216",
                      }}
                    >
                      {m.name}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              border: "2px solid #161216",
              borderRadius: 20,
              boxShadow: "6px 6px 0 #161216",
              background: "#fff",
              padding: 20,
            }}
          >
            <h2
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "rgba(22,18,22,0.4)",
                margin: 0,
              }}
            >
              Tech stack
            </h2>
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {project.techStack.map((t) => (
                <span
                  key={t}
                  style={{
                    borderRadius: 999,
                    background: "#F4F2FB",
                    padding: "6px 12px",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 13,
                    color: "#161216",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {(project.githubUrl || project.demoUrl || thesis) && (
              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  borderTop: "1px dashed rgba(22,18,22,0.15)",
                  paddingTop: 16,
                }}
              >
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                      color: "#6C4CE0",
                      textDecoration: "none",
                    }}
                  >
                    View on GitHub →
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                      color: "#6C4CE0",
                      textDecoration: "none",
                    }}
                  >
                    View live demo →
                  </a>
                )}
                {thesis && (
                  <a
                    href={thesis.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                      color: "#6C4CE0",
                      textDecoration: "none",
                    }}
                  >
                    {thesis.label || "View thesis"} →
                  </a>
                )}
              </div>
            )}
          </div>

          <Link
            href="/signup"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "15px 20px",
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
            Sign up to connect
          </Link>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0 4px",
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              color: "rgba(22,18,22,0.4)",
            }}
          >
            <span>{project.views} views</span>
            <span>{project.bookmarks} saved</span>
          </div>
        </div>
      </div>

      {similarProjects.length > 0 && (
        <div style={{ marginTop: 56 }}>
          <h2
            style={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: "#161216",
            }}
          >
            Similar projects
          </h2>
          <div
            style={{
              marginTop: 20,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {similarProjects.map((p) => (
              <PublicProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 720px) {
          .pv-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
