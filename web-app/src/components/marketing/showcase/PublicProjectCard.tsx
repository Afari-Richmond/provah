import Link from "next/link";
import type { Project } from "@/lib/types";
import { FIELD_COLORS as fieldColor } from "@/lib/fields";

export function PublicProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/showcase/${project.id}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        border: "2px solid #161216",
        borderRadius: 20,
        background: "#fff",
        boxShadow: "6px 6px 0 #161216",
        padding: 18,
        textDecoration: "none",
        transition: "transform 0.15s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          aspectRatio: "16 / 9",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius: 12,
          border: "1.5px solid rgba(22,18,22,0.12)",
          background: "#fff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.imageUrl || "/images/provah-logo.png"}
          alt={project.title}
          style={
            project.imageUrl
              ? { width: "100%", height: "100%", objectFit: "cover" }
              : { height: 32, width: "auto", opacity: 0.8 }
          }
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: fieldColor[project.field],
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            color: "rgba(22,18,22,0.5)",
          }}
        >
          {project.field}
        </span>
      </div>

      <h3
        style={{
          fontFamily: "'Unbounded', sans-serif",
          fontSize: 17,
          fontWeight: 700,
          lineHeight: 1.3,
          color: "#161216",
          margin: 0,
        }}
      >
        {project.title}
      </h3>

      <p
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 14,
          lineHeight: 1.6,
          color: "rgba(22,18,22,0.6)",
          margin: 0,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          flex: 1,
        }}
      >
        {project.problem}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {project.techStack.slice(0, 3).map((t) => (
          <span
            key={t}
            style={{
              borderRadius: 999,
              background: "#F4F2FB",
              padding: "4px 10px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 12,
              color: "rgba(22,18,22,0.6)",
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px dashed rgba(22,18,22,0.15)",
          paddingTop: 12,
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 12,
          color: "rgba(22,18,22,0.5)",
        }}
      >
        <span>{project.studentName}</span>
        <span>{project.university}</span>
      </div>
    </Link>
  );
}
