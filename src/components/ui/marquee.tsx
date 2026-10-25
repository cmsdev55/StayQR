"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useActive } from "@/hooks/use-environment";
import { cn } from "@/lib/utils";

/**
 * Infinite horizontal loop (DESIGN.md §7): a duplicated track moved with transforms.
 * Hover eases the speed down to 25%, keyboard focus inside stops it, and it pauses off screen.
 * Reduced motion gets a static wrapped row (pure CSS, so no layout shift).
 */
export function Marquee({
  children,
  speed = 40,
  reverse = false,
  paused: forcePaused = false,
  className,
  gap = 16,
}: {
  children: ReactNode;
  /** Pixels per second at full speed. */
  speed?: number;
  reverse?: boolean;
  paused?: boolean;
  className?: string;
  gap?: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const active = useActive(root, "0px");
  const [focused, setFocused] = useState(false);
  const target = useRef(1);

  useEffect(() => {
    const el = track.current;
    if (!el || !active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, last = performance.now(), x = Number(el.dataset.x ?? 0), rate = Number(el.dataset.rate ?? 1);
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const goal = focused || forcePaused ? 0 : target.current;
      rate += (goal - rate) * 0.06;
      const half = el.scrollWidth / 2;
      x -= speed * rate * dt;
      if (half > 0) x = ((x % half) + half) % half - half;
      el.style.transform = `translate3d(${(reverse ? -half - x : x).toFixed(2)}px,0,0)`;
      el.dataset.x = String(x);
      el.dataset.rate = String(rate);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, focused, forcePaused, speed, reverse]);

  return (
    <div
      ref={root}
      className={cn("marquee group/marquee relative overflow-hidden", className)}
      onPointerEnter={() => (target.current = 0.25)}
      onPointerLeave={() => (target.current = 1)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setFocused(false)}
    >
      <div ref={track} className="marquee-track flex w-max will-change-transform" style={{ gap }}>
        <div className="flex shrink-0" style={{ gap }}>{children}</div>
        <div className="marquee-dup flex shrink-0" style={{ gap }} aria-hidden inert>
          {children}
        </div>
      </div>
    </div>
  );
}
