"use client";

import { AppNav } from "@/components/layout/AppNav";
import { Eyebrow } from "@/components/ui/Badge";
import { StudentProfileView } from "@/components/profile/StudentProfileView";
import { ProfessionalProfileView } from "@/components/profile/ProfessionalProfileView";
import { currentStudent, currentProfessional } from "@/lib/mockData";
import { useRole } from "@/lib/role";

export default function ProfilePage() {
  const { role } = useRole();
  const name = role === "student" ? currentStudent.name : currentProfessional.name;

  return (
    <div className="min-h-screen bg-white">
      <AppNav />

      <main className="mx-auto max-w-4xl px-6 py-10 sm:px-10">
        <Eyebrow>Your profile</Eyebrow>
        <h1 className="mt-3 font-(family-name:--font-unbounded) text-[32px] font-bold leading-tight text-[var(--color-ink)] sm:text-[40px]">
          {name}
        </h1>

        {role === "student" ? <StudentProfileView /> : <ProfessionalProfileView />}
      </main>
    </div>
  );
}
