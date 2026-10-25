"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AccordionItem = { id?: string; title: ReactNode; content: ReactNode };

/**
 * Height animates on dur-base (grid-rows 0fr → 1fr, no measuring); the plus rotates 45° into a ×.
 * `single` keeps one panel open at a time (the FAQ). Closed panels stay in the DOM (crawlable) but inert.
 */
export function Accordion({
  items,
  single = true,
  defaultOpen = [],
  className,
}: {
  items: AccordionItem[];
  single?: boolean;
  defaultOpen?: number[];
  className?: string;
}) {
  const base = useId();
  const [open, setOpen] = useState<number[]>(defaultOpen);
  const toggle = (i: number) =>
    setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : single ? [i] : [...o, i]));

  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((it, i) => {
        const isOpen = open.includes(i);
        const btn = `${base}-b${i}`;
        const panel = `${base}-p${i}`;
        return (
          <div key={it.id ?? i}>
            <h3>
              <button
                id={btn}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => toggle(i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left text-body-lg font-medium text-fg transition-colors duration-fast ease-stay hover:text-fg sm:py-7"
              >
                <span>{it.title}</span>
                <span
                  aria-hidden
                  className={cn(
                    "relative grid size-9 shrink-0 place-items-center rounded-full border border-line transition-[transform,background-color,border-color] duration-base ease-stay group-hover:border-line-strong",
                    isOpen && "rotate-45 border-line-strong bg-glass-strong",
                  )}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M7 1v12M1 7h12" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panel}
              role="region"
              aria-labelledby={btn}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-base ease-stay",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="max-w-[64ch] pb-7 pr-12 text-body text-fg-muted">{it.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
