import Link from "next/link";
import BubbleBackground from "@/components/BubbleBackground";
import { signup } from "@/lib/actions/auth";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="ggm-auth-main">
      <BubbleBackground />
      <div className="ggm-card">
        <h1 className="ggm-card-title">🫧 회원가입</h1>
        {error && <p className="ggm-error">{error}</p>}
        <form action={signup} className="ggm-form">
          <label htmlFor="nickname">닉네임</label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            required
            minLength={2}
            maxLength={20}
            placeholder="동네에서 불릴 이름"
          />

          <label htmlFor="email">이메일</label>
          <input id="email" name="email" type="email" required autoComplete="email" />

          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="6자 이상"
            autoComplete="new-password"
          />

          <button type="submit" className="ggm-btn ggm-btn-primary ggm-btn-block">
            가입하기
          </button>
        </form>
        <p className="ggm-switch">
          이미 계정이 있나요? <Link href="/login">로그인</Link>
        </p>
      </div>
    </main>
  );
}
