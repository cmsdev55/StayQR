"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Dashboard charts, built to the dataviz spec: 2px lines, ~10% area wash, hairline solid grid,
 * bars ≤ 24px with 4px rounded data-ends, values in text tokens (never the series colour),
 * crosshair + tooltip on lines, per-mark tooltips on bars and cells.
 * Series colours: current = accent (lime in dark, --accent-text in light), previous = text-subtle
 * grey (the emphasis pattern). Checked with the dataviz validator in both modes.
 */

const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}K` : String(Math.round(n)));

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

function niceMax(v: number) {
  const p = 10 ** Math.floor(Math.log10(Math.max(1, v)));
  const steps = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
  return (steps.find((s) => s * p >= v) ?? 10) * p;
}

export type Point = { label: string; current: number; previous: number };

/** Scans per day: current period (area + line) against the previous period (grey line). */
export function ScansChart({ data, height = 280 }: { data: Point[]; height?: number }) {
  const [box, w] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const padL = 40, padR = 52, padT = 12, padB = 28;
  const iw = Math.max(1, w - padL - padR), ih = height - padT - padB;
  const max = niceMax(Math.max(...data.map((d) => Math.max(d.current, d.previous))));
  const x = (i: number) => padL + (data.length === 1 ? iw / 2 : (i / (data.length - 1)) * iw);
  const y = (v: number) => padT + ih - (v / max) * ih;
  const line = (k: "current" | "previous") => data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(d[k]).toFixed(1)}`).join("");
  const area = `${line("current")}L${x(data.length - 1).toFixed(1)} ${padT + ih}L${x(0).toFixed(1)} ${padT + ih}Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
  const every = Math.ceil(data.length / (w < 520 ? 4 : 7));
  const last = data[data.length - 1];

  const pick = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    const i = Math.round(((clientX - r.left - padL) / iw) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  };
  const h = hover !== null ? data[hover] : null;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-fg-muted" aria-hidden>
        <span className="flex items-center gap-2"><span className="h-0.5 w-4 rounded-full bg-accent [[data-theme=light]_&]:bg-accent-text" /> This period</span>
        <span className="flex items-center gap-2"><span className="h-0.5 w-4 rounded-full bg-fg-subtle" /> Previous period</span>
      </div>
      <div
        ref={box}
        className="relative touch-none select-none outline-none"
        style={{ height }}
        role="img"
        aria-label={`Scans per day. Latest: ${last.current.toLocaleString("en-US")} on ${last.label}. Use the table below for every value.`}
        tabIndex={0}
        onPointerMove={(e) => pick(e.clientX)}
        onPointerLeave={() => setHover(null)}
        onFocus={() => setHover(data.length - 1)}
        onBlur={() => setHover(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setHover((v) => Math.max(0, (v ?? data.length) - 1));
          if (e.key === "ArrowRight") setHover((v) => Math.min(data.length - 1, (v ?? -1) + 1));
        }}
      >
        {w > 0 && (
          <svg width={w} height={height} className="absolute inset-0 overflow-visible">
            {ticks.map((t) => (
              <g key={t}>
                <line x1={padL} x2={padL + iw} y1={y(t)} y2={y(t)} className="stroke-[var(--border)]" strokeWidth={1} shapeRendering="crispEdges" />
                <text x={padL - 10} y={y(t)} dy="0.32em" textAnchor="end" className="fill-fg-subtle font-mono text-[11px] tabular-nums">{compact(t)}</text>
              </g>
            ))}
            {data.map((d, i) =>
              i % every === 0 || i === data.length - 1 ? (
                <text key={d.label + i} x={x(i)} y={height - 6} textAnchor={i === data.length - 1 ? "end" : i === 0 ? "start" : "middle"} className="fill-fg-subtle font-mono text-[11px]">{d.label}</text>
              ) : null,
            )}
            <path d={area} className="fill-accent/10 [[data-theme=light]_&]:fill-accent-text/10" />
            <path d={line("previous")} fill="none" className="stroke-fg-subtle" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            <path d={line("current")} fill="none" className="stroke-accent [[data-theme=light]_&]:stroke-accent-text" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {/* end point + direct label (the one value the story is about) */}
            <circle cx={x(data.length - 1)} cy={y(last.current)} r={4} className="fill-accent stroke-bg-raised [[data-theme=light]_&]:fill-accent-text" strokeWidth={2} />
            <text x={x(data.length - 1) + 10} y={y(last.current)} dy="0.32em" className="fill-fg text-[12px] font-semibold tabular-nums">{compact(last.current)}</text>
            {h && hover !== null && (
              <g>
                <line x1={x(hover)} x2={x(hover)} y1={padT} y2={padT + ih} className="stroke-[var(--border-strong)]" strokeWidth={1} shapeRendering="crispEdges" />
                <circle cx={x(hover)} cy={y(h.previous)} r={4} className="fill-fg-subtle stroke-bg-raised" strokeWidth={2} />
                <circle cx={x(hover)} cy={y(h.current)} r={4} className="fill-accent stroke-bg-raised [[data-theme=light]_&]:fill-accent-text" strokeWidth={2} />
              </g>
            )}
          </svg>
        )}
        {h && hover !== null && (
          <div
            className="pointer-events-none absolute top-2 z-10 min-w-[150px] rounded-sm border border-line bg-bg-overlay px-3 py-2.5 shadow-md"
            style={{ left: Math.min(Math.max(x(hover) + 12, 0), w - 170) }}
          >
            <p className="font-mono text-[11px] text-fg-subtle">{h.label}</p>
            <p className="mt-1.5 flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-[12px] text-fg-muted"><span className="h-0.5 w-3 rounded-full bg-accent [[data-theme=light]_&]:bg-accent-text" />This period</span>
              <span className="font-semibold tabular-nums text-fg">{h.current.toLocaleString("en-US")}</span>
            </p>
            <p className="mt-1 flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-[12px] text-fg-muted"><span className="h-0.5 w-3 rounded-full bg-fg-subtle" />Previous</span>
              <span className="tabular-nums text-fg-muted">{h.previous.toLocaleString("en-US")}</span>
            </p>
          </div>
        )}
      </div>
      <details className="mt-4 text-fg-muted">
        <summary className="w-fit cursor-pointer rounded-[6px] text-[12px] font-medium underline decoration-line-strong underline-offset-4 hover:text-fg">View as table</summary>
        <div className="mt-3 max-h-64 overflow-auto rounded-sm border border-line">
          <table className="w-full text-left text-[12px]">
            <thead className="sticky top-0 bg-bg-overlay text-fg-subtle">
              <tr><th className="px-3 py-2 font-medium">Day</th><th className="px-3 py-2 text-right font-medium">This period</th><th className="px-3 py-2 text-right font-medium">Previous period</th></tr>
            </thead>
            <tbody className="divide-y divide-line tabular-nums">
              {data.map((d) => (
                <tr key={d.label}><td className="px-3 py-1.5">{d.label}</td><td className="px-3 py-1.5 text-right text-fg">{d.current.toLocaleString("en-US")}</td><td className="px-3 py-1.5 text-right">{d.previous.toLocaleString("en-US")}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

/** Horizontal bars, one neutral series colour, value at the tip, tooltip on hover/focus. */
export function BarList({ items, total }: { items: { label: string; value: number; sub?: string }[]; total: number }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="flex flex-col gap-3">
      {items.map((it) => {
        const pct = Math.round((it.value / total) * 100);
        return (
          <li key={it.label} className="group" tabIndex={0} aria-label={`${it.label}: ${it.value.toLocaleString("en-US")} scans, ${pct}%`}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="text-fg">{it.label}{it.sub && <span className="ml-2 font-mono text-[11px] text-fg-subtle">{it.sub}</span>}</span>
              <span className="tabular-nums text-fg-muted">{pct}%</span>
            </div>
            <div className="relative h-3">
              <div
                className="h-3 max-h-6 rounded-r-[4px] bg-fg/60 transition-[background-color] duration-fast ease-stay group-hover:bg-fg/80 group-focus-visible:bg-fg/80"
                style={{ width: `${Math.max(2, (it.value / max) * 100)}%` }}
              />
              <span className="pointer-events-none absolute -top-9 right-0 rounded-[6px] border border-line bg-bg-overlay px-2 py-1 font-mono text-[11px] tabular-nums text-fg opacity-0 shadow-sm transition-opacity duration-fast ease-stay group-hover:opacity-100 group-focus-visible:opacity-100">
                {it.value.toLocaleString("en-US")} scans
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Weekday × hour heatmap: one hue, light → strong, with a scale legend and per-cell tooltips. */
export function Heatmap({ grid, total }: { grid: number[][]; total: number }) {
  const [hover, setHover] = useState<{ d: number; h: number } | null>(null);
  const sum = grid.flat().reduce((a, b) => a + b, 0);
  const scans = (v: number) => Math.round((v / sum) * total);
  const level = (v: number) => (v < 0.15 ? 0 : v < 0.35 ? 1 : v < 0.55 ? 2 : v < 0.78 ? 3 : 4);
  const cellClass = ["opacity-[0.07]", "opacity-[0.22]", "opacity-[0.42]", "opacity-[0.66]", "opacity-[0.92]"];
  return (
    <div>
      <div className="overflow-x-auto pb-1">
        <div className="grid min-w-[560px] grid-cols-[36px_repeat(24,minmax(0,1fr))] gap-[2px]" role="grid" aria-label="Scans by weekday and hour">
          {grid.map((row, d) => (
            <div key={d} role="row" className="contents">
              <span role="rowheader" className="flex items-center font-mono text-[11px] text-fg-subtle">{DAYS[d]}</span>
              {row.map((v, h) => {
                const lv = level(v);
                const on = hover?.d === d && hover?.h === h;
                return (
                  <span
                    key={h}
                    role="gridcell"
                    tabIndex={d === 0 && h === 0 ? 0 : -1}
                    aria-label={`${DAYS[d]} ${String(h).padStart(2, "0")}:00, about ${scans(v).toLocaleString("en-US")} scans`}
                    onPointerEnter={() => setHover({ d, h })}
                    onPointerLeave={() => setHover(null)}
                    onFocus={() => setHover({ d, h })}
                    className="relative aspect-square rounded-[3px] bg-bg outline-none"
                  >
                    <span className={cn("absolute inset-0 rounded-[3px] bg-accent [[data-theme=light]_&]:bg-accent-text", cellClass[lv], on && "ring-2 ring-fg")} />
                  </span>
                );
              })}
            </div>
          ))}
          <span />
          {Array.from({ length: 24 }, (_, h) => (
            <span key={h} className="pt-1 text-center font-mono text-[10px] text-fg-subtle">{h % 6 === 0 ? `${String(h).padStart(2, "0")}` : ""}</span>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="min-h-[1.5em] text-[12px] text-fg-muted" aria-live="polite">
          {hover ? (
            <>
              <span className="font-semibold tabular-nums text-fg">{scans(grid[hover.d][hover.h]).toLocaleString("en-US")} scans</span>{" "}
              · {DAYS[hover.d]} {String(hover.h).padStart(2, "0")}:00–{String((hover.h + 1) % 24).padStart(2, "0")}:00
            </>
          ) : (
            "Hover a cell for the count"
          )}
        </p>
        <div className="flex items-center gap-2 font-mono text-[11px] text-fg-subtle" aria-hidden>
          Fewer
          {cellClass.map((c) => (
            <span key={c} className="relative size-3.5 rounded-[3px] bg-bg"><span className={cn("absolute inset-0 rounded-[3px] bg-accent [[data-theme=light]_&]:bg-accent-text", c)} /></span>
          ))}
          More
        </div>
      </div>
    </div>
  );
}
