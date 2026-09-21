export type DragonPalette = {
  body: string;
  belly: string;
  outline: string;
  foot: string;
};

// 16(가로) x 13(세로) 픽셀 그리드로 그린 보글보글풍 방울 드래곤 마스코트.
// . 배경 / B 몸통 / b 배 / S 외곽선(뿔,꼬리) / E 눈흰자 / P 눈동자 / F 발
const GRID = [
  "....S.....S....",
  "..BBBBBBBBBBBB..",
  ".BBBBBBBBBBBBBB.",
  ".BBBBEEBBEEBBBB.",
  ".BBBBEPBBPEBBBB.",
  ".BBBBBBBBBBBBBB.",
  ".BBBBBBBBBBBBBB.",
  ".BBBBbbbbbbBBBB.",
  "..BBbbbbbbbbBBS.",
  "...BBbbbbbbBB...",
  "....BBBBBBBB....",
  "....FF....FF....",
  "....FF....FF....",
];

const CELL = 7;
const COLS = GRID[0].length;
const ROWS = GRID.length;

export default function PixelDragon({
  id,
  palette,
  flip = false,
  className,
}: {
  id: string;
  palette: DragonPalette;
  flip?: boolean;
  className?: string;
}) {
  const colorOf: Record<string, string> = {
    B: palette.body,
    b: palette.belly,
    S: palette.outline,
    F: palette.foot,
    E: "#ffffff",
    P: "#16223f",
  };

  const mouthX = flip ? 1 * CELL : (COLS - 1) * CELL;
  const mouthY = 5.5 * CELL;

  return (
    <svg
      viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
      width={COLS * CELL}
      height={ROWS * CELL}
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      role="img"
      aria-label="고구마마켓 보글보글 마스코트"
    >
      {GRID.map((row, y) =>
        row.split("").map((cell, x) => {
          if (cell === ".") return null;
          return (
            <rect
              key={`${id}-${x}-${y}`}
              x={x * CELL}
              y={y * CELL}
              width={CELL}
              height={CELL}
              fill={colorOf[cell]}
            />
          );
        })
      )}
      <circle
        cx={mouthX}
        cy={mouthY}
        r={CELL * 0.9}
        fill="rgba(255,255,255,0.35)"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1"
      />
    </svg>
  );
}
