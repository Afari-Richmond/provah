import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import type { Profile } from "@/lib/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    role: row.role as Profile["role"],
    name: row.name,
    avatarUrl: row.avatar_url,
    bio: row.bio ?? "",
    verified: row.verified,
    badges: row.badges ?? [],
    university: row.university,
    fieldOfStudy: row.field_of_study,
    title: row.title,
    company: row.company,
    location: row.location,
    areasOfInterest: row.areas_of_interest ?? [],
    coverImageUrl: row.cover_image_url,
    skills: row.skills ?? [],
    linkedinUrl: row.linkedin_url,
    portfolioUrl: row.portfolio_url,
    createdAt: row.created_at,
  };
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile ? mapProfile(profile) : null;
}

export async function requireProfile(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  return profile;
}

export async function requireRole(role: Profile["role"]): Promise<Profile> {
  const profile = await requireProfile();
  if (profile.role !== role) redirect("/dashboard");
  return profile;
}
