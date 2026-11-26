"use server";

import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
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

  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password: String(formData.get("password")),
    options: { data },
  });

  if (error) return { error: error.message };
  if (signUpData.session) redirect("/dashboard");
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

  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal && aal.nextLevel === "aal2" && aal.currentLevel !== aal.nextLevel) {
    redirect("/login/mfa");
  }

  redirect("/dashboard");
}

export async function confirmEmail(formData: FormData) {
  const token_hash = String(formData.get("token_hash"));
  const type = formData.get("type") as EmailOtpType;
  const next = String(formData.get("next") || "/dashboard");

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash });

  if (error) redirect("/login?error=confirmation_failed");
  redirect(next);
}

export type RequestResetState = { sent: boolean; error: string | null };

export async function requestPasswordReset(
  _prev: RequestResetState,
  formData: FormData,
): Promise<RequestResetState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { sent: false, error: "Enter your email address." };

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://app.provah.live";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/confirm?next=/auth/reset-password`,
  });

  // Supabase returns success even for unknown emails (anti-enumeration);
  // surface that same ambiguity to the user rather than confirming an account exists.
  if (error && error.code !== "over_email_send_rate_limit") {
    return { sent: false, error: error.message };
  }
  return { sent: true, error: null };
}

export type ResetPasswordState = { error: string | null };

export async function resetPassword(
  _prev: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "That reset link has expired. Request a new one." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  redirect("/dashboard");
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // signOut() only clears the auth cookie under the currently-configured
  // domain (.provah.live in production). A session started before the
  // app.provah.live/provah.live split rolled out is host-scoped instead
  // (app.provah.live only) and survives that clear as a separate cookie —
  // explicitly expire both scopes so no stale session lingers.
  const cookieStore = await cookies();
  for (const { name } of cookieStore.getAll()) {
    if (!name.startsWith("sb-")) continue;
    cookieStore.set(name, "", { expires: new Date(0), path: "/" });
    if (process.env.NEXT_PUBLIC_COOKIE_DOMAIN) {
      cookieStore.set(name, "", {
        expires: new Date(0),
        path: "/",
        domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
      });
    }
  }

  redirect("/login");
}
