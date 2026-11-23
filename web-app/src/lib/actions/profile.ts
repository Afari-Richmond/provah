"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";

export async function updateStudentProfile(input: {
  name: string;
  university: string;
  fieldOfStudy: string;
  bio: string;
}) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      name: input.name,
      university: input.university,
      field_of_study: input.fieldOfStudy,
      bio: input.bio,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  if (error) throw new Error(error.message);
  revalidatePath("/profile");
}

export async function updateProfessionalProfile(input: {
  name: string;
  title: string;
  company: string;
  location: string;
  bio: string;
  areasOfInterest: string[];
}) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      name: input.name,
      title: input.title,
      company: input.company,
      location: input.location,
      bio: input.bio,
      areas_of_interest: input.areasOfInterest,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  if (error) throw new Error(error.message);
  revalidatePath("/profile");
}

export async function updateAvatarUrl(url: string) {
  const profile = await requireProfile();
  const supabase = await createClient();
  await supabase.from("profiles").update({ avatar_url: url }).eq("id", profile.id);
  revalidatePath("/profile");
}
