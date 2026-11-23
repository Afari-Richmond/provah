import { AppNavBar } from "@/components/layout/AppNavBar";
import { Eyebrow } from "@/components/ui/Badge";
import { StudentProfileView } from "@/components/profile/StudentProfileView";
import { ProfessionalProfileView } from "@/components/profile/ProfessionalProfileView";
import { requireProfile } from "@/lib/auth";
import { getProjectsByStudent, getBookmarkedProjects } from "@/lib/data/projects";
import { getConversations } from "@/lib/data/messaging";

export default async function ProfilePage() {
  const profile = await requireProfile();

  return (
    <div className="min-h-screen bg-white">
      <AppNavBar />

      <main className="mx-auto max-w-4xl px-6 py-10 sm:px-10">
        <Eyebrow>Your profile</Eyebrow>
        <h1 className="mt-3 font-(family-name:--font-unbounded) text-[32px] font-bold leading-tight text-[var(--color-ink)] sm:text-[40px]">
          {profile.name}
        </h1>

        {profile.role === "student" ? (
          <StudentProfileView profile={profile} myProjects={await getProjectsByStudent(profile.id)} />
        ) : (
          <ProfessionalProfileView
            profile={profile}
            savedProjects={await getBookmarkedProjects(profile.id)}
            conversationCount={(await getConversations(profile.id)).length}
          />
        )}
      </main>
    </div>
  );
}
