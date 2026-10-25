/** The one easing curve (DESIGN.md §5). */
export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_CSS = "cubic-bezier(0.22, 1, 0.36, 1)";

export const DUR = {
  micro: 0.12,
  fast: 0.2,
  base: 0.4,
  slow: 0.7,
  hero: 1.4,
} as const;

/**
 * Evaluate cubic-bezier(0.22, 1, 0.36, 1) at t∈[0,1] in JS (for the 3D loop,
 * where we can't use CSS). Newton–Raphson on x(t), 6 iterations is plenty.
 */
const P1X = 0.22, P1Y = 1, P2X = 0.36, P2Y = 1;
const cx = 3 * P1X, bx = 3 * (P2X - P1X) - cx, ax = 1 - cx - bx;
const cy = 3 * P1Y, by = 3 * (P2Y - P1Y) - cy, ay = 1 - cy - by;
const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
const sampleDX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

export function ease(x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  let t = x;
  for (let i = 0; i < 6; i++) {
    const d = sampleDX(t);
    if (Math.abs(d) < 1e-6) break;
    t -= (sampleX(t) - x) / d;
  }
  return sampleY(Math.min(1, Math.max(0, t)));
}
