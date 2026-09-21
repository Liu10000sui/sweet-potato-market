import Link from "next/link";
import BubbleBackground from "@/components/BubbleBackground";
import { requestPasswordReset } from "@/lib/actions/auth";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="ggm-auth-main">
      <BubbleBackground />
      <div className="ggm-card">
        <h1 className="ggm-card-title">🔑 비밀번호 재설정</h1>
        <p className="ggm-card-desc">
          가입할 때 쓴 이메일을 입력하면, 비밀번호 재설정 링크를 보내드려요.
        </p>
        {error && <p className="ggm-error">{error}</p>}
        <form action={requestPasswordReset} className="ggm-form">
          <label htmlFor="email">이메일</label>
          <input id="email" name="email" type="email" required autoComplete="email" />

          <button type="submit" className="ggm-btn ggm-btn-primary ggm-btn-block">
            재설정 링크 보내기
          </button>
        </form>
        <p className="ggm-switch">
          <Link href="/login">로그인으로 돌아가기</Link>
        </p>
      </div>
    </main>
  );
}
