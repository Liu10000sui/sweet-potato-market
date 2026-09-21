"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { translateAuthError } from "@/lib/actions/auth-errors";

async function getOrigin() {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(translateAuthError(error.message))}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const nickname = String(formData.get("nickname") ?? "").trim();

  if (nickname.length < 2) {
    redirect(
      `/signup?error=${encodeURIComponent("닉네임은 2자 이상이어야 해요.")}`
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nickname } },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(translateAuthError(error.message))}`);
  }

  if (data.session) {
    // 이메일 인증이 꺼져 있어 가입 즉시 로그인된 경우
    revalidatePath("/", "layout");
    redirect("/");
  }

  redirect("/signup/check-email");
}

export async function changePassword(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < 6) {
    redirect(
      `/mypage?error=${encodeURIComponent("새 비밀번호는 6자 이상이어야 해요.")}`
    );
  }

  if (newPassword !== confirmPassword) {
    redirect(
      `/mypage?error=${encodeURIComponent("새 비밀번호가 서로 일치하지 않아요.")}`
    );
  }

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (verifyError) {
    redirect(
      `/mypage?error=${encodeURIComponent("현재 비밀번호가 올바르지 않아요.")}`
    );
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    redirect(`/mypage?error=${encodeURIComponent(translateAuthError(error.message))}`);
  }

  redirect(`/mypage?success=${encodeURIComponent("비밀번호가 변경됐어요.")}`);
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    redirect(
      `/forgot-password?error=${encodeURIComponent("이메일을 입력해주세요.")}`
    );
  }

  const origin = await getOrigin();

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  });

  // 가입 여부와 관계없이 항상 같은 안내를 보여줘서 이메일 가입 여부가 노출되지 않게 함
  redirect("/forgot-password/check-email");
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/forgot-password?error=${encodeURIComponent("링크가 만료됐어요. 다시 요청해주세요.")}`
    );
  }

  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < 6) {
    redirect(
      `/update-password?error=${encodeURIComponent("새 비밀번호는 6자 이상이어야 해요.")}`
    );
  }

  if (newPassword !== confirmPassword) {
    redirect(
      `/update-password?error=${encodeURIComponent("새 비밀번호가 서로 일치하지 않아요.")}`
    );
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    redirect(
      `/update-password?error=${encodeURIComponent(translateAuthError(error.message))}`
    );
  }

  await supabase.auth.signOut();
  redirect(
    `/login?success=${encodeURIComponent("비밀번호가 변경됐어요. 새 비밀번호로 로그인해주세요.")}`
  );
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
