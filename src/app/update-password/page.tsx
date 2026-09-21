import { redirect } from "next/navigation";
import BubbleBackground from "@/components/BubbleBackground";
import { createClient } from "@/lib/supabase/server";
import { resetPassword } from "@/lib/actions/auth";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/forgot-password?error=${encodeURIComponent("링크가 만료됐어요. 다시 요청해주세요.")}`
    );
  }

  return (
    <main className="ggm-auth-main">
      <BubbleBackground />
      <div className="ggm-card">
        <h1 className="ggm-card-title">🔑 새 비밀번호 설정</h1>
        {error && <p className="ggm-error">{error}</p>}
        <form action={resetPassword} className="ggm-form">
          <label htmlFor="newPassword">새 비밀번호</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            minLength={6}
            placeholder="6자 이상"
            autoComplete="new-password"
          />

          <label htmlFor="confirmPassword">새 비밀번호 확인</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
          />

          <button type="submit" className="ggm-btn ggm-btn-primary ggm-btn-block">
            비밀번호 재설정하기
          </button>
        </form>
      </div>
    </main>
  );
}
