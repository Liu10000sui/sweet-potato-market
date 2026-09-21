import Link from "next/link";
import BubbleBackground from "@/components/BubbleBackground";
import { login } from "@/lib/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;

  return (
    <main className="ggm-auth-main">
      <BubbleBackground />
      <div className="ggm-card">
        <h1 className="ggm-card-title">🫧 로그인</h1>
        {error && <p className="ggm-error">{error}</p>}
        {success && <p className="ggm-success">{success}</p>}
        <form action={login} className="ggm-form">
          <label htmlFor="email">이메일</label>
          <input id="email" name="email" type="email" required autoComplete="email" />

          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="current-password"
          />

          <button type="submit" className="ggm-btn ggm-btn-primary ggm-btn-block">
            로그인
          </button>
        </form>
        <p className="ggm-switch">
          <Link href="/forgot-password">비밀번호를 잊으셨나요?</Link>
        </p>
        <p className="ggm-switch">
          아직 계정이 없나요? <Link href="/signup">회원가입</Link>
        </p>
      </div>
    </main>
  );
}
