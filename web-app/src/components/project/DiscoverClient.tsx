"use client";

import { useMemo, useState } from "react";
import { Eyebrow, Chip } from "@/components/ui/Badge";
import { DiscoverProjectCard } from "@/components/project/DiscoverProjectCard";
import type { Project, ProjectField } from "@/lib/types";
import { PROJECT_FIELDS } from "@/lib/fields";

const fields: ProjectField[] = PROJECT_FIELDS;

export function DiscoverClient({ published }: { published: Project[] }) {
  const [query, setQuery] = useState("");
  const [activeField, setActiveField] = useState<ProjectField | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const popularTags = useMemo(() => {
    const counts = new Map<string, number>();
    published.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);
  }, [published]);

  const filtered = useMemo(() => {
    return published.filter((p) => {
      const matchesField = !activeField || p.field === activeField;
      const matchesTag = !activeTag || p.tags.includes(activeTag);
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.university.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesField && matchesTag && matchesQuery;
    });
  }, [published, query, activeField, activeTag]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
      <Eyebrow>Discover</Eyebrow>
      <h1 className="mt-3 font-(family-name:--font-unbounded) text-[32px] font-bold leading-tight text-[var(--color-ink)] sm:text-[40px]">
        Real capstone projects, by field
      </h1>
      <p className="mt-2 max-w-xl font-(family-name:--font-space-grotesk) text-[15px] leading-7 text-black/60">
        Every project here has been reviewed. Find one worth backing.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, university, tech, or tag..."
          className="w-full max-w-md rounded-full border-2 border-[var(--color-ink)]/15 bg-white px-5 py-3 font-(family-name:--font-space-grotesk) text-[15px] text-[var(--color-ink)] outline-none placeholder:text-black/30 focus:border-[var(--color-primary)]"
        />
        <div className="flex flex-wrap gap-2">
          <Chip active={activeField === null} onClick={() => setActiveField(null)}>
            All fields
          </Chip>
          {fields.map((f) => (
            <Chip key={f} active={activeField === f} onClick={() => setActiveField(f)}>
              {f}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="font-(family-name:--font-space-mono) text-[10px] font-bold uppercase tracking-[0.05em] text-black/30">
          Popular tags
        </span>
        {popularTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag((t) => (t === tag ? null : tag))}
            className={`rounded-full px-3 py-1 font-(family-name:--font-space-grotesk) text-xs transition-colors ${
              activeTag === tag
                ? "bg-[var(--color-ink)] text-white"
                : "bg-[var(--color-surface)] text-black/60 hover:bg-[var(--color-surface-muted)]"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <p className="mt-6 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
        {filtered.length} project{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <DiscoverProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center text-center">
          <p className="font-(family-name:--font-unbounded) text-lg font-bold text-[var(--color-ink)]">
            No projects match yet
          </p>
          <p className="mt-2 font-(family-name:--font-space-grotesk) text-sm text-black/50">
            Try a different search term or clear the field/tag filter.
          </p>
        </div>
      )}
    </main>
  );
}
