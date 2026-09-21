import Link from "next/link";
import LikeButton from "@/components/LikeButton";
import { STATUS_LABELS, formatPrice } from "@/lib/posts";
import type { GgmPostWithAuthor } from "@/lib/types";

export default function PostCard({
  post,
  liked,
}: {
  post: GgmPostWithAuthor;
  liked: boolean;
}) {
  const likeCount = post.ggm_post_likes?.[0]?.count ?? 0;

  return (
    <div className="ggm-post-card">
      <LikeButton
        postId={post.id}
        liked={liked}
        count={likeCount}
        className="ggm-post-card-like"
      />
      <Link href={`/posts/${post.id}`} className="ggm-post-card-link">
        <div className="ggm-post-card-thumb">
          {post.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.image_url} alt={post.title} />
          ) : (
            <span className="ggm-post-card-thumb-placeholder">🍠</span>
          )}
        </div>
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
    </div>
  );
}
