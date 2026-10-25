"use client";

import { useEffect, useState, type RefObject } from "react";

/** prefers-reduced-motion, live. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export type DeviceTier = "high" | "low" | "none";

/**
 * "high": desktop GPU path (full cube count + post-processing).
 * "low": phones/tablets (fewer cubes, no post, DPR ≤ 1.5).
 * "none": no WebGL, very weak device or Save-Data → static image only.
 */
export function detectTier(): DeviceTier {
  if (typeof window === "undefined") return "none";
  // Testing override (screenshots, QA): ?tier=high|low|none
  const forced = new URLSearchParams(location.search).get("tier");
  if (forced === "high" || forced === "low" || forced === "none") return forced;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  if (nav.connection?.saveData) return "none";
  if (/(^|-)2g$/.test(nav.connection?.effectiveType ?? "")) return "none";
  if ((nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2) return "none";
  try {
    const c = document.createElement("canvas");
    if (!(c.getContext("webgl2") || c.getContext("webgl"))) return "none";
  } catch {
    return "none";
  }
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 900;
  return coarse || small ? "low" : "high";
}

/** True while the element is on screen AND the tab is visible. */
export function useActive(ref: RefObject<Element | null>, rootMargin = "100px") {
  const [inView, setInView] = useState(true);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);
    const onVis = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [ref, rootMargin]);
  return inView && visible;
}

/** Current theme from <html data-theme>, kept in sync. */
export function useTheme(): "dark" | "light" {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const el = document.documentElement;
    const read = () => setTheme(el.dataset.theme === "light" ? "light" : "dark");
    read();
    const mo = new MutationObserver(read);
    mo.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  return theme;
}
