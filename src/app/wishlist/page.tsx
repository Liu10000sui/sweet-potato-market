import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PostCard from "@/components/PostCard";
import type { GgmPostWithAuthor } from "@/lib/types";

type LikeRow = {
  post_id: string;
  ggm_posts: GgmPostWithAuthor | null;
};

export default async function WishlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: likes } = await supabase
    .from("ggm_post_likes")
    .select(
      "post_id, ggm_posts(*, ggm_profiles!ggm_posts_user_id_fkey(nickname), ggm_post_likes(count))"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<LikeRow[]>();

  const posts = (likes ?? [])
    .map((like) => like.ggm_posts)
    .filter((post): post is GgmPostWithAuthor => post !== null);

  return (
    <main className="ggm-posts-main">
      <div className="ggm-posts-header">
        <h1 className="ggm-page-title">🧡 찜한 상품</h1>
      </div>

      {posts.length === 0 ? (
        <p className="ggm-empty">
          아직 찜한 상품이 없어요. 장터에서 마음에 드는 글에 하트를 눌러보세요!
          🫧
        </p>
      ) : (
        <div className="ggm-post-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} liked />
          ))}
        </div>
      )}
    </main>
  );
}
