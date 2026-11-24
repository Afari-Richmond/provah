"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AvatarUpload } from "@/components/ui/AvatarUpload";
import { TextField, TextAreaField } from "@/components/ui/Field";
import { TagInput } from "@/components/ui/TagInput";
import { StatCard } from "@/components/ui/StatCard";
import { DiscoverProjectCard } from "@/components/project/DiscoverProjectCard";
import { updateProfessionalProfile } from "@/lib/actions/profile";
import { showErrorPopup } from "@/lib/popup";
import type { Profile, Project } from "@/lib/types";

export function ProfessionalProfileView({
  profile,
  savedProjects,
  conversationCount,
}: {
  profile: Profile;
  savedProjects: Project[];
  conversationCount: number;
}) {
  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title ?? "");
  const [company, setCompany] = useState(profile.company ?? "");
  const [location, setLocation] = useState(profile.location ?? "");
  const [bio, setBio] = useState(profile.bio);
  const [interests, setInterests] = useState<string[]>(profile.areasOfInterest);
  const [skills, setSkills] = useState(profile.skills);
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl ?? "");
  const [portfolioUrl, setPortfolioUrl] = useState(profile.portfolioUrl ?? "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function save() {
    startTransition(async () => {
      try {
        await updateProfessionalProfile({
          name,
          title,
          company,
          location,
          bio,
          areasOfInterest: interests,
          skills,
          linkedinUrl,
          portfolioUrl,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        showErrorPopup("Couldn't save profile", err instanceof Error ? err.message : undefined);
      }
    });
  }

  return (
    <>
      {!profile.verified && (
        <div className="pv-border mt-6 flex flex-col gap-1 rounded-2xl bg-[var(--color-accent-muted)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-accent)]">
              Verification pending
            </p>
            <p className="mt-1 font-(family-name:--font-space-grotesk) text-sm text-black/70">
              Our team is reviewing your account. You can browse projects now,
              but you can&apos;t message students until you&apos;re verified.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_260px]">
        <Card className="flex flex-col gap-5 p-6 sm:p-8" shadow="dark">
          <div className="flex items-center gap-4">
            <AvatarUpload name={name} seed={profile.id} imageUrl={profile.avatarUrl} size={64} />
            <div>
              <p className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-primary)]">
                Professional {profile.verified && "· Verified"}
              </p>
            </div>
          </div>

          <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField label="Company / organization" value={company} onChange={(e) => setCompany(e.target.value)} />
          <TextField label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <TextAreaField label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          <TagInput
            label="Areas of interest"
            hint="Press enter to add"
            tags={interests}
            onChange={setInterests}
          />
          <TagInput
            label="Skills"
            hint="Press enter to add"
            tags={skills}
            onChange={setSkills}
            placeholder="e.g. Product Strategy, Fundraising"
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
          <StatCard value={savedProjects.length} label="Saved projects" />
          <StatCard value={conversationCount} label="Conversations" />
        </div>
      </div>

      <h2 className="mt-12 font-(family-name:--font-unbounded) text-xl font-bold text-[var(--color-ink)]">
        Saved projects
      </h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {savedProjects.map((project) => (
          <DiscoverProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}
