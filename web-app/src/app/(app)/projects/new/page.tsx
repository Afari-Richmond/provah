"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppNav } from "@/components/layout/AppNav";
import { StepIndicator } from "@/components/project/StepIndicator";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Badge";
import { TextField, TextAreaField, SelectField } from "@/components/ui/Field";
import { TagInput } from "@/components/ui/TagInput";

type FormState = {
  title: string;
  field: string;
  problem: string;
  solution: string;
  techStack: string[];
  team: string[];
  githubUrl: string;
  demoUrl: string;
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
};

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function next() {
    setStep((s) => Math.min(5, s + 1));
  }
  function back() {
    setStep((s) => Math.max(1, s - 1));
  }

  function submit(asDraft: boolean) {
    // UI-only for now — no backend yet.
    console.log(asDraft ? "saved as draft" : "submitted for review", form);
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white">
      <AppNav />

      <main className="mx-auto max-w-2xl px-6 py-10 sm:px-10">
        <Eyebrow>New project</Eyebrow>
        <h1 className="mt-3 font-(family-name:--font-unbounded) text-[28px] font-bold leading-tight text-[var(--color-ink)] sm:text-[34px]">
          Tell us what you built
        </h1>
        <p className="mt-2 font-(family-name:--font-space-grotesk) text-[15px] leading-7 text-black/60">
          Takes about five minutes. You can save a draft and come back anytime.
        </p>

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
                onChange={(e) => update("field", e.target.value)}
              >
                <option value="" disabled>
                  Select a field
                </option>
                <option value="engineering">Engineering &amp; Technology</option>
                <option value="health">Health &amp; Medicine</option>
                <option value="fintech">Finance &amp; Technology</option>
              </SelectField>
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
                    Click to upload
                  </span>
                  <span className="font-(family-name:--font-space-grotesk) text-xs text-black/40">
                    Images, PDF write-ups, or a short demo video
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
                  {form.problem || "—"}
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
                    <span className="font-(family-name:--font-space-grotesk) text-sm text-black/40">—</span>
                  )}
                </div>
              </div>
              <p className="mt-2 font-(family-name:--font-space-grotesk) text-xs leading-5 text-black/40">
                Submitting sends this to our team for a quick review before it goes
                live on Discover — usually within a few days.
              </p>
            </div>
          )}
        </Card>

        <div className="mt-6 flex items-center justify-between">
          <Button variant="secondary" onClick={back} disabled={step === 1}>
            Back
          </Button>

          {step < 5 ? (
            <Button variant="primary" onClick={next}>
              Continue
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => submit(true)}>
                Save as draft
              </Button>
              <Button variant="primary" onClick={() => submit(false)}>
                Submit for review
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
