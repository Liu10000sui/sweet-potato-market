import { toggleLike } from "@/lib/actions/posts";

export default function LikeButton({
  postId,
  liked,
  count,
  className,
}: {
  postId: string;
  liked: boolean;
  count: number;
  className?: string;
}) {
  return (
    <form action={toggleLike.bind(null, postId)} className={className}>
      <button
        type="submit"
        className={`ggm-like-btn ${liked ? "ggm-like-btn-active" : ""}`}
        aria-label={liked ? "찜 취소하기" : "찜하기"}
      >
        <span>{liked ? "❤️" : "🤍"}</span>
        <span>{count}</span>
      </button>
    </form>
  );
}
