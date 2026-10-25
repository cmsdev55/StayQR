"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** On/off switch: pill track, thumb slides on dur-fast (DESIGN.md §7). */
export function Toggle({
  checked,
  onChange,
  label,
  size = "md",
  className,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  size?: "md" | "sm";
  className?: string;
}) {
  const sm = size === "sm";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex shrink-0 items-center rounded-full transition-colors duration-fast ease-stay",
        sm ? "h-5 w-9" : "h-6 w-11",
        checked ? "bg-accent" : "bg-fg/15",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute left-0.5 rounded-full shadow-sm transition-transform duration-fast ease-stay",
          sm ? "size-4" : "size-5",
          checked ? (sm ? "translate-x-4 bg-accent-ink" : "translate-x-5 bg-accent-ink") : "translate-x-0 bg-bg-raised [[data-theme=dark]_&]:bg-fg",
        )}
      />
    </button>
  );
}

type Option<T extends string> = { value: T; label: ReactNode };

/**
 * Segmented pill (e.g. the pricing Monthly/Yearly toggle): a radiogroup whose thumb slides
 * under the selected option. Arrow keys move the selection.
 */
export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
  className,
}: {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  size?: "md" | "sm";
  className?: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [thumb, setThumb] = useState<{ x: number; w: number } | null>(null);
  const index = Math.max(0, options.findIndex((o) => o.value === value));

  useLayoutEffect(() => {
    const measure = () => {
      const el = refs.current[index];
      if (el) setThumb({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    refs.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [index, options.length]);

  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (index + d + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKey}
      className={cn("glass relative inline-flex rounded-full p-1", className)}
    >
      <span
        aria-hidden
        className={cn(
          "absolute bottom-1 top-1 rounded-full bg-fg shadow-sm transition-[transform,width,opacity] duration-fast ease-stay",
          !thumb && "opacity-0",
        )}
        style={thumb ? { width: thumb.w, transform: `translateX(${thumb.x - 4}px)`, left: 4 } : undefined}
      />
      {options.map((o, i) => {
        const on = i === index;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative z-10 inline-flex items-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors duration-fast ease-stay",
              size === "md" ? "h-10 px-5 text-body-sm" : "h-8 px-3.5 text-body-sm",
              on ? "text-bg" : "text-fg-muted hover:text-fg",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
