"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AvatarUpload } from "@/components/ui/AvatarUpload";
import { TextField, TextAreaField } from "@/components/ui/Field";
import { StatCard } from "@/components/ui/StatCard";
import { ProjectCard } from "@/components/project/ProjectCard";
import { currentStudent, mockProjects } from "@/lib/mockData";

export function StudentProfileView() {
  const [name, setName] = useState(currentStudent.name);
  const [university, setUniversity] = useState(currentStudent.university);
  const [fieldOfStudy, setFieldOfStudy] = useState(currentStudent.fieldOfStudy);
  const [bio, setBio] = useState(currentStudent.bio);

  const myProjects = mockProjects.filter((p) => p.studentName === currentStudent.name);

  return (
    <>
      <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_260px]">
        <Card className="flex flex-col gap-5 p-6 sm:p-8" shadow="dark">
          <div className="flex items-center gap-4">
            <AvatarUpload name={name} size={64} />
            <div>
              <p className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-primary)]">
                Student {currentStudent.verified && "· Verified"}
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

          <Button variant="primary" className="self-start">
            Save changes
          </Button>
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
