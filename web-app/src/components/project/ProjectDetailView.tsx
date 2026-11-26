"use client";

import { useEffect, useId, useState, useTransition } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { DiscoverProjectCard } from "@/components/project/DiscoverProjectCard";
import { toggleBookmark, incrementProjectViews, reportProject } from "@/lib/actions/projects";
import { startConversation } from "@/lib/actions/messaging";
import { showErrorPopup } from "@/lib/popup";
import type { Profile, Project } from "@/lib/types";

const fieldDot: Record<string, string> = {
  "Engineering & Technology": "bg-[#6C4CE0]",
  "Artificial Intelligence": "bg-[#FF7A30]",
  Cybersecurity: "bg-[#6C4CE0]",
  "Health & Medicine": "bg-[#FF7A30]",
  "Finance & Accounting": "bg-[#6C4CE0]",
  "Business & Management": "bg-[#FF7A30]",
  "Agriculture & Environment": "bg-[#6C4CE0]",
  "Climate Science": "bg-[#FF7A30]",
  "Energy & Sustainability": "bg-[#6C4CE0]",
  Education: "bg-[#FF7A30]",
  "Creative & Media": "bg-[#6C4CE0]",
  "Social Sciences & Humanities": "bg-[#FF7A30]",
};

export function ProjectDetailView({
  project,
  similarProjects,
  viewer,
  initiallyBookmarked,
}: {
  project: Project;
  similarProjects: Project[];
  viewer: Profile;
  initiallyBookmarked: boolean;
}) {
  const [bookmarked, setBookmarked] = useState(initiallyBookmarked);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const reportTitleId = useId();
  const [isPending, startTransition] = useTransition();

  const isOwner = viewer.id === project.studentId;
  const canMessage = viewer.role !== "professional" || viewer.verified;
  const images = project.documents.filter((d) => d.kind === "image");
  const otherDocs = project.documents.filter((d) => d.kind !== "image");

  useEffect(() => {
    if (!isOwner) incrementProjectViews(project.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  function handleBookmark() {
    setBookmarked((b) => !b);
    startTransition(async () => {
      await toggleBookmark(project.id);
    });
  }

  function handleMessage() {
    startTransition(async () => {
      try {
        await startConversation(project.id);
      } catch (err) {
        showErrorPopup("Couldn't start conversation", err instanceof Error ? err.message : undefined);
      }
    });
  }

  async function submitReport() {
    setReportSubmitting(true);
    setReportError(null);
    try {
      await reportProject(project.id, reportReason);
      setReportSent(true);
      setTimeout(() => {
        setReportOpen(false);
        setReportSent(false);
        setReportReason("");
      }, 1200);
    } catch (err) {
      setReportError(err instanceof Error ? err.message : "Couldn't send your report. Try again.");
    } finally {
      setReportSubmitting(false);
    }
  }

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-10 sm:px-10">
      <div className="flex items-center justify-between">
        <Link
          href="/discover"
          className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-black/40 hover:text-[var(--color-ink)]"
        >
          ← Back to Discover
        </Link>
        {!isOwner && (
          <button
            type="button"
            onClick={() => setReportOpen(true)}
            className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-black/30 hover:text-[var(--color-danger)]"
          >
            Report
          </button>
        )}
      </div>

      <div className="mt-6 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${fieldDot[project.field]}`} />
        <span className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-black/50">
          {project.field}
        </span>
      </div>

      <h1 className="mt-3 font-(family-name:--font-unbounded) text-[32px] font-bold leading-tight text-[var(--color-ink)] sm:text-[40px]">
        {project.title}
      </h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[var(--color-ink)]/15 px-3 py-1 font-(family-name:--font-space-mono) text-[10px] font-bold uppercase tracking-[0.03em] text-black/50"
          >
            {tag}
          </span>
        ))}
      </div>

      <Link href={`/profile/${project.studentId}`} className="mt-5 flex w-fit items-center gap-3">
        <Avatar name={project.studentName} seed={project.studentId} imageUrl={project.studentAvatar} />
        <div>
          <div className="font-(family-name:--font-space-grotesk) text-sm font-semibold text-[var(--color-ink)] hover:underline">
            {project.studentName}
          </div>
          <div className="font-(family-name:--font-space-grotesk) text-xs text-black/50">
            {project.university}
          </div>
        </div>
      </Link>

      {(project.imageUrl || images.length > 0) && (
        <div className="mt-6 overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.imageUrl || images[0]?.url}
            alt={project.title}
            className="pv-border aspect-video w-full rounded-2xl object-cover"
          />
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-6">
          <Card className="p-6" shadow="dark">
            <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
              The problem
            </h2>
            <p className="mt-3 font-(family-name:--font-space-grotesk) text-[15px] leading-7 text-black/70">
              {project.problem}
            </p>
          </Card>

          <Card className="p-6" shadow="dark">
            <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
              The solution
            </h2>
            <p className="mt-3 font-(family-name:--font-space-grotesk) text-[15px] leading-7 text-black/70">
              {project.solution || "No write-up provided yet."}
            </p>
          </Card>

          {project.longDescription && (
            <Card className="p-6" shadow="dark">
              <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
                More about this project
              </h2>
              <p className="mt-3 whitespace-pre-line font-(family-name:--font-space-grotesk) text-[15px] leading-7 text-black/70">
                {project.longDescription}
              </p>
            </Card>
          )}

          {project.team.length > 0 && (
            <Card className="p-6" shadow="dark">
              <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
                Team
              </h2>
              <div className="mt-3 flex flex-wrap gap-3">
                {project.team.map((m) => (
                  <div key={m.id} className="flex items-center gap-2">
                    <Avatar name={m.name} seed={m.id} size={32} />
                    <span className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-ink)]">
                      {m.name}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {images.length > 0 && (
            <Card className="p-6" shadow="dark">
              <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
                Gallery
              </h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((img) => (
                  <a key={img.id} href={img.url} target="_blank" rel="noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.label}
                      className="pv-border aspect-square w-full rounded-xl object-cover"
                    />
                  </a>
                ))}
              </div>
            </Card>
          )}

          {otherDocs.length > 0 && (
            <Card className="p-6" shadow="dark">
              <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
                Documents &amp; media
              </h2>
              <div className="mt-3 flex flex-col gap-2">
                {otherDocs.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 font-(family-name:--font-space-grotesk) text-sm text-[var(--color-primary)] hover:underline"
                  >
                    {doc.kind === "pdf" ? "📄" : "🎬"} {doc.label}
                  </a>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-5" shadow="dark">
            <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
              Tools
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.techStack.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-[var(--color-surface)] px-3 py-1 font-(family-name:--font-space-grotesk) text-sm text-[var(--color-ink)]"
                >
                  {t}
                </span>
              ))}
            </div>

            {(project.githubUrl || project.demoUrl || project.thesisUrl) && (
              <div className="mt-5 flex flex-col gap-2 border-t border-dashed border-black/15 pt-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-primary)]"
                  >
                    View on GitHub →
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-primary)]"
                  >
                    View live demo →
                  </a>
                )}
                {project.thesisUrl && (
                  <a
                    href={project.thesisUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-primary)]"
                  >
                    View thesis →
                  </a>
                )}
              </div>
            )}
          </Card>

          {isOwner ? (
            <Link href={`/projects/${project.id}/edit`}>
              <Button variant="dark" className="w-full">
                Edit project
              </Button>
            </Link>
          ) : (
            <div title={!canMessage ? "Verification pending, complete it in your profile first" : undefined}>
              <Button
                variant="dark"
                className="w-full"
                onClick={handleMessage}
                disabled={!canMessage}
                loading={isPending}
              >
                {canMessage ? "Message student" : "Verification pending"}
              </Button>
            </div>
          )}

          {!isOwner && (
            <Button variant="secondary" className="w-full" onClick={handleBookmark} loading={isPending}>
              {bookmarked ? "★ Saved" : "☆ Save for later"}
            </Button>
          )}

          <div className="flex items-center justify-between px-1 font-(family-name:--font-space-mono) text-xs text-black/40">
            <span>{project.views} views</span>
            <span>{project.bookmarks} saved</span>
          </div>
        </div>
      </div>

      {similarProjects.length > 0 && (
        <div className="mt-14">
          <h2 className="font-(family-name:--font-unbounded) text-xl font-bold text-[var(--color-ink)]">
            Similar projects
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similarProjects.map((p) => (
              <DiscoverProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}

      <Modal
        open={reportOpen}
        onClose={() => {
          setReportOpen(false);
          setReportError(null);
        }}
        labelledBy={reportTitleId}
      >
          <Card className="w-full max-w-sm p-6" shadow="dark">
            {reportSent ? (
              <p role="status" aria-live="polite" className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-ink)]">
                Thanks, our team will take a look. ✓
              </p>
            ) : (
              <>
                <h3 id={reportTitleId} className="font-(family-name:--font-unbounded) text-lg font-bold text-[var(--color-ink)]">
                  Report this project
                </h3>
                <p className="mt-2 font-(family-name:--font-space-grotesk) text-sm text-black/60">
                  Let us know what&apos;s wrong: plagiarism, spam, inappropriate
                  content, or something else.
                </p>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Tell us what's going on..."
                  className="mt-4 min-h-[100px] w-full rounded-2xl border-2 border-[var(--color-ink)]/15 bg-white px-4 py-3 font-(family-name:--font-space-grotesk) text-base text-[var(--color-ink)] outline-none placeholder:text-black/30 focus:border-[var(--color-primary)]"
                />
                {reportError && (
                  <p role="alert" aria-live="assertive" className="mt-2 font-(family-name:--font-space-grotesk) text-sm text-[var(--color-danger)]">
                    {reportError}
                  </p>
                )}
                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setReportOpen(false);
                      setReportError(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={submitReport}
                    disabled={!reportReason.trim()}
                    loading={reportSubmitting}
                  >
                    Submit report
                  </Button>
                </div>
              </>
            )}
          </Card>
      </Modal>
    </main>
  );
}
