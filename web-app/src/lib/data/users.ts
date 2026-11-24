import "server-only";
import { createClient } from "@/lib/supabase/server";
import { mapProfile } from "@/lib/auth";
import type { Profile } from "@/lib/types";

export async function searchProfiles(query: string, excludeId?: string): Promise<Profile[]> {
  const q = query.trim();
  if (!q) return [];
  const supabase = await createClient();

  let builder = supabase
    .from("profiles")
    .select("*")
    .or(
      `name.ilike.%${q}%,university.ilike.%${q}%,company.ilike.%${q}%,title.ilike.%${q}%,field_of_study.ilike.%${q}%`,
    )
    .order("name", { ascending: true })
    .limit(20);

  if (excludeId) builder = builder.neq("id", excludeId);

  const { data, error } = await builder;
  if (error || !data) return [];
  return data.map(mapProfile);
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return mapProfile(data);
}
