"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { useEffect, useRef, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const cardVariants = cva("relative isolate overflow-hidden", {
  variants: {
    variant: {
      /** Marketing: frosted glass (DESIGN.md §4). */
      glass: "glass rounded-lg",
      /** Dashboard: solid raised surface, no blur. */
      solid: "rounded-md bg-bg-raised shadow-inner-glow [[data-theme=light]_&]:shadow-[inset_0_0_0_1px_var(--border),0_1px_2px_rgba(7,8,11,.04)]",
    },
  },
  defaultVariants: { variant: "glass" },
});

type CardProps = ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & {
    /** Heavy pointer tilt, max 8° (marketing only — never in the dashboard). */
    tilt?: boolean;
    /** Soft radial highlight that follows the cursor. */
    spotlight?: boolean;
  };

const MAX_TILT = 8;

export function Card({ className, variant, tilt, spotlight, children, style, ...props }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !(tilt || spotlight)) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doTilt = tilt && !reduced;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const tick = () => {
      // lerp 0.08: the card feels heavy (DESIGN.md §5)
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty("--rx", `${y.toFixed(3)}deg`);
      el.style.setProperty("--ry", `${x.toFixed(3)}deg`);
      raf = Math.abs(tx - x) > 0.01 || Math.abs(ty - y) > 0.01 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      if (spotlight) {
        el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      }
      if (doTilt) {
        tx = (px - 0.5) * 2 * MAX_TILT;
        ty = -(py - 0.5) * 2 * MAX_TILT;
        if (!raf) raf = requestAnimationFrame(tick);
      }
    };
    const leave = () => {
      tx = 0;
      ty = 0;
      if (doTilt && !raf) raf = requestAnimationFrame(tick);
    };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, [tilt, spotlight]);

  return (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant }),
        tilt && "[transform:perspective(1000px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] [transform-style:preserve-3d]",
        spotlight && "group/spot",
        className,
      )}
      style={style}
      {...props}
    >
      {spotlight && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-base ease-stay group-hover/spot:opacity-100 [background:radial-gradient(400px_circle_at_var(--mx,50%)_var(--my,50%),rgba(255,255,255,0.06),transparent_70%)] [[data-theme=light]_&]:[background:radial-gradient(400px_circle_at_var(--mx,50%)_var(--my,50%),rgba(7,8,11,0.045),transparent_70%)]"
        />
      )}
      {children}
    </div>
  );
}
