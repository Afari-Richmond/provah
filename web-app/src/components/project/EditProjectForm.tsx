"use client";

import { useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { Eyebrow, StatusPill } from "@/components/ui/Badge";
import { TextField, TextAreaField, SelectField } from "@/components/ui/Field";
import { TagInput } from "@/components/ui/TagInput";
import {
  updateProject,
  deleteProject,
  addProjectDocument,
  deleteProjectDocument,
} from "@/lib/actions/projects";
import { uploadToBucket } from "@/lib/uploads";
import type { Project, ProjectDocument, ProjectField } from "@/lib/types";
import { PROJECT_FIELDS } from "@/lib/fields";

export function EditProjectForm({ project }: { project: Project }) {
  const router = useRouter();
  const [title, setTitle] = useState(project.title);
  const [field, setField] = useState<ProjectField>(project.field);
  const [problem, setProblem] = useState(project.problem);
  const [solution, setSolution] = useState(project.solution);
  const [longDescription, setLongDescription] = useState(project.longDescription ?? "");
  const [techStack, setTechStack] = useState<string[]>(project.techStack);
  const [team, setTeam] = useState<string[]>(project.team.map((t) => t.name));
  const [githubUrl, setGithubUrl] = useState(project.githubUrl ?? "");
  const [demoUrl, setDemoUrl] = useState(project.demoUrl ?? "");
  const [thesisUrl, setThesisUrl] = useState(project.thesisUrl ?? "");
  const [imageUrl, setImageUrl] = useState(project.imageUrl ?? null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingGalleryItem, setUploadingGalleryItem] = useState(false);
  const [documents, setDocuments] = useState<ProjectDocument[]>(project.documents);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteTitleId = useId();
  const [isPending, startTransition] = useTransition();
  const galleryInputRef = useRef<HTMLInputElement>(null);

  async function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingThumbnail(true);
    try {
      const url = await uploadToBucket("project-media", project.studentId, file);
      setImageUrl(url);
    } finally {
      setUploadingThumbnail(false);
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGalleryItem(true);
    try {
      const url = await uploadToBucket("project-media", project.studentId, file);
      const kind = file.type.startsWith("video/") ? "video" : file.type === "application/pdf" ? "pdf" : "image";
      const { id } = await addProjectDocument(project.id, { label: file.name, kind, url });
      setDocuments((docs) => [...docs, { id, label: file.name, kind, url }]);
    } finally {
      setUploadingGalleryItem(false);
    }
  }

  function removeDocument(docId: string) {
    setDocuments((docs) => docs.filter((d) => d.id !== docId));
    startTransition(async () => {
      await deleteProjectDocument(docId, project.id);
    });
  }

  function save() {
    startTransition(async () => {
      await updateProject(project.id, {
        title,
        field,
        problem,
        solution,
        longDescription,
        techStack,
        team,
        githubUrl,
        demoUrl,
        thesisUrl,
        imageUrl,
      });
    });
  }

  function confirmDelete() {
    startTransition(async () => {
      await deleteProject(project.id);
    });
  }

  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-10 sm:px-10">
      <div className="flex items-center justify-between">
        <Eyebrow>Manage project</Eyebrow>
        <StatusPill status={project.status} />
      </div>
      <h1 className="mt-3 font-(family-name:--font-unbounded) text-[28px] font-bold leading-tight text-[var(--color-ink)] sm:text-[34px]">
        Edit project
      </h1>

      {project.status === "rejected" && project.rejectionReason && (
        <div className="pv-border mt-6 rounded-2xl bg-[var(--color-danger)]/5 p-4">
          <p className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-danger)]">
            Rejected, needs changes
          </p>
          <p className="mt-1 font-(family-name:--font-space-grotesk) text-sm text-black/70">
            {project.rejectionReason}
          </p>
        </div>
      )}

      <Card className="mt-6 flex flex-col gap-5 p-6 sm:p-8" shadow="dark">
        <div>
          <div className="mb-2 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-[var(--color-ink)]">
            Thumbnail
          </div>
          {imageUrl ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" className="pv-border aspect-video w-full rounded-2xl object-cover" />
              <button
                type="button"
                onClick={() => setImageUrl(null)}
                className="pv-border absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold"
              >
                ✕
              </button>
            </div>
          ) : (
            <label className="pv-border flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-dashed bg-[var(--color-surface)] text-center">
              {uploadingThumbnail ? (
                <Spinner size={24} />
              ) : (
                <>
                  <span className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-primary)]">
                    Upload a thumbnail
                  </span>
                  <span className="font-(family-name:--font-space-grotesk) text-xs text-black/40">
                    Optional, shows a Provah placeholder if skipped
                  </span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
            </label>
          )}
        </div>

        <TextField label="Project title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <SelectField label="Field" value={field} onChange={(e) => setField(e.target.value as ProjectField)}>
          {PROJECT_FIELDS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </SelectField>
        <TextAreaField label="The problem" value={problem} onChange={(e) => setProblem(e.target.value)} />
        <TextAreaField label="Your solution" value={solution} onChange={(e) => setSolution(e.target.value)} />
        <TextAreaField
          label="Long description"
          hint="Optional — go deeper: approach, architecture, challenges, results"
          value={longDescription}
          onChange={(e) => setLongDescription(e.target.value)}
        />
        <TagInput label="Tools" tags={techStack} onChange={setTechStack} />
        <TagInput label="Team members" tags={team} onChange={setTeam} />
        <TextField label="GitHub link" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
        <TextField label="Live demo link" hint="Optional" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} />
        <TextField label="Thesis link" hint="Optional" value={thesisUrl} onChange={(e) => setThesisUrl(e.target.value)} />
      </Card>

      <Card className="mt-6 flex flex-col gap-4 p-6 sm:p-8" shadow="dark">
        <div className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-[var(--color-ink)]">
          Gallery &amp; documents
        </div>
        <p className="font-(family-name:--font-space-grotesk) text-xs text-black/40">
          Extra screenshots, a PDF write-up, or a short demo video. Shown on your project&apos;s detail page.
        </p>

        {documents.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {documents.map((doc) => (
              <div key={doc.id} className="relative">
                {doc.kind === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={doc.url} alt={doc.label} className="pv-border aspect-square w-full rounded-xl object-cover" />
                ) : (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="pv-border flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-xl bg-[var(--color-surface)] px-2 text-center"
                  >
                    <span className="text-2xl">{doc.kind === "pdf" ? "📄" : "🎬"}</span>
                    <span className="line-clamp-2 font-(family-name:--font-space-grotesk) text-xs text-black/60">
                      {doc.label}
                    </span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => removeDocument(doc.id)}
                  className="pv-border absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          className="pv-border flex items-center justify-center gap-2 rounded-2xl border-dashed bg-[var(--color-surface)] py-4 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-primary)]"
        >
          {uploadingGalleryItem ? <Spinner size={16} /> : "+ Add image, PDF, or video"}
        </button>
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*,application/pdf,video/*"
          onChange={handleGalleryUpload}
          className="hidden"
        />
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-danger)]"
        >
          Delete project
        </button>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
          <Button variant="primary" onClick={save} loading={isPending}>
            {isPending ? "Saving..." : project.status === "rejected" ? "Resubmit for review" : "Save changes"}
          </Button>
        </div>
      </div>

      <Modal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} labelledBy={deleteTitleId}>
        <Card className="w-full max-w-sm p-6" shadow="dark">
          <h3 id={deleteTitleId} className="font-(family-name:--font-unbounded) text-lg font-bold text-[var(--color-ink)]">
            Delete this project?
          </h3>
          <p className="mt-2 font-(family-name:--font-space-grotesk) text-sm text-black/60">
            This can&apos;t be undone. The project will be removed from Discover
            immediately.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmDelete} className="bg-[var(--color-danger)]" loading={isPending}>
              Delete
            </Button>
          </div>
        </Card>
      </Modal>
    </main>
  );
}
