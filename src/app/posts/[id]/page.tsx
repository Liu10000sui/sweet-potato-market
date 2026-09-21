import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deletePost } from "@/lib/actions/posts";
import { createComment } from "@/lib/actions/comments";
import { STATUS_LABELS, formatPrice } from "@/lib/posts";
import DeletePostButton from "@/components/DeletePostButton";
import LikeButton from "@/components/LikeButton";
import type { GgmComment, GgmPostWithAuthor } from "@/lib/types";

export default async function PostDetailPage({
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

  const { data: post } = await supabase
    .from("ggm_posts")
    .select("*, ggm_profiles!ggm_posts_user_id_fkey(nickname), ggm_post_likes(count)")
    .eq("id", id)
    .single<GgmPostWithAuthor>();

  if (!post) {
    notFound();
  }

  const isOwner = user?.id === post.user_id;
  const likeCount = post.ggm_post_likes?.[0]?.count ?? 0;

  let isLiked = false;
  if (user) {
    const { data: myLike } = await supabase
      .from("ggm_post_likes")
      .select("post_id")
      .eq("post_id", post.id)
      .eq("user_id", user.id)
      .maybeSingle();
    isLiked = !!myLike;
  }

  const { data: comments } = await supabase
    .from("ggm_post_comments")
    .select("*, ggm_profiles!ggm_post_comments_user_id_fkey(nickname)")
    .eq("post_id", post.id)
    .order("created_at", { ascending: true })
    .returns<GgmComment[]>();

  const boundCreateComment = createComment.bind(null, post.id);

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

        <LikeButton
          postId={post.id}
          liked={isLiked}
          count={likeCount}
          className="ggm-detail-like"
        />

        {post.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image_url}
            alt={post.title}
            className="ggm-post-detail-image"
          />
        )}

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

      <div className="ggm-post-detail ggm-comments" id="comments">
        <h2 className="ggm-comments-title">
          💬 댓글 {comments?.length ?? 0}
        </h2>

        {error && <p className="ggm-error">{error}</p>}

        {comments && comments.length > 0 ? (
          <ul className="ggm-comment-list">
            {comments.map((comment) => (
              <li key={comment.id} className="ggm-comment">
                <div className="ggm-comment-meta">
                  <span className="ggm-comment-nickname">
                    {comment.ggm_profiles?.nickname ?? "알 수 없음"}
                  </span>
                  <span>
                    {new Date(comment.created_at).toLocaleString("ko-KR")}
                  </span>
                </div>
                <p className="ggm-comment-content">{comment.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="ggm-empty ggm-comments-empty">
            아직 댓글이 없어요. 첫 댓글을 남겨보세요!
          </p>
        )}

        {user ? (
          <form action={boundCreateComment} className="ggm-comment-form">
            <textarea
              name="content"
              required
              maxLength={500}
              rows={3}
              placeholder="댓글을 남겨보세요."
            />
            <button type="submit" className="ggm-btn ggm-btn-primary">
              댓글 남기기
            </button>
          </form>
        ) : (
          <p className="ggm-comment-login-prompt">
            댓글은 회원만 남길 수 있어요.{" "}
            <Link href="/login">로그인</Link>하고 이야기 나눠보세요.
          </p>
        )}
      </div>
    </main>
  );
}
