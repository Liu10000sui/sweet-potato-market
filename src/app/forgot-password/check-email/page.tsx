import Link from "next/link";
import BubbleBackground from "@/components/BubbleBackground";

export default function ForgotPasswordCheckEmailPage() {
  return (
    <main className="ggm-auth-main">
      <BubbleBackground />
      <div className="ggm-card ggm-card-center">
        <h1 className="ggm-card-title">📮 메일함을 확인해주세요</h1>
        <p className="ggm-card-desc">
          입력하신 이메일로 가입된 계정이 있다면, 비밀번호 재설정 링크를
          보내드렸어요. 메일 속 링크를 눌러 새 비밀번호를 설정해주세요.
        </p>
        <Link href="/login" className="ggm-btn ggm-btn-primary">
          로그인 화면으로
        </Link>
      </div>
    </main>
  );
}
