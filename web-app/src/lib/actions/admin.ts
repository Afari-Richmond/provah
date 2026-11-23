"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";

export async function toggleUserSuspension(userId: string, suspend: boolean) {
  await requireRole("admin");
  const supabase = await createClient();
  await supabase.from("profiles").update({ suspended: suspend }).eq("id", userId);
  revalidatePath("/admin/users");
}

export async function decideProfessionalVerification(userId: string, approve: boolean) {
  await requireRole("admin");
  const supabase = await createClient();

  if (approve) {
    await supabase.from("profiles").update({ verified: true }).eq("id", userId);
  } else {
    await supabase.from("profiles").update({ suspended: true }).eq("id", userId);
  }
  revalidatePath("/admin/professionals");
}
