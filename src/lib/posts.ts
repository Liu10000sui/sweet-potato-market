import type { GgmPostStatus } from "@/lib/types";

export const STATUS_LABELS: Record<GgmPostStatus, string> = {
  selling: "판매중",
  reserved: "예약중",
  sold: "거래완료",
};

export function formatPrice(price: number): string {
  if (price === 0) return "나눔";
  return `${price.toLocaleString("ko-KR")}원`;
}
