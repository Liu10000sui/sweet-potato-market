import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 만료된 토큰을 자동으로 갱신하기 위해 반드시 호출해야 함
  const { error } = await supabase.auth.getUser();

  // 세션이 가리키는 계정이 이미 지워진 경우(예: 테스트 계정 정리) 조용히
  // 계속 실패하지 않도록, 로그아웃 상태로 정리해서 쿠키를 지움
  if (error && (error.code === "user_not_found" || error.code === "session_not_found")) {
    await supabase.auth.signOut();
  }

  return supabaseResponse;
}
