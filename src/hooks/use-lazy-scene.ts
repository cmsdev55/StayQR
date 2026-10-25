"use client";

import { useEffect, useState, type RefObject } from "react";
import { detectTier, useReducedMotion, type DeviceTier } from "./use-environment";

/**
 * When to mount a below-the-fold 3D scene: never for tier "none" or reduced motion,
 * otherwise once its box is within `margin` of the viewport and the main thread is idle.
 * Until then (and always on weak devices) the caller shows a same-size static image.
 */
export function useLazyScene(ref: RefObject<Element | null>, margin = "400px") {
  const reduced = useReducedMotion();
  const [tier, setTier] = useState<DeviceTier | null>(null);
  const [near, setNear] = useState(false);
  const [mount, setMount] = useState(false);

  useEffect(() => setTier(detectTier()), []);

  useEffect(() => {
    const el = ref.current;
    if (!el || tier === null || tier === "none" || reduced) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, tier, reduced, margin]);

  useEffect(() => {
    if (!near) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setMount(true), { timeout: 1500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = setTimeout(() => setMount(true), 200);
    return () => clearTimeout(id);
  }, [near]);

  const use3D = mount && !reduced && tier !== null && tier !== "none";
  return { tier: tier === "high" || tier === "low" ? tier : null, use3D };
}
