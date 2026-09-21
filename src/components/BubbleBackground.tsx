const BUBBLE_COUNT = 18;
const TINTS = ["cyan", "pink", "green"] as const;

// 매 렌더마다 값이 바뀌면 안 되므로 Math.random 대신 인덱스 기반의
// 결정적(deterministic) 유사 난수를 사용한다.
function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 999.17) * 10000;
  return x - Math.floor(x);
}

export default function BubbleBackground() {
  const bubbles = Array.from({ length: BUBBLE_COUNT }, (_, i) => {
    const size = 14 + Math.round(pseudoRandom(i + 1) * 46);
    const left = Math.round(pseudoRandom(i + 2) * 100);
    const duration = 10 + pseudoRandom(i + 3) * 14;
    const delay = pseudoRandom(i + 4) * 18;
    const tint = TINTS[Math.floor(pseudoRandom(i + 5) * TINTS.length)];
    return { id: i, size, left, duration, delay, tint };
  });

  return (
    <div className="ggm-bubbles" aria-hidden="true">
      {bubbles.map((b) => (
        <span
          key={b.id}
          className={`ggm-bubble ggm-bubble-${b.tint}`}
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            animationDuration: `${b.duration}s`,
            animationDelay: `-${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
