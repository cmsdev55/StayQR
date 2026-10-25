"use client";

import { m } from "framer-motion";
import { useId } from "react";
import { EASE } from "@/lib/motion";
import type { CornerStyle, DotStyle } from "@/lib/qr-design";
import { cn } from "@/lib/utils";

const slide = { duration: 0.4, ease: EASE };

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
  const id = useId();
  const custom = !swatches.some((s) => s.value.toLowerCase() === value.toLowerCase());
  const size = compact ? "size-8" : "size-10";
  return (
    <fieldset>
      <legend className="mb-3 text-body-sm font-medium text-fg">{label}</legend>
      <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label={label}>
        {swatches.map((s) => {
          const on = s.value.toLowerCase() === value.toLowerCase();
          return (
            <button
              key={s.value}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={s.label}
              title={s.label}
              onClick={() => onChange(s.value)}
              className={cn("relative grid place-items-center rounded-full transition-transform duration-fast ease-stay hover:scale-105", size)}
            >
              {on && <m.span layoutId={`${id}-ring`} transition={slide} className="absolute -inset-[3px] rounded-full ring-2 ring-fg" />}
              <span className="size-full rounded-full shadow-[inset_0_0_0_1px_var(--border-strong)]" style={{ background: s.value }} />
            </button>
          );
        })}
        <label
          className={cn("relative grid cursor-pointer place-items-center rounded-full transition-transform duration-fast ease-stay hover:scale-105", size)}
          title="Custom colour"
        >
          {custom && <m.span layoutId={`${id}-ring`} transition={slide} className="absolute -inset-[3px] rounded-full ring-2 ring-fg" />}
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
  const id = useId();
  return (
    <fieldset>
      <legend className="mb-3 text-body-sm font-medium text-fg">{label}</legend>
      <div className={cn("grid gap-2", kind === "dots" ? "grid-cols-5" : "grid-cols-3")} role="radiogroup" aria-label={label}>
        {options.map((o) => {
          const on = o.value === value;
          return (
            <button
              key={o.value}
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
              {on && (
                <m.span
                  layoutId={`${id}-sel`}
                  transition={slide}
                  className="absolute -inset-px rounded-sm border border-fg bg-glass-strong"
                />
              )}
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
