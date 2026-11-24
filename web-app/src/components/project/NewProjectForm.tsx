"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { StepIndicator } from "@/components/project/StepIndicator";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Badge";
import { TextField, TextAreaField, SelectField } from "@/components/ui/Field";
import { TagInput } from "@/components/ui/TagInput";
import { createProject } from "@/lib/actions/projects";
import { uploadToBucket } from "@/lib/uploads";
import { Spinner } from "@/components/ui/Spinner";
import type { ProjectField } from "@/lib/types";
import { PROJECT_FIELDS } from "@/lib/fields";

type FormState = {
  title: string;
  field: ProjectField | "";
  problem: string;
  solution: string;
  techStack: string[];
  team: string[];
  githubUrl: string;
  demoUrl: string;
  imageUrl: string | null;
};

const initialForm: FormState = {
  title: "",
  field: "",
  problem: "",
  solution: "",
  techStack: [],
  team: [],
  githubUrl: "",
  demoUrl: "",
  imageUrl: null,
};

const DRAFT_KEY = "provah:draft:new-project";

export function NewProjectForm({ userId }: { userId: string }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [restoreAvailable, setRestoreAvailable] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const hasInteracted = useRef(false);

  async function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToBucket("project-media", userId, file);
      update("imageUrl", url);
    } finally {
      setUploading(false);
    }
  }

  // offer to restore a previously-autosaved draft, if one exists —
  // reading localStorage on mount, not available during SSR
  useEffect(() => {
    const saved = window.localStorage.getItem(DRAFT_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setRestoreAvailable(true);
  }, []);

  // debounced autosave to localStorage on any change, once the user has
  // actually touched the form (avoids overwriting a restorable draft with
  // the untouched initial state on first render)
  useEffect(() => {
    if (!hasInteracted.current) return;
    const timeout = setTimeout(() => {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      setLastSavedAt(new Date());
    }, 600);
    return () => clearTimeout(timeout);
  }, [form]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    hasInteracted.current = true;
    setRestoreAvailable(false);
    setForm((f) => ({ ...f, [key]: value }));
  }

  function restoreDraft() {
    const saved = window.localStorage.getItem(DRAFT_KEY);
    if (saved) {
      hasInteracted.current = true;
      setForm(JSON.parse(saved));
    }
    setRestoreAvailable(false);
  }

  function discardDraft() {
    window.localStorage.removeItem(DRAFT_KEY);
    setRestoreAvailable(false);
  }

  function next() {
    setStep((s) => Math.min(5, s + 1));
  }
  function back() {
    setStep((s) => Math.max(1, s - 1));
  }

  function submit(asDraft: boolean) {
    if (!form.field) return;
    startTransition(async () => {
      await createProject({
        title: form.title,
        field: form.field as ProjectField,
        problem: form.problem,
        solution: form.solution,
        techStack: form.techStack,
        team: form.team,
        githubUrl: form.githubUrl,
        demoUrl: form.demoUrl,
        imageUrl: form.imageUrl,
        submitForReview: !asDraft,
      });
      window.localStorage.removeItem(DRAFT_KEY);
    });
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 sm:px-10">
      <Eyebrow>New project</Eyebrow>
      <h1 className="mt-3 font-(family-name:--font-unbounded) text-[28px] font-bold leading-tight text-[var(--color-ink)] sm:text-[34px]">
        Tell us what you built
      </h1>
      <p className="mt-2 font-(family-name:--font-space-grotesk) text-[15px] leading-7 text-black/60">
        Takes about five minutes. You can save a draft and come back anytime.
      </p>

      {restoreAvailable && (
        <div className="pv-border mt-6 flex flex-col gap-2 rounded-2xl bg-[var(--color-primary-muted)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-ink)]">
            You have an unfinished draft from earlier. Resume it?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={discardDraft}
              className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-black/40"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={restoreDraft}
              className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-primary)]"
            >
              Resume draft →
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 overflow-x-auto pb-2">
        <StepIndicator current={step} />
      </div>

      <Card className="mt-6 p-6 sm:p-8" shadow="dark">
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <TextField
              label="Project title"
              placeholder="e.g. Solar-Powered Irrigation Controller"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
            />
            <SelectField
              label="Field"
              value={form.field}
              onChange={(e) => update("field", e.target.value as ProjectField)}
            >
              <option value="" disabled>
                Select a field
              </option>
              {PROJECT_FIELDS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </SelectField>

            <div>
              <div className="mb-2 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-[var(--color-ink)]">
                Thumbnail
              </div>
              {form.imageUrl ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.imageUrl}
                    alt=""
                    className="pv-border aspect-video w-full rounded-2xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => update("imageUrl", null)}
                    className="pv-border absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="pv-border flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-dashed bg-[var(--color-surface)] text-center">
                  {uploading ? (
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
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <TextAreaField
              label="The problem"
              hint="What real problem does this solve?"
              placeholder="Smallholder farms lose crops to inconsistent watering schedules..."
              value={form.problem}
              onChange={(e) => update("problem", e.target.value)}
            />
            <TextAreaField
              label="Your solution"
              hint="What did you actually build?"
              placeholder="An embedded-systems project with soil-moisture sensing..."
              value={form.solution}
              onChange={(e) => update("solution", e.target.value)}
            />
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5">
            <TagInput
              label="Tech stack"
              hint="Press enter to add"
              tags={form.techStack}
              onChange={(v) => update("techStack", v)}
              placeholder="e.g. Arduino, React Native"
            />
            <TagInput
              label="Team members"
              hint="Press enter to add"
              tags={form.team}
              onChange={(v) => update("team", v)}
              placeholder="e.g. Kwame A."
            />
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-5">
            <TextField
              label="GitHub link"
              placeholder="https://github.com/you/project"
              value={form.githubUrl}
              onChange={(e) => update("githubUrl", e.target.value)}
            />
            <TextField
              label="Live demo link"
              hint="Optional"
              placeholder="https://your-demo.vercel.app"
              value={form.demoUrl}
              onChange={(e) => update("demoUrl", e.target.value)}
            />
            <div>
              <div className="mb-2 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-[var(--color-ink)]">
                Media &amp; documents
              </div>
              <div className="pv-border flex flex-col items-center justify-center gap-2 rounded-2xl border-dashed bg-[var(--color-surface)] px-6 py-10 text-center">
                <span className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-primary)]">
                  Add documents after creating the project
                </span>
                <span className="font-(family-name:--font-space-grotesk) text-xs text-black/40">
                  Images, PDF write-ups, or a short demo video. Add them from the edit page
                </span>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col gap-5">
            <div>
              <div className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-black/40">
                Title
              </div>
              <div className="mt-1 font-(family-name:--font-unbounded) text-lg font-bold text-[var(--color-ink)]">
                {form.title || "Untitled project"}
              </div>
            </div>
            <div>
              <div className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-black/40">
                Problem
              </div>
              <p className="mt-1 font-(family-name:--font-space-grotesk) text-[15px] leading-6 text-black/70">
                {form.problem || "No description yet"}
              </p>
            </div>
            <div>
              <div className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-black/40">
                Tech stack
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {form.techStack.length > 0 ? (
                  form.techStack.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-[var(--color-surface)] px-3 py-1 font-(family-name:--font-space-grotesk) text-sm"
                    >
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="font-(family-name:--font-space-grotesk) text-sm text-black/40">None yet</span>
                )}
              </div>
            </div>
            <p className="mt-2 font-(family-name:--font-space-grotesk) text-xs leading-5 text-black/40">
              Submitting sends this to our team for a quick review before it goes
              live on Discover, usually within a few days.
            </p>
          </div>
        )}
      </Card>

      {lastSavedAt && (
        <p className="mt-3 text-right font-(family-name:--font-space-mono) text-[10px] uppercase tracking-[0.03em] text-black/30">
          Draft autosaved {lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between">
        <Button variant="secondary" onClick={back} disabled={step === 1}>
          Back
        </Button>

        {step < 5 ? (
          <Button variant="primary" onClick={next} disabled={step === 1 && !form.field}>
            Continue
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => submit(true)} loading={isPending}>
              Save as draft
            </Button>
            <Button variant="primary" onClick={() => submit(false)} loading={isPending}>
              {isPending ? "Submitting..." : "Submit for review"}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
