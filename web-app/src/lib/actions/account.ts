"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireProfile } from "@/lib/auth";

export type AccountFormState = { error: string | null; success?: boolean };

export async function updateAccount(
  _prev: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const supabase = await createClient();
  const password = String(formData.get("password") ?? "");

  if (!password) return { error: null, success: true };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { error: null, success: true };
}

export async function deleteAccount() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const admin = createAdminClient();

  await admin.auth.admin.deleteUser(profile.id);
  await supabase.auth.signOut();
  redirect("/login");
}
