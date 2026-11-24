"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";

export async function createPost(input: { body: string; imageUrl?: string | null; projectId?: string | null }) {
  const profile = await requireProfile();
  if (!input.body.trim() && !input.imageUrl) throw new Error("Write something or attach an image first");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: profile.id,
      body: input.body.trim(),
      image_url: input.imageUrl ?? null,
      project_id: input.projectId ?? null,
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to create post");
  revalidatePath("/feed");
  return { id: data.id };
}

export async function deletePost(postId: string) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", postId).eq("author_id", profile.id);
  if (error) throw new Error(error.message);
  revalidatePath("/feed");
}

export async function toggleLike(postId: string) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", profile.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", profile.id);
  } else {
    await supabase.from("post_likes").insert({ post_id: postId, user_id: profile.id });
  }
  revalidatePath("/feed");
}

export async function addComment(postId: string, body: string) {
  const profile = await requireProfile();
  if (!body.trim()) return;
  const supabase = await createClient();

  const { error } = await supabase.from("post_comments").insert({
    post_id: postId,
    author_id: profile.id,
    body: body.trim(),
  });

  if (error) throw new Error(error.message);
  revalidatePath("/feed");
}
