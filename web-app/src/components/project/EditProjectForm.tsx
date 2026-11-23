"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Eyebrow, StatusPill } from "@/components/ui/Badge";
import { TextField, TextAreaField, SelectField } from "@/components/ui/Field";
import { TagInput } from "@/components/ui/TagInput";
import { updateProject, deleteProject } from "@/lib/actions/projects";
import type { Project, ProjectField } from "@/lib/types";

export function EditProjectForm({ project }: { project: Project }) {
  const router = useRouter();
  const [title, setTitle] = useState(project.title);
  const [field, setField] = useState<ProjectField>(project.field);
  const [problem, setProblem] = useState(project.problem);
  const [solution, setSolution] = useState(project.solution);
  const [techStack, setTechStack] = useState<string[]>(project.techStack);
  const [team, setTeam] = useState<string[]>(project.team.map((t) => t.name));
  const [githubUrl, setGithubUrl] = useState(project.githubUrl ?? "");
  const [demoUrl, setDemoUrl] = useState(project.demoUrl ?? "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      await updateProject(project.id, {
        title,
        field,
        problem,
        solution,
        techStack,
        team,
        githubUrl,
        demoUrl,
      });
    });
  }

  function confirmDelete() {
    startTransition(async () => {
      await deleteProject(project.id);
    });
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 sm:px-10">
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
        <TextField label="Project title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <SelectField label="Field" value={field} onChange={(e) => setField(e.target.value as ProjectField)}>
          <option value="Engineering">Engineering &amp; Technology</option>
          <option value="Health & Medicine">Health &amp; Medicine</option>
          <option value="Finance & Technology">Finance &amp; Technology</option>
        </SelectField>
        <TextAreaField label="The problem" value={problem} onChange={(e) => setProblem(e.target.value)} />
        <TextAreaField label="Your solution" value={solution} onChange={(e) => setSolution(e.target.value)} />
        <TagInput label="Tech stack" tags={techStack} onChange={setTechStack} />
        <TagInput label="Team members" tags={team} onChange={setTeam} />
        <TextField label="GitHub link" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
        <TextField label="Live demo link" hint="Optional" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} />
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
          <Button variant="primary" onClick={save} disabled={isPending}>
            {isPending ? "Saving..." : project.status === "rejected" ? "Resubmit for review" : "Save changes"}
          </Button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-sm p-6" shadow="dark">
            <h3 className="font-(family-name:--font-unbounded) text-lg font-bold text-[var(--color-ink)]">
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
              <Button variant="primary" onClick={confirmDelete} className="bg-[var(--color-danger)]" disabled={isPending}>
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}
