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

  const email = String(formData.get("email"));

  const { error } = await supabase.auth.signUp({
    email,
    password: String(formData.get("password")),
    options: { data },
  });

  if (error) return { error: error.message };
  redirect(`/signup/check-email?email=${encodeURIComponent(email)}`);
}

export type ResendState = { sent: boolean; error: string | null };

export async function resendConfirmation(
  _prev: ResendState,
  formData: FormData,
): Promise<ResendState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: String(formData.get("email")),
  });

  if (error) return { sent: false, error: error.message };
  return { sent: true, error: null };
}

export async function logIn(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  });

  if (error) {
    if (error.code === "email_not_confirmed") {
      redirect(
        `/signup/check-email?email=${encodeURIComponent(String(formData.get("email")))}`,
      );
    }
    return { error: "That email/password combination doesn't match an account." };
  }
  redirect("/dashboard");
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
