import type Lenis from "lenis";

/** The page's Lenis instance, if smooth scrolling is on (fine pointers, motion allowed). */
let current: Lenis | null = null;
const listeners = new Set<(l: Lenis | null) => void>();

export function setLenis(l: Lenis | null) {
  current = l;
  listeners.forEach((fn) => fn(l));
}

export function getLenis() {
  return current;
}

/** Subscribe to Lenis being created/destroyed (GSAP ScrollTrigger hooks its update in here). */
export function onLenis(fn: (l: Lenis | null) => void) {
  listeners.add(fn);
  fn(current);
  return () => {
    listeners.delete(fn);
  };
}

export const HEADER_OFFSET = 72;
