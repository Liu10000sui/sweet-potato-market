import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deletePost } from "@/lib/actions/posts";
import { STATUS_LABELS, formatPrice } from "@/lib/posts";
import DeletePostButton from "@/components/DeletePostButton";
import type { GgmPostWithAuthor } from "@/lib/types";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: post } = await supabase
    .from("ggm_posts")
    .select("*, ggm_profiles(nickname)")
    .eq("id", id)
    .single<GgmPostWithAuthor>();

  if (!post) {
    notFound();
  }

  const isOwner = user?.id === post.user_id;

  return (
    <main className="ggm-posts-main">
      <div className="ggm-post-detail">
        <div className="ggm-post-card-top">
          <span className={`ggm-badge ggm-badge-${post.status}`}>
            {STATUS_LABELS[post.status]}
          </span>
          <span className="ggm-post-price">{formatPrice(post.price)}</span>
        </div>

        <h1 className="ggm-post-detail-title">{post.title}</h1>
        <div className="ggm-post-card-meta">
          <span>{post.ggm_profiles?.nickname ?? "알 수 없음"}</span>
          <span>{new Date(post.created_at).toLocaleString("ko-KR")}</span>
        </div>

        <p className="ggm-post-detail-desc">{post.description}</p>

        <div className="ggm-post-detail-actions">
          <Link href="/posts" className="ggm-btn ggm-btn-ghost">
            목록으로
          </Link>
          {isOwner && (
            <>
              <Link href={`/posts/${post.id}/edit`} className="ggm-btn ggm-btn-ghost">
                수정
              </Link>
              <DeletePostButton action={deletePost.bind(null, post.id)} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
