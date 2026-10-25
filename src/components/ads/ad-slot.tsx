"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Google AdSense slot for free-tool and guide pages only (never the dashboard, pricing or scan pages).
 * Off until NEXT_PUBLIC_ADSENSE_CLIENT (ca-pub-…) and a slot id are set: then it reserves its height
 * up front (no layout shift) and loads Google's script only when the slot nears the viewport.
 */
const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
export const AD_SLOTS = {
  tool: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL,
  guide: process.env.NEXT_PUBLIC_ADSENSE_SLOT_GUIDE,
};

let scriptRequested = false;
function loadScript() {
  if (scriptRequested || !CLIENT) return;
  scriptRequested = true;
  const s = document.createElement("script");
  s.async = true;
  s.crossOrigin = "anonymous";
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;
  document.head.appendChild(s);
}

type AdsQueue = { push: (o: object) => void };

export function AdSlot({ slot, className, minHeight = 280 }: { slot?: string; className?: string; minHeight?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!CLIENT || !slot || !el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || pushed.current) return;
        pushed.current = true;
        io.disconnect();
        loadScript();
        try {
          const w = window as Window & { adsbygoogle?: AdsQueue };
          (w.adsbygoogle = w.adsbygoogle || ([] as unknown as AdsQueue)).push({});
        } catch {
          /* blocked by an extension: the reserved space simply stays empty */
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [slot]);

  if (!CLIENT || !slot) return null;
  return (
    <aside aria-label="Advertisement" className={cn("mx-auto w-full max-w-container px-4 sm:px-6", className)}>
      <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-fg-subtle">Advertisement</p>
      <div ref={ref} className="overflow-hidden rounded-md border border-line bg-bg-raised" style={{ minHeight }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight }}
          data-ad-client={CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}
