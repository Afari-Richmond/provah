"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { AppNav } from "@/components/layout/AppNav";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Eyebrow, StatusPill } from "@/components/ui/Badge";
import { TextField, TextAreaField, SelectField } from "@/components/ui/Field";
import { TagInput } from "@/components/ui/TagInput";
import { mockProjects } from "@/lib/mockData";

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const existing = mockProjects.find((p) => p.id === id);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [field, setField] = useState(existing?.field ?? "");
  const [problem, setProblem] = useState(existing?.problem ?? "");
  const [solution, setSolution] = useState(existing?.solution ?? "");
  const [techStack, setTechStack] = useState<string[]>(existing?.techStack ?? []);
  const [team, setTeam] = useState<string[]>(existing?.team.map((t) => t.name) ?? []);
  const [githubUrl, setGithubUrl] = useState(existing?.githubUrl ?? "");
  const [demoUrl, setDemoUrl] = useState(existing?.demoUrl ?? "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!existing) notFound();

  function save() {
    console.log("saved", { title, field, problem, solution, techStack, team, githubUrl, demoUrl });
    router.push("/dashboard");
  }

  function deleteProject() {
    console.log("deleted project", id);
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white">
      <AppNav />

      <main className="mx-auto max-w-2xl px-6 py-10 sm:px-10">
        <div className="flex items-center justify-between">
          <Eyebrow>Manage project</Eyebrow>
          <StatusPill status={existing.status} />
        </div>
        <h1 className="mt-3 font-(family-name:--font-unbounded) text-[28px] font-bold leading-tight text-[var(--color-ink)] sm:text-[34px]">
          Edit project
        </h1>

        {existing.status === "rejected" && existing.rejectionReason && (
          <div className="pv-border mt-6 rounded-2xl bg-[var(--color-danger)]/5 p-4">
            <p className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-danger)]">
              Rejected — needs changes
            </p>
            <p className="mt-1 font-(family-name:--font-space-grotesk) text-sm text-black/70">
              {existing.rejectionReason}
            </p>
          </div>
        )}

        <Card className="mt-6 flex flex-col gap-5 p-6 sm:p-8" shadow="dark">
          <TextField label="Project title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <SelectField label="Field" value={field} onChange={(e) => setField(e.target.value as typeof field)}>
            <option value="Engineering">Engineering &amp; Technology</option>
            <option value="Health &amp; Medicine">Health &amp; Medicine</option>
            <option value="Finance &amp; Technology">Finance &amp; Technology</option>
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
            <Button variant="primary" onClick={save}>
              {existing.status === "rejected" ? "Resubmit for review" : "Save changes"}
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
                <Button variant="primary" onClick={deleteProject} className="bg-[var(--color-danger)]">
                  Delete
                </Button>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
