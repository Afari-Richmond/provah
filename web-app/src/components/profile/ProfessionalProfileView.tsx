"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AvatarUpload } from "@/components/ui/AvatarUpload";
import { TextField, TextAreaField } from "@/components/ui/Field";
import { TagInput } from "@/components/ui/TagInput";
import { StatCard } from "@/components/ui/StatCard";
import { DiscoverProjectCard } from "@/components/project/DiscoverProjectCard";
import { currentProfessional, mockConversations, mockProjects } from "@/lib/mockData";

const savedIds = ["1", "5"];

export function ProfessionalProfileView() {
  const [name, setName] = useState(currentProfessional.name);
  const [title, setTitle] = useState(currentProfessional.title);
  const [company, setCompany] = useState(currentProfessional.company);
  const [location, setLocation] = useState(currentProfessional.location);
  const [bio, setBio] = useState(currentProfessional.bio);
  const [interests, setInterests] = useState<string[]>(currentProfessional.areasOfInterest);

  const savedProjects = mockProjects.filter((p) => savedIds.includes(p.id));

  return (
    <>
      {!currentProfessional.verified && (
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
            <AvatarUpload name={name} size={64} />
            <div>
              <p className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-primary)]">
                Professional {currentProfessional.verified && "· Verified"}
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

          <Button variant="primary" className="self-start">
            Save changes
          </Button>
        </Card>

        <div className="flex flex-col gap-4">
          <StatCard value={savedProjects.length} label="Saved projects" />
          <StatCard value={mockConversations.length} label="Conversations" />
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
