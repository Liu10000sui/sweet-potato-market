"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { GgmPostStatus } from "@/lib/types";

const IMAGE_BUCKET = "ggm-post-images";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

function parsePrice(value: FormDataEntryValue | null): number {
  const price = Number(String(value ?? "0").replace(/[^0-9]/g, ""));
  return Number.isFinite(price) && price >= 0 ? price : 0;
}

async function uploadPostImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  if (file.size > MAX_IMAGE_SIZE) {
    return { url: null, error: "사진 크기는 5MB 이하여야 해요." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file);

  if (error) {
    return { url: null, error: "사진을 올리지 못했어요. 다시 시도해주세요." };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);

  return { url: publicUrl, error: null };
}

async function deletePostImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  imageUrl: string
) {
  const marker = `/${IMAGE_BUCKET}/`;
  const idx = imageUrl.indexOf(marker);
  if (idx === -1) return;
  const path = imageUrl.slice(idx + marker.length);
  await supabase.storage.from(IMAGE_BUCKET).remove([path]);
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = parsePrice(formData.get("price"));
  const imageFile = formData.get("image") as File | null;

  if (!title || !description) {
    redirect(
      `/posts/new?error=${encodeURIComponent("제목과 설명을 모두 입력해주세요.")}`
    );
  }

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    const uploaded = await uploadPostImage(supabase, user.id, imageFile);
    if (uploaded.error) {
      redirect(`/posts/new?error=${encodeURIComponent(uploaded.error)}`);
    }
    imageUrl = uploaded.url;
  }

  const { data, error } = await supabase
    .from("ggm_posts")
    .insert({ user_id: user.id, title, description, price, image_url: imageUrl })
    .select("id")
    .single();

  if (error || !data) {
    redirect(
      `/posts/new?error=${encodeURIComponent("글을 등록하지 못했어요. 다시 시도해주세요.")}`
    );
  }

  revalidatePath("/posts");
  redirect(`/posts/${data.id}`);
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = parsePrice(formData.get("price"));
  const status = String(formData.get("status") ?? "selling") as GgmPostStatus;
  const imageFile = formData.get("image") as File | null;

  if (!title || !description) {
    redirect(
      `/posts/${id}/edit?error=${encodeURIComponent("제목과 설명을 모두 입력해주세요.")}`
    );
  }

  const updates: Record<string, unknown> = { title, description, price, status };
  let oldImageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const { data: existing } = await supabase
      .from("ggm_posts")
      .select("image_url")
      .eq("id", id)
      .single();
    oldImageUrl = existing?.image_url ?? null;

    const uploaded = await uploadPostImage(supabase, user.id, imageFile);
    if (uploaded.error) {
      redirect(`/posts/${id}/edit?error=${encodeURIComponent(uploaded.error)}`);
    }
    updates.image_url = uploaded.url;
  }

  const { error } = await supabase
    .from("ggm_posts")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    redirect(
      `/posts/${id}/edit?error=${encodeURIComponent("글을 수정하지 못했어요. 다시 시도해주세요.")}`
    );
  }

  if (oldImageUrl) {
    await deletePostImage(supabase, oldImageUrl);
  }

  revalidatePath("/posts");
  revalidatePath(`/posts/${id}`);
  redirect(`/posts/${id}`);
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: post } = await supabase
    .from("ggm_posts")
    .select("image_url")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  await supabase.from("ggm_posts").delete().eq("id", id).eq("user_id", user.id);

  if (post?.image_url) {
    await deletePostImage(supabase, post.image_url);
  }

  revalidatePath("/posts");
  redirect("/posts");
}

export async function toggleLike(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: existing } = await supabase
    .from("ggm_post_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("ggm_post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);
  } else {
    await supabase
      .from("ggm_post_likes")
      .insert({ post_id: postId, user_id: user.id });
  }

  revalidatePath("/posts");
  revalidatePath(`/posts/${postId}`);
  revalidatePath("/wishlist");
}
