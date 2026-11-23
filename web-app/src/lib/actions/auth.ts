"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState = { error: string | null };

export async function signUp(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const supabase = await createClient();
  const role = String(formData.get("role"));

  const data =
    role === "professional"
      ? {
          role: "professional",
          name: String(formData.get("name")),
          company: String(formData.get("company")),
          title: String(formData.get("title")),
        }
      : {
          role: "student",
          name: String(formData.get("name")),
          university: String(formData.get("university")),
          field_of_study: String(formData.get("field")),
        };

  const { error } = await supabase.auth.signUp({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
    options: { data },
  });

  if (error) return { error: error.message };
  redirect("/dashboard");
}

export async function logIn(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  });

  if (error) return { error: "That email/password combination doesn't match an account." };
  redirect("/dashboard");
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
