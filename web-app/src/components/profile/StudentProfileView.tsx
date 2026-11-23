"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AvatarUpload } from "@/components/ui/AvatarUpload";
import { TextField, TextAreaField } from "@/components/ui/Field";
import { StatCard } from "@/components/ui/StatCard";
import { ProjectCard } from "@/components/project/ProjectCard";
import { updateStudentProfile } from "@/lib/actions/profile";
import type { Profile, Project } from "@/lib/types";

export function StudentProfileView({
  profile,
  myProjects,
}: {
  profile: Profile;
  myProjects: Project[];
}) {
  const [name, setName] = useState(profile.name);
  const [university, setUniversity] = useState(profile.university ?? "");
  const [fieldOfStudy, setFieldOfStudy] = useState(profile.fieldOfStudy ?? "");
  const [bio, setBio] = useState(profile.bio);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function save() {
    startTransition(async () => {
      await updateStudentProfile({ name, university, fieldOfStudy, bio });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <>
      <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_260px]">
        <Card className="flex flex-col gap-5 p-6 sm:p-8" shadow="dark">
          <div className="flex items-center gap-4">
            <AvatarUpload name={name} seed={profile.id} size={64} />
            <div>
              <p className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-primary)]">
                Student {profile.verified && "· Verified"}
              </p>
            </div>
          </div>

          <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="University" value={university} onChange={(e) => setUniversity(e.target.value)} />
          <TextField
            label="Field of study"
            value={fieldOfStudy}
            onChange={(e) => setFieldOfStudy(e.target.value)}
          />
          <TextAreaField label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />

          <div className="flex items-center gap-3">
            <Button variant="primary" className="self-start" onClick={save} disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
            {saved && (
              <span className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-primary)]">
                Saved ✓
              </span>
            )}
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <StatCard value={myProjects.length} label="Projects" />
          <StatCard
            value={myProjects.reduce((s, p) => s + p.views, 0)}
            label="Total views"
          />
          <StatCard
            value={myProjects.reduce((s, p) => s + p.messages, 0)}
            label="Messages"
          />
        </div>
      </div>

      <h2 className="mt-12 font-(family-name:--font-unbounded) text-xl font-bold text-[var(--color-ink)]">
        Your projects
      </h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {myProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}
