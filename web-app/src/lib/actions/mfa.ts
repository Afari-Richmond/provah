"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";

export type MfaFactor = { id: string; status: "verified" | "unverified"; createdAt: string };

export async function listMfaFactors(): Promise<MfaFactor[]> {
  await requireProfile();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.mfa.listFactors();
  if (error || !data) return [];
  return data.totp.map((f) => ({ id: f.id, status: f.status, createdAt: f.created_at }));
}

export async function enrollMfa() {
  await requireProfile();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
  if (error) throw new Error(error.message);
  return { factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret };
}

export async function cancelMfaEnrollment(factorId: string) {
  await requireProfile();
  const supabase = await createClient();
  await supabase.auth.mfa.unenroll({ factorId });
}

export async function verifyMfaEnrollment(factorId: string, code: string) {
  await requireProfile();
  const supabase = await createClient();

  const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
  if (challengeError) throw new Error(challengeError.message);

  const { error } = await supabase.auth.mfa.verify({ factorId, challengeId: challenge.id, code });
  if (error) throw new Error("That code didn't work. Check your authenticator app and try again.");
}

export async function unenrollMfa(factorId: string) {
  await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.auth.mfa.unenroll({ factorId });
  if (error) throw new Error(error.message);
}

export type MfaChallengeState = { error: string | null };

export async function verifyMfaChallenge(
  _prev: MfaChallengeState,
  formData: FormData,
): Promise<MfaChallengeState> {
  const code = String(formData.get("code") ?? "").trim();
  if (!code) return { error: "Enter the 6-digit code from your authenticator app." };

  const supabase = await createClient();
  const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
  const factor = factors?.totp.find((f) => f.status === "verified");
  if (factorsError || !factor) return { error: "No two-factor method found for this account." };

  const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
    factorId: factor.id,
  });
  if (challengeError) return { error: challengeError.message };

  const { error } = await supabase.auth.mfa.verify({
    factorId: factor.id,
    challengeId: challenge.id,
    code,
  });
  if (error) return { error: "That code is incorrect or expired. Try again." };

  redirect("/dashboard");
}
