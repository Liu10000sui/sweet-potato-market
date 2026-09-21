"use client";

export default function DeletePostButton({
  action,
}: {
  action: () => void;
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        className="ggm-btn ggm-btn-danger"
        onClick={(e) => {
          if (!confirm("정말 삭제할까요? 삭제하면 되돌릴 수 없어요.")) {
            e.preventDefault();
          }
        }}
      >
        삭제
      </button>
    </form>
  );
}
