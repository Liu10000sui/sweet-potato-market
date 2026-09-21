import Link from "next/link";
import BubbleBackground from "@/components/BubbleBackground";

export default function CheckEmailPage() {
  return (
    <main className="ggm-auth-main">
      <BubbleBackground />
      <div className="ggm-card ggm-card-center">
        <h1 className="ggm-card-title">📮 메일함을 확인해주세요</h1>
        <p className="ggm-card-desc">
          가입 확인 메일을 보냈어요. 메일 속 링크를 눌러 인증을 완료하면
          로그인할 수 있어요.
        </p>
        <Link href="/login" className="ggm-btn ggm-btn-primary">
          로그인 화면으로
        </Link>
      </div>
    </main>
  );
}
