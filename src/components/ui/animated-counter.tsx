"use client";

import { useEffect, useRef, useState } from "react";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Odometer (DESIGN.md §7): every digit is a vertical 0–9 strip, and lower digits carry into
 * higher ones like a mechanical counter, so values roll rather than flicker.
 * Plays from `from` the first time it scrolls into view, then tweens between later values.
 * The real value is always in the DOM as text for screen readers and crawlers.
 */
export function AnimatedCounter({
  value,
  from,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1400,
  group = false,
  className,
  label,
}: {
  value: number;
  /** Starting value for the first, on-view run. Omit to show `value` straight away. */
  from?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  /** Thousands separators. */
  group?: boolean;
  className?: string;
  /** Accessible text, if it should read differently from the number (e.g. "$29 per year"). */
  label?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(from ?? value);
  const shownRef = useRef(shown);
  const started = useRef(from === undefined);

  const run = (to: number) => {
    const start = shownRef.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || start === to) {
      shownRef.current = to;
      setShown(to);
      return () => {};
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const v = start + (to - start) * ease(p);
      shownRef.current = v;
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  };

  // first run: wait for the counter to be seen
  useEffect(() => {
    if (started.current) return;
    const el = ref.current;
    if (!el) return;
    let stop = () => {};
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        started.current = true;
        io.disconnect();
        stop = run(value);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // later changes (e.g. the pricing toggle)
  useEffect(() => {
    if (!started.current) return;
    return run(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const scale = 10 ** decimals;
  const maxInt = Math.floor(Math.max(Math.abs(value), Math.abs(from ?? 0))).toString().length;
  const scaled = Math.max(0, shown) * scale;
  const intNow = Math.floor(shown + 1e-9).toString().length;

  // places from most significant integer digit down to the last decimal
  const places: number[] = [];
  for (let k = maxInt - 1 + decimals; k >= 0; k--) places.push(k);

  const formatted =
    prefix +
    value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: group }) +
    suffix;

  return (
    <span ref={ref} className={cn("relative inline-flex tabular-nums leading-[1.1em]", className)}>
      <span className="sr-only">{label ?? formatted}</span>
      <span aria-hidden className="inline-flex items-start">
        {prefix && <span className="h-[1.1em]">{prefix}</span>}
        {places.map((k) => {
          const intPlace = k - decimals; // 0 = ones
          const unit = 10 ** k;
          const base = Math.floor(scaled / unit + 1e-9) % 10;
          const rem = scaled % unit;
          const pos = base + (rem > unit - 1 ? rem - (unit - 1) : 0);
          const hidden = intPlace > 0 && intPlace >= intNow; // leading zero
          const sep = group && intPlace > 0 && intPlace % 3 === 0;
          return (
            <span key={k} className="inline-flex items-start">
              <span
                className="relative inline-block h-[1.1em] overflow-hidden text-center leading-[1.1em] transition-[width,opacity] duration-base ease-stay"
                style={{ width: hidden ? 0 : "0.62em", opacity: hidden ? 0 : 1 }}
              >
                <span className="absolute inset-x-0 top-0 flex flex-col" style={{ transform: `translateY(${(-pos * 1.1).toFixed(4)}em)` }}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, i) => (
                    <span key={i} className="block h-[1.1em]">{d}</span>
                  ))}
                </span>
              </span>
              {sep && !hidden && <span className="h-[1.1em]">,</span>}
              {decimals > 0 && k === decimals && <span className="h-[1.1em]">.</span>}
            </span>
          );
        })}
        {suffix && <span className="h-[1.1em]">{suffix}</span>}
      </span>
    </span>
  );
}
