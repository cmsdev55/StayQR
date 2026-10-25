"use client";

import { useEffect } from "react";
import { detectTier } from "@/hooks/use-environment";
import { loadGsap } from "@/lib/gsap";

/**
 * After the page is idle, fetch and parse the code the home page's lower sections will need,
 * so scrolling into them never waits on the network (or, in dev, on a compile) mid-gesture.
 * Same import() targets as the sections use, so these are the very same chunks, not extra code.
 * 3D only for tiers that will actually render it; nothing at all with Save-Data.
 */
export function Prewarm() {
  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const steps: (() => Promise<unknown>)[] = [];
    if (!reduced) steps.push(() => loadGsap());
    steps.push(() => import("qr-code-styling"));
    const tier = detectTier();
    if (!reduced && tier !== "none") {
      steps.push(() => import("@/components/three/globe-scene"));
      steps.push(() => import("@/components/three/cta-scene"));
    }
    // one chunk per idle slot, so prewarming itself never makes a long task
    let id = 0, cancelled = false;
    const next = () => {
      const step = steps.shift();
      if (!step || cancelled) return;
      step().catch(() => {}).finally(schedule);
    };
    const schedule = () => {
      if (cancelled) return;
      id = w.requestIdleCallback ? w.requestIdleCallback(next, { timeout: 4000 }) : window.setTimeout(next, 800);
    };
    const start = () => window.setTimeout(schedule, 1500); // let the hero scene go first
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      cancelled = true;
      w.cancelIdleCallback?.(id);
      window.removeEventListener("load", start);
    };
  }, []);
  return null;
}
