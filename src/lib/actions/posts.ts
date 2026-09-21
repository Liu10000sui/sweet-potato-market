"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { GgmPostStatus } from "@/lib/types";

function parsePrice(value: FormDataEntryValue | null): number {
  const price = Number(String(value ?? "0").replace(/[^0-9]/g, ""));
  return Number.isFinite(price) && price >= 0 ? price : 0;
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

  if (!title || !description) {
    redirect(
      `/posts/new?error=${encodeURIComponent("제목과 설명을 모두 입력해주세요.")}`
    );
  }

  const { data, error } = await supabase
    .from("ggm_posts")
    .insert({ user_id: user.id, title, description, price })
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

  if (!title || !description) {
    redirect(
      `/posts/${id}/edit?error=${encodeURIComponent("제목과 설명을 모두 입력해주세요.")}`
    );
  }

  const { error } = await supabase
    .from("ggm_posts")
    .update({ title, description, price, status })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    redirect(
      `/posts/${id}/edit?error=${encodeURIComponent("글을 수정하지 못했어요. 다시 시도해주세요.")}`
    );
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

  await supabase.from("ggm_posts").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/posts");
  redirect("/posts");
}
