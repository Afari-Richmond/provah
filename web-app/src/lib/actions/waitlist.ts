"use server";

import { createClient } from "@/lib/supabase/server";

export type WaitlistState = { status: "idle" | "success" | "error"; message?: string };

export async function joinMobileWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const email = String(formData.get("email") || "").trim();
  if (!email) return { status: "error", message: "Enter a valid email." };

  const supabase = await createClient();
  const { error } = await supabase.from("mobile_waitlist").insert({ email });

  if (error && error.code !== "23505") {
    return { status: "error", message: "Something went wrong. Try again." };
  }

  return { status: "success" };
}
