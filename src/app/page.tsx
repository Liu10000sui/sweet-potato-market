import Link from "next/link";
import BubbleBackground from "@/components/BubbleBackground";
import PixelDragon from "@/components/PixelDragon";
import { createClient } from "@/lib/supabase/server";
import type { GgmProfile } from "@/lib/types";

const GREEN_PALETTE = {
  body: "#58e06e",
  belly: "#c9f7d1",
  outline: "#1e9c3f",
  foot: "#ffb627",
};

const ORANGE_PALETTE = {
  body: "#ffb627",
  belly: "#ffe6b3",
  outline: "#d9860f",
  foot: "#ff6fcf",
};

const FEATURES = [
  {
    emoji: "🍠",
    title: "우리 동네 중고거래",
    desc: "이웃들과 함께 안 쓰는 물건을 나누고, 필요한 물건을 찾아보세요.",
  },
  {
    emoji: "🫧",
    title: "가볍고 즐거운 거래",
    desc: "보글보글 거품처럼 부담 없이, 편하게 이야기 나눠요.",
  },
  {
    emoji: "🎮",
    title: "레트로 아케이드 감성",
    desc: "고전 게임에서 영감을 받은 픽셀 디자인으로 꾸민 우리 동네 장터예요.",
  },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let nickname: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("ggm_profiles")
      .select("nickname")
      .eq("id", user.id)
      .single<GgmProfile>();
    nickname = profile?.nickname ?? null;
  }

  return (
    <main className="ggm-main">
      <BubbleBackground />

      <section className="ggm-hero">
        <div className="ggm-hero-row">
          <PixelDragon
            id="mascot-left"
            palette={GREEN_PALETTE}
            className="ggm-mascot"
          />

          <div className="ggm-hero-text">
            <h1 className="ggm-title">
              <span className="ggm-logo-emoji">🍠</span> 고구마마켓
            </h1>
            <p className="ggm-subtitle">
              보글보글 거품처럼 가볍게, 우리 동네 중고거래
            </p>
            <p className="ggm-intro">
              고구마마켓은 우리 동네 이웃들과 안 쓰는 물건을 나누고, 필요한 물건을 찾을 수 있는 공간이에요. 어려운 절차 없이 회원가입 한 번만 하면 바로 이웃과 거래를 시작할 수 있어요.
            </p>

            {user ? (
              <p className="ggm-welcome">
                {nickname ?? user.email}님, 환영합니다! 오늘도 좋은 거래
                되세요 🫧
              </p>
            ) : (
              <div className="ggm-cta-group">
                <Link
                  href="/signup"
                  className="ggm-btn ggm-btn-primary ggm-btn-lg"
                >
                  회원가입하기
                </Link>
                <Link href="/login" className="ggm-btn ggm-btn-ghost ggm-btn-lg">
                  로그인
                </Link>
              </div>
            )}
          </div>

          <PixelDragon
            id="mascot-right"
            palette={ORANGE_PALETTE}
            flip
            className="ggm-mascot"
          />
        </div>
      </section>

      <section className="ggm-features">
        {FEATURES.map((f) => (
          <div key={f.title} className="ggm-feature-card">
            <div className="ggm-feature-emoji">{f.emoji}</div>
            <h2 className="ggm-feature-title">{f.title}</h2>
            <p className="ggm-feature-desc">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
