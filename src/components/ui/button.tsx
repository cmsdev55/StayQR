"use client";

import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, useEffect, useRef, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-sm font-medium transition-[background-color,box-shadow,color,border-color,transform] duration-fast ease-stay active:scale-[0.98] active:duration-micro disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent font-semibold text-accent-ink hover:shadow-glow-accent focus-visible:shadow-glow-accent",
        secondary:
          "glass text-fg hover:bg-glass-strong [box-shadow:inset_0_0_0_1px_var(--border-strong)]",
        ghost: "text-fg-muted hover:text-fg",
      },
      size: {
        sm: "h-10 px-4 text-body-sm",
        md: "h-12 px-5 text-body",
        lg: "h-14 px-7 text-body",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, ComponentProps<"button"> & Variants>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = "Button";

export function ButtonLink({
  className,
  variant,
  size,
  href,
  children,
  ...props
}: ComponentProps<typeof Link> & Variants) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </Link>
  );
}

/**
 * Magnetic wrapper: the child drifts toward the cursor (max `strength` px)
 * and eases back. Lerped, never springy (DESIGN.md §5). Fine pointers only.
 */
export function Magnetic({ children, strength = 8, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const tick = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      if (Math.abs(tx - x) > 0.05 || Math.abs(ty - y) > 0.05) raf = requestAnimationFrame(tick);
      else raf = 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      tx = (dx / (r.width / 2)) * strength;
      ty = (dy / (r.height / 2)) * strength * 0.6;
      kick();
    };
    const leave = () => { tx = 0; ty = 0; kick(); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, [strength]);
  return (
    <span ref={ref} className={cn("inline-flex will-change-transform", className)}>
      {children}
    </span>
  );
}
