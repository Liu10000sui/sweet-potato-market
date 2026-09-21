import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createPost } from "@/lib/actions/posts";

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await searchParams;

  return (
    <main className="ggm-auth-main">
      <div className="ggm-card ggm-card-wide">
        <h1 className="ggm-card-title">🍠 거래글 작성</h1>
        {error && <p className="ggm-error">{error}</p>}
        <form action={createPost} className="ggm-form">
          <label htmlFor="title">제목</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            maxLength={60}
            placeholder="무엇을 나누거나 판매하시나요?"
          />

          <label htmlFor="price">가격 (원)</label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            step={100}
            defaultValue={0}
            placeholder="0원이면 나눔으로 표시돼요"
          />

          <label htmlFor="description">설명</label>
          <textarea
            id="description"
            name="description"
            required
            rows={6}
            maxLength={2000}
            placeholder="상태, 거래 방법 등을 자세히 적어주세요."
          />

          <button type="submit" className="ggm-btn ggm-btn-primary ggm-btn-block">
            등록하기
          </button>
        </form>
      </div>
    </main>
  );
}
