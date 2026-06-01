import { useMemo } from "react";

export function Confetti({ count = 40 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 8,
        color: Math.random() > 0.5 ? "var(--brand-yellow)" : "var(--brand-green)",
        size: 6 + Math.random() * 8,
        rotate: Math.random() * 360,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="animate-confetti absolute top-0 block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.4,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
            borderRadius: 2,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );
}
