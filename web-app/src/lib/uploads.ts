"use client";

import { createClient } from "@/lib/supabase/client";

/**
 * Uploads a file to a storage bucket under the current user's own folder
 * (required by the bucket's RLS policies: `(storage.foldername(name))[1] =
 * auth.uid()`) and returns its public URL.
 */
export async function uploadToBucket(
  bucket: "avatars" | "project-media",
  userId: string,
  file: File,
): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
