import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PostCard from "@/components/PostCard";
import type { GgmPostWithAuthor } from "@/lib/types";

export default async function PostsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: posts } = await supabase
    .from("ggm_posts")
    .select("*, ggm_profiles!ggm_posts_user_id_fkey(nickname), ggm_post_likes(count)")
    .order("created_at", { ascending: false })
    .returns<GgmPostWithAuthor[]>();

  let likedPostIds = new Set<string>();
  if (user) {
    const { data: myLikes } = await supabase
      .from("ggm_post_likes")
      .select("post_id")
      .eq("user_id", user.id);
    likedPostIds = new Set((myLikes ?? []).map((l) => l.post_id));
  }

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
            <PostCard
              key={post.id}
              post={post}
              liked={likedPostIds.has(post.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
