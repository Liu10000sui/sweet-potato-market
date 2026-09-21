import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updatePost } from "@/lib/actions/posts";
import { STATUS_LABELS } from "@/lib/posts";
import type { GgmPost } from "@/lib/types";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: post } = await supabase
    .from("ggm_posts")
    .select("*")
    .eq("id", id)
    .single<GgmPost>();

  if (!post) {
    notFound();
  }

  if (post.user_id !== user.id) {
    redirect(`/posts/${id}`);
  }

  const boundUpdatePost = updatePost.bind(null, id);

  return (
    <main className="ggm-auth-main">
      <div className="ggm-card ggm-card-wide">
        <h1 className="ggm-card-title">🍠 거래글 수정</h1>
        {error && <p className="ggm-error">{error}</p>}
        <form action={boundUpdatePost} className="ggm-form">
          <label htmlFor="title">제목</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            maxLength={60}
            defaultValue={post.title}
          />

          <label htmlFor="price">가격 (원)</label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            step={100}
            defaultValue={post.price}
          />

          <label htmlFor="status">거래 상태</label>
          <select id="status" name="status" defaultValue={post.status}>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <label htmlFor="description">설명</label>
          <textarea
            id="description"
            name="description"
            required
            rows={6}
            maxLength={2000}
            defaultValue={post.description}
          />

          <button type="submit" className="ggm-btn ggm-btn-primary ggm-btn-block">
            수정 완료
          </button>
        </form>
      </div>
    </main>
  );
}
