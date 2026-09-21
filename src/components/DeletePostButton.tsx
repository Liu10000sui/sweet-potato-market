"use client";

import { useState } from "react";

export default function DeletePostButton({
  action,
}: {
  action: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        className="ggm-btn ggm-btn-danger"
        onClick={() => setConfirming(true)}
      >
        삭제
      </button>
    );
  }

  return (
    <div className="ggm-delete-confirm">
      <span className="ggm-delete-confirm-text">정말 삭제할까요?</span>
      <form action={action}>
        <button type="submit" className="ggm-btn ggm-btn-danger">
          네, 삭제
        </button>
      </form>
      <button
        type="button"
        className="ggm-btn ggm-btn-ghost"
        onClick={() => setConfirming(false)}
      >
        취소
      </button>
    </div>
  );
}
