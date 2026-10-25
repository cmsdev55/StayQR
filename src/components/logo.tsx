/** Placeholder mark: a 3×3 module glyph. Replace with the real logo when supplied. */
export function Logo({ size = 22 }: { size?: number }) {
  const on = [1, 1, 0, 1, 0, 1, 0, 1, 1];
  const cell = (size - 4) / 3;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {on.map((v, i) => (
        <rect
          key={i}
          x={(i % 3) * (cell + 2)}
          y={Math.floor(i / 3) * (cell + 2)}
          width={cell}
          height={cell}
          rx={1.6}
          className={v ? "fill-accent" : "fill-fg/15"}
        />
      ))}
    </svg>
  );
}
