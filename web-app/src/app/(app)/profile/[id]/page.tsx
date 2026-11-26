import { notFound, redirect } from "next/navigation";
import { AppNavBar } from "@/components/layout/AppNavBar";
import { Eyebrow } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { StatCard } from "@/components/ui/StatCard";
import { ProjectCard } from "@/components/project/ProjectCard";
import { ConnectButton } from "@/components/profile/ConnectButton";
import { MessageButton } from "@/components/profile/MessageButton";
import { BlockButton } from "@/components/profile/BlockButton";
import { ReportProfileButton } from "@/components/profile/ReportProfileButton";
import { AvailabilityBadge } from "@/components/profile/AvailabilityBadge";
import { SkillEndorsements } from "@/components/profile/SkillEndorsements";
import { requireProfile } from "@/lib/auth";
import { getProfileById } from "@/lib/data/users";
import { getProjectsByStudent } from "@/lib/data/projects";
import { getConnectionStatus, getConnectionCount } from "@/lib/data/connections";
import { getBlockDirection } from "@/lib/data/blocks";
import { getSkillEndorsements } from "@/lib/data/endorsements";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const viewer = await requireProfile();

  if (id === viewer.id) redirect("/profile");

  const profile = await getProfileById(id);
  if (!profile) notFound();

  const [allProjects, connectionInfo, connectionCount, blockDirection, endorsements] = await Promise.all([
    profile.role === "student" ? getProjectsByStudent(profile.id) : Promise.resolve([]),
    getConnectionStatus(viewer.id, profile.id),
    getConnectionCount(profile.id),
    getBlockDirection(viewer.id, profile.id),
    getSkillEndorsements(profile.id, viewer.id),
  ]);
  const canEndorse = connectionInfo.status === "accepted";
  const projects = allProjects.filter((p) => p.status === "published");

  return (
    <div className="min-h-screen bg-white">
      <AppNavBar />

      <main id="main-content" className="mx-auto max-w-4xl px-6 py-10 sm:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={profile.name} seed={profile.id} imageUrl={profile.avatarUrl ?? undefined} size={80} />
            <div>
              <Eyebrow>{profile.role === "student" ? "Student" : "Professional"}{profile.verified ? " · Verified" : ""}</Eyebrow>
              <h1 className="mt-2 font-(family-name:--font-unbounded) text-[28px] font-bold leading-tight text-[var(--color-ink)] sm:text-[36px]">
                {profile.name}
              </h1>
              <p className="mt-1 font-(family-name:--font-space-grotesk) text-sm text-black/50">
                {profile.role === "student"
                  ? [profile.fieldOfStudy, profile.university].filter(Boolean).join(" · ")
                  : [profile.title, profile.company].filter(Boolean).join(" at ")}
              </p>
              {profile.availabilityStatus && (
                <div className="mt-2">
                  <AvailabilityBadge status={profile.availabilityStatus} />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {blockDirection === "none" && (
              <>
                <ConnectButton
                  otherUserId={profile.id}
                  initialStatus={connectionInfo.status}
                  initialConnectionId={connectionInfo.connectionId}
                />
                <MessageButton otherUserId={profile.id} />
              </>
            )}
            <BlockButton otherUserId={profile.id} otherName={profile.name} initialDirection={blockDirection} />
            <ReportProfileButton otherUserId={profile.id} />
          </div>
        </div>

        {profile.bio && (
          <p className="mt-6 max-w-2xl font-(family-name:--font-space-grotesk) text-[15px] leading-7 text-black/70">
            {profile.bio}
          </p>
        )}

        {profile.skills.length > 0 && (
          <div className="mt-5">
            <SkillEndorsements
              profileId={profile.id}
              skills={profile.skills}
              summaries={endorsements}
              canEndorse={canEndorse}
            />
          </div>
        )}

        {(profile.linkedinUrl || profile.portfolioUrl) && (
          <div className="mt-4 flex flex-wrap gap-4">
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-primary)]"
              >
                LinkedIn →
              </a>
            )}
            {profile.portfolioUrl && (
              <a
                href={profile.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-[var(--color-primary)]"
              >
                Portfolio →
              </a>
            )}
          </div>
        )}

        {profile.role === "professional" && profile.areasOfInterest.length > 0 && (
          <div className="mt-6">
            <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
              Areas of interest
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.areasOfInterest.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-[var(--color-ink)]/15 px-3 py-1 font-(family-name:--font-space-grotesk) text-sm text-black/60"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 grid max-w-sm grid-cols-2 gap-4">
          {profile.role === "student" ? (
            <StatCard value={projects.length} label="Projects" />
          ) : (
            <StatCard value={profile.areasOfInterest.length} label="Interests" />
          )}
          <StatCard value={connectionCount} label="Connections" />
        </div>

        {profile.role === "student" && (
          <>
            <h2 className="mt-12 font-(family-name:--font-unbounded) text-xl font-bold text-[var(--color-ink)]">
              Projects
            </h2>
            {projects.length > 0 ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <p className="mt-4 font-(family-name:--font-space-grotesk) text-sm text-black/40">
                No published projects yet.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
