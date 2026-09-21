import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth";
import type { GgmProfile } from "@/lib/types";

export default async function Header() {
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
    <header className="ggm-header">
      <Link href="/" className="ggm-logo">
        <span className="ggm-logo-emoji">🍠</span> 고구마마켓
      </Link>
      <nav className="ggm-nav">
        <Link href="/posts" className="ggm-btn ggm-btn-ghost">
          장터
        </Link>
        {user ? (
          <>
            <Link href="/posts/new" className="ggm-btn ggm-btn-primary">
              글쓰기
            </Link>
            <span className="ggm-nickname">
              {nickname ?? user.email} 님
            </span>
            <form action={logout}>
              <button type="submit" className="ggm-btn ggm-btn-ghost">
                로그아웃
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="ggm-btn ggm-btn-ghost">
              로그인
            </Link>
            <Link href="/signup" className="ggm-btn ggm-btn-primary">
              회원가입
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
