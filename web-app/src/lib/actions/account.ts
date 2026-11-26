"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireProfile } from "@/lib/auth";
import type { NotificationPreferences } from "@/lib/types";

export type AccountFormState = { error: string | null; success?: boolean };

export async function updateAccount(
  _prev: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const supabase = await createClient();
  const password = String(formData.get("password") ?? "");

  if (!password) return { error: null, success: true };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const currentPassword = String(formData.get("currentPassword") ?? "");
  if (!currentPassword) return { error: "Enter your current password to confirm this change." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { error: "Couldn't verify your session. Log in again." };

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (verifyError) return { error: "Your current password is incorrect." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { error: null, success: true };
}

export async function updateNotificationPreferences(prefs: NotificationPreferences) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      notification_preferences: {
        messages: prefs.messages,
        connections: prefs.connections,
        project_updates: prefs.projectUpdates,
      },
    })
    .eq("id", profile.id);
  if (error) throw new Error(error.message);
}

export type DeleteAccountState = { error: string | null };

export async function deleteAccount(
  _prev: DeleteAccountState,
  formData: FormData,
): Promise<DeleteAccountState> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const password = String(formData.get("password") ?? "");

  if (!password) return { error: "Enter your password to confirm." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { error: "Couldn't verify your session. Log in again." };

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });
  if (verifyError) return { error: "That password is incorrect." };

  const admin = createAdminClient();
  await admin.auth.admin.deleteUser(profile.id);
  await supabase.auth.signOut();
  redirect("/login");
}
