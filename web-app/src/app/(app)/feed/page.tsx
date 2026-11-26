import { AppNavBar } from "@/components/layout/AppNavBar";
import { FeedClient } from "@/components/feed/FeedClient";
import { requireProfile } from "@/lib/auth";
import { getFeedPosts, FEED_PAGE_SIZE } from "@/lib/data/feed";
import { getProjectsByStudent } from "@/lib/data/projects";

export default async function FeedPage() {
  const profile = await requireProfile();

  const [posts, myProjects] = await Promise.all([
    getFeedPosts(profile.id),
    profile.role === "student" ? getProjectsByStudent(profile.id) : Promise.resolve([]),
  ]);

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <AppNavBar active="/feed" />
      <FeedClient
        initialPosts={posts}
        viewer={profile}
        myProjects={myProjects}
        hasMore={posts.length === FEED_PAGE_SIZE}
      />
    </div>
  );
}
