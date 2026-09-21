import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { STATUS_LABELS, formatPrice } from "@/lib/posts";
import type { GgmPostWithAuthor } from "@/lib/types";

export default async function PostsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: posts } = await supabase
    .from("ggm_posts")
    .select("*, ggm_profiles(nickname)")
    .order("created_at", { ascending: false })
    .returns<GgmPostWithAuthor[]>();

  return (
    <main className="ggm-posts-main">
      <div className="ggm-posts-header">
        <h1 className="ggm-page-title">🍠 장터</h1>
        {user ? (
          <Link href="/posts/new" className="ggm-btn ggm-btn-primary">
            글쓰기
          </Link>
        ) : (
          <Link href="/login" className="ggm-btn ggm-btn-ghost">
            로그인하고 글쓰기
          </Link>
        )}
      </div>

      {!posts || posts.length === 0 ? (
        <p className="ggm-empty">
          아직 등록된 거래글이 없어요. 첫 거래글을 남겨보세요! 🫧
        </p>
      ) : (
        <div className="ggm-post-grid">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="ggm-post-card"
            >
              <div className="ggm-post-card-top">
                <span className={`ggm-badge ggm-badge-${post.status}`}>
                  {STATUS_LABELS[post.status]}
                </span>
                <span className="ggm-post-price">{formatPrice(post.price)}</span>
              </div>
              <h2 className="ggm-post-card-title">{post.title}</h2>
              <p className="ggm-post-card-desc">{post.description}</p>
              <div className="ggm-post-card-meta">
                <span>{post.ggm_profiles?.nickname ?? "알 수 없음"}</span>
                <span>{new Date(post.created_at).toLocaleDateString("ko-KR")}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
