"use client";

import { useEffect } from "react";
import { HEADER_OFFSET, getLenis, setLenis } from "@/lib/scroll";

/**
 * Lenis smooth scrolling for the marketing site. Loaded after idle, only for fine pointers
 * (touch scrolling is already smooth) and never with reduced motion (DESIGN.md §5).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let dead = false;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const start = () =>
      import("lenis").then(({ default: Lenis }) => {
        if (dead) return;
        setLenis(new Lenis({ autoRaf: true, lerp: 0.11 }));
      });
    if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 2000 });
    else setTimeout(start, 600);

    // Same-page hash links glide with Lenis instead of jumping. Capture phase runs before
    // next/link, which then sees defaultPrevented and skips its own navigation.
    const onClick = (e: MouseEvent) => {
      const lenis = getLenis();
      if (!lenis || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element).closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href);
      if (url.pathname !== location.pathname || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -HEADER_OFFSET + 1 });
      history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick, true);

    return () => {
      dead = true;
      document.removeEventListener("click", onClick, true);
      getLenis()?.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
