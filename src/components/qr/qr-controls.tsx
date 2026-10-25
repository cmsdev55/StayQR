"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { CornerStyle, DotStyle } from "@/lib/qr-design";
import { cn } from "@/lib/utils";

/**
 * One selection indicator per group that slides to the chosen option (CSS transition on the
 * shared curve, re-measured on resize). Plain CSS keeps animation libraries out of the landing JS.
 */
function useIndicator(index: number) {
  const box = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLElement | null)[]>([]);
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  useLayoutEffect(() => {
    const measure = () => {
      const el = items.current[index];
      setRect(el ? { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight } : null);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, [index]);
  return { box, items, rect };
}

const slideClass = "pointer-events-none absolute left-0 top-0 transition-[transform,width,height] duration-base ease-stay";

/** Colour swatches + a custom colour input; the selection ring slides between swatches. */
export function SwatchPicker({
  label,
  value,
  onChange,
  swatches,
  compact,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  swatches: { value: string; label: string }[];
  compact?: boolean;
}) {
  const at = swatches.findIndex((s) => s.value.toLowerCase() === value.toLowerCase());
  const custom = at < 0;
  const { box, items, rect } = useIndicator(custom ? swatches.length : at);
  const size = compact ? "size-8" : "size-10";
  return (
    <fieldset>
      <legend className="mb-3 text-body-sm font-medium text-fg">{label}</legend>
      <div ref={box} className="relative flex flex-wrap items-center gap-2" role="radiogroup" aria-label={label}>
        {rect && (
          <span
            aria-hidden
            className={cn(slideClass, "rounded-full ring-2 ring-fg")}
            style={{ transform: `translate(${rect.x - 3}px, ${rect.y - 3}px)`, width: rect.w + 6, height: rect.h + 6 }}
          />
        )}
        {swatches.map((s, i) => {
          const on = s.value.toLowerCase() === value.toLowerCase();
          return (
            <button
              key={s.value}
              ref={(el) => {
                items.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={s.label}
              title={s.label}
              onClick={() => onChange(s.value)}
              className={cn("relative grid place-items-center rounded-full transition-transform duration-fast ease-stay hover:scale-105", size)}
            >
              <span className="size-full rounded-full shadow-[inset_0_0_0_1px_var(--border-strong)]" style={{ background: s.value }} />
            </button>
          );
        })}
        <label
          ref={(el) => {
            items.current[swatches.length] = el;
          }}
          className={cn("relative grid cursor-pointer place-items-center rounded-full transition-transform duration-fast ease-stay hover:scale-105", size)}
          title="Custom colour"
        >
          <span
            className="size-full rounded-full shadow-[inset_0_0_0_1px_var(--border-strong)]"
            style={{ background: custom ? value : "conic-gradient(from 0deg,#f43f5e,#f59e0b,#84cc16,#06b6d4,#6366f1,#d946ef,#f43f5e)" }}
          />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label={`${label}: custom colour`}
          />
        </label>
        <span className="ml-1 font-mono text-[12px] uppercase text-fg-subtle">{value}</span>
      </div>
    </fieldset>
  );
}

/** Tiles that preview each module or corner style. */
export function StylePicker<T extends DotStyle | CornerStyle>({
  label,
  value,
  onChange,
  options,
  kind,
  compact,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  kind: "dots" | "corners";
  compact?: boolean;
}) {
  const { box, items, rect } = useIndicator(options.findIndex((o) => o.value === value));
  return (
    <fieldset>
      <legend className="mb-3 text-body-sm font-medium text-fg">{label}</legend>
      <div ref={box} className={cn("relative grid gap-2", kind === "dots" ? "grid-cols-5" : "grid-cols-3")} role="radiogroup" aria-label={label}>
        {rect && (
          <span
            aria-hidden
            className={cn(slideClass, "rounded-sm border border-fg bg-glass-strong")}
            style={{ transform: `translate(${rect.x}px, ${rect.y}px)`, width: rect.w, height: rect.h }}
          />
        )}
        {options.map((o, i) => {
          const on = o.value === value;
          return (
            <button
              key={o.value}
              ref={(el) => {
                items.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(o.value)}
              className={cn(
                "group relative flex flex-col items-center gap-1.5 rounded-sm border border-line px-1 transition-colors duration-fast ease-stay hover:border-line-strong",
                compact ? "py-2" : "py-3",
                on ? "text-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              <svg viewBox="0 0 30 30" className={cn("relative", compact ? "size-6" : "size-8")} aria-hidden>
                {kind === "dots" ? <DotGlyph style={o.value as DotStyle} /> : <CornerGlyph style={o.value as CornerStyle} />}
              </svg>
              <span className="relative text-[12px] font-medium">{o.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

const PATTERN = [1, 1, 0, 1, 1, 1, 0, 1, 1];

function DotGlyph({ style }: { style: DotStyle }) {
  return (
    <g fill="currentColor">
      {PATTERN.map((on, i) => {
        if (!on) return null;
        const x = (i % 3) * 10, y = Math.floor(i / 3) * 10;
        if (style === "dots") return <circle key={i} cx={x + 5} cy={y + 5} r={4.2} />;
        if (style === "classy") return <path key={i} d={`M${x + 1} ${y + 1}h5a3 3 0 0 1 3 3v5h-5a3 3 0 0 1-3-3z`} />;
        const rx = style === "square" ? 0 : style === "rounded" ? 2.4 : 4.4;
        return <rect key={i} x={x + 0.6} y={y + 0.6} width={8.8} height={8.8} rx={rx} />;
      })}
    </g>
  );
}

function CornerGlyph({ style }: { style: CornerStyle }) {
  const r = style === "square" ? 0 : style === "extra-rounded" ? 7 : 13;
  return (
    <g fill="none" stroke="currentColor" strokeWidth={4}>
      <rect x={2} y={2} width={26} height={26} rx={r} />
      <rect x={10} y={10} width={10} height={10} rx={style === "dot" ? 5 : style === "extra-rounded" ? 2.5 : 0} fill="currentColor" stroke="none" />
    </g>
  );
}
