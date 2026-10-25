"use client";

import { useEffect } from "react";

/**
 * One IntersectionObserver for every `[data-reveal]` on the page: sets `data-in` once the
 * element is 15% into the viewport (DESIGN.md §5), then forgets it. The CSS does the motion.
 * Watches the DOM so client-rendered sections and route changes are picked up too.
 */
export function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-in", "");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    const scan = (root: ParentNode) => root.querySelectorAll("[data-reveal]:not([data-in])").forEach((el) => io.observe(el));
    scan(document);
    const mo = new MutationObserver((muts) => {
      for (const m of muts)
        m.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches("[data-reveal]:not([data-in])")) io.observe(n);
          scan(n);
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
