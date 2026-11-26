"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AvatarUpload } from "@/components/ui/AvatarUpload";
import { TextField, TextAreaField } from "@/components/ui/Field";
import { TagInput } from "@/components/ui/TagInput";
import Link from "next/link";
import { StatCard } from "@/components/ui/StatCard";
import { ProjectCard } from "@/components/project/ProjectCard";
import { updateStudentProfile } from "@/lib/actions/profile";
import { showErrorPopup } from "@/lib/popup";
import { ProfileCompletenessBanner } from "@/components/profile/ProfileCompletenessBanner";
import { AvailabilitySelector } from "@/components/profile/AvailabilitySelector";
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
  const [skills, setSkills] = useState(profile.skills);
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl ?? "");
  const [portfolioUrl, setPortfolioUrl] = useState(profile.portfolioUrl ?? "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function save() {
    startTransition(async () => {
      try {
        await updateStudentProfile({ name, university, fieldOfStudy, bio, skills, linkedinUrl, portfolioUrl });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        showErrorPopup("Couldn't save profile", err instanceof Error ? err.message : undefined);
      }
    });
  }

  return (
    <>
      <div className="mt-8">
        <ProfileCompletenessBanner profile={profile} />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_260px]">
        <Card className="flex flex-col gap-5 p-6 sm:p-8" shadow="dark">
          <div className="flex items-center gap-4">
            <AvatarUpload name={name} seed={profile.id} imageUrl={profile.avatarUrl} size={64} />
            <div>
              <p className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-primary)]">
                Student {profile.verified && "· Verified"}
              </p>
            </div>
          </div>

          <AvailabilitySelector initialStatus={profile.availabilityStatus} />

          <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="University" value={university} onChange={(e) => setUniversity(e.target.value)} />
          <TextField
            label="Field of study"
            value={fieldOfStudy}
            onChange={(e) => setFieldOfStudy(e.target.value)}
          />
          <TextAreaField label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          <TagInput
            label="Skills"
            hint="Press enter to add"
            tags={skills}
            onChange={setSkills}
            placeholder="e.g. React, Embedded Systems"
          />
          <TextField
            label="LinkedIn"
            hint="Optional"
            placeholder="https://linkedin.com/in/you"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
          />
          <TextField
            label="Portfolio"
            hint="Optional"
            placeholder="https://your-site.com"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
          />

          <div className="flex items-center gap-3">
            <Button variant="primary" className="self-start" onClick={save} loading={isPending}>
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
      {myProjects.length === 0 ? (
        <div className="pv-border mt-6 flex flex-col items-center gap-3 rounded-2xl bg-[var(--color-surface)] p-10 text-center">
          <p className="font-(family-name:--font-space-grotesk) text-sm text-black/50">
            You haven&apos;t submitted a project yet — share what you built and get discovered.
          </p>
          <Link href="/projects/new">
            <Button variant="primary">Submit your first project</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {myProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </>
  );
}
