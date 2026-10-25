/**
 * Mark A, "The Lit Core": a rounded finder ring (stroke 4 on a 32 grid) around a lime 11×11 core (rx 3.2).
 * The ring takes the text colour; on light grounds the core gets a hairline ink stroke so lime holds its edge.
 * Geometry is shared with app/icon.svg, the apple icon, the OG image and the final-CTA ParticleField.
 */
export const MARK = {
  grid: 32,
  ring: { inset: 2, size: 28, stroke: 4, rx: 7 },
  core: { inset: 10.5, size: 11, rx: 3.2 },
} as const;

export function Logo({ size = 22, title }: { size?: number; title?: string }) {
  const { ring, core } = MARK;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <rect x={ring.inset} y={ring.inset} width={ring.size} height={ring.size} rx={ring.rx} fill="none" strokeWidth={ring.stroke} className="stroke-fg" />
      <rect
        x={core.inset}
        y={core.inset}
        width={core.size}
        height={core.size}
        rx={core.rx}
        className="fill-accent [[data-theme=light]_&]:stroke-fg/80"
        strokeWidth={0.75}
        stroke="none"
      />
    </svg>
  );
}
