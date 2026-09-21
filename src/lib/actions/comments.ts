"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createComment(postId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const content = String(formData.get("content") ?? "").trim();

  if (!content) {
    redirect(
      `/posts/${postId}?error=${encodeURIComponent("댓글 내용을 입력해주세요.")}#comments`
    );
  }

  const { error } = await supabase
    .from("ggm_post_comments")
    .insert({ post_id: postId, user_id: user.id, content });

  if (error) {
    redirect(
      `/posts/${postId}?error=${encodeURIComponent("댓글을 남기지 못했어요. 다시 시도해주세요.")}#comments`
    );
  }

  revalidatePath(`/posts/${postId}`);
  redirect(`/posts/${postId}#comments`);
}
