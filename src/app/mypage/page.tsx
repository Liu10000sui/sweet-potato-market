import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { changePassword } from "@/lib/actions/auth";
import type { GgmProfile } from "@/lib/types";

export default async function MyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("ggm_profiles")
    .select("nickname, created_at")
    .eq("id", user.id)
    .single<GgmProfile>();

  return (
    <main className="ggm-mypage-main">
      <div className="ggm-card ggm-card-wide">
        <h1 className="ggm-card-title">🍠 마이페이지</h1>
        <dl className="ggm-info-list">
          <div className="ggm-info-row">
            <dt>닉네임</dt>
            <dd>{profile?.nickname ?? "-"}</dd>
          </div>
          <div className="ggm-info-row">
            <dt>이메일</dt>
            <dd>{user.email}</dd>
          </div>
          <div className="ggm-info-row">
            <dt>가입일</dt>
            <dd>
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString("ko-KR")
                : "-"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="ggm-card ggm-card-wide">
        <h2 className="ggm-card-title">🔒 비밀번호 변경</h2>
        {error && <p className="ggm-error">{error}</p>}
        {success && <p className="ggm-success">{success}</p>}
        <form action={changePassword} className="ggm-form">
          <label htmlFor="currentPassword">현재 비밀번호</label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
          />

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
            비밀번호 변경하기
          </button>
        </form>
      </div>
    </main>
  );
}
