"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BarList, Heatmap, ScansChart } from "@/components/dashboard/charts";
import { QrThumb } from "@/components/dashboard/qr-thumb";
import { SegmentedToggle } from "@/components/ui/toggle";
import { CITIES, CODES, DEVICES, codeById, heatmap, scanSeries, type Range } from "@/content/dashboard";
import { cn } from "@/lib/utils";

/** Analytics: one filter row scopes every number below it; refetch keeps the frame (no skeleton flash). */
export function AnalyticsView({ initialCode = "all" }: { initialCode?: string }) {
  const [range, setRange] = useState<Range>(30);
  const [code, setCode] = useState(initialCode);
  const [query, setQuery] = useState({ range: 30 as Range, code: initialCode });
  const loading = query.range !== range || query.code !== code;

  // fake a short fetch so the "hold the frame" behaviour is visible
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setQuery({ range, code }), 380);
    return () => clearTimeout(t);
  }, [loading, range, code]);

  const series = useMemo(() => scanSeries(query.range, query.code), [query]);
  const cur = series.reduce((s, d) => s + d.current, 0);
  const prev = series.reduce((s, d) => s + d.previous, 0);
  const grid = useMemo(() => heatmap(), []);
  const top = useMemo(() => [...CODES].sort((a, b) => b.scans30 - a.scans30).slice(0, 5), []);
  const best = series.reduce((a, b) => (b.current > a.current ? b : a));
  const pct = (a: number, b: number) => Math.round(((a - b) / Math.max(1, b)) * 100);

  const tiles = [
    { label: "Scans", value: cur, delta: pct(cur, prev) },
    { label: "Unique scanners", value: Math.round(cur * 0.66), delta: pct(cur * 0.66, prev * 0.64) },
    { label: "Average per day", value: Math.round(cur / series.length), delta: pct(cur, prev) },
    { label: "Busiest day", value: best.current, sub: best.label },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-h4 font-semibold text-fg sm:text-[26px]">Analytics</h1>
          <p className="mt-1 text-fg-muted">
            {code === "all" ? "All codes" : codeById(code)?.name} · last {query.range} days, compared with the {query.range} days before
          </p>
        </div>
      </div>

      {/* Filters: one row, above everything they scope */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <SegmentedToggle
          label="Date range"
          size="sm"
          value={String(range) as "7" | "30" | "90"}
          onChange={(v) => setRange(Number(v) as Range)}
          options={[
            { value: "7", label: "7 days" },
            { value: "30", label: "30 days" },
            { value: "90", label: "90 days" },
          ]}
        />
        <label className="flex items-center gap-2">
          <span className="sr-only">Code</span>
          <select value={code} onChange={(e) => setCode(e.target.value)} className="h-10 max-w-[260px] rounded-sm border border-line bg-bg-raised px-3 text-fg hover:border-line-strong focus:border-accent focus:outline-none">
            <option value="all">All codes</option>
            {CODES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <span className={cn("inline-flex items-center gap-2 font-mono text-[11px] text-fg-subtle transition-opacity duration-fast ease-stay", loading ? "opacity-100" : "opacity-0")} aria-live="polite">
          <span className="spinner size-3 rounded-full border-2 border-fg-subtle/30 border-t-fg-subtle" aria-hidden /> {loading ? "Updating" : ""}
        </span>
      </div>

      <div className={cn("mt-6 flex flex-col gap-4 transition-opacity duration-fast ease-stay", loading && "opacity-50")} aria-busy={loading}>
        {/* Stat tiles */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {tiles.map((t) => (
            <div key={t.label} className="rounded-md border border-line bg-bg-raised p-4 sm:p-5">
              <p className="text-fg-muted">{t.label}</p>
              <p className="mt-2 text-[24px] font-semibold leading-tight text-fg sm:text-[28px]">{t.value.toLocaleString("en-US")}</p>
              {t.delta !== undefined ? (
                <p className={cn("mt-1 font-mono text-[12px] tabular-nums", t.delta >= 0 ? "text-accent-text" : "text-danger")}>
                  {t.delta >= 0 ? "↑" : "↓"} {Math.abs(t.delta)}% <span className="text-fg-subtle">vs previous {query.range} days</span>
                </p>
              ) : (
                <p className="mt-1 font-mono text-[12px] text-fg-subtle">{t.sub}</p>
              )}
            </div>
          ))}
        </div>

        <Panel title="Scans per day" desc="Weekends run about 40% higher: Friday and Saturday dinner service.">
          <ScansChart data={series} />
        </Panel>

        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Devices">
            <BarList total={cur} items={DEVICES.map((d) => ({ label: d.name, value: Math.round(cur * d.share) }))} />
          </Panel>
          <Panel title="Top cities">
            <BarList total={cur} items={CITIES.map((c) => ({ label: c.name, sub: c.country, value: Math.round(cur * c.share) }))} />
          </Panel>
        </div>

        <Panel title="When people scan" desc="Scans by weekday and hour, your local time.">
          <Heatmap grid={grid} total={cur} />
        </Panel>

        <Panel title="Top codes" desc="Last 30 days.">
          <div className="-mx-5 overflow-x-auto sm:-mx-6">
            <table className="w-full min-w-[520px] text-left">
              <thead className="font-mono text-[11px] uppercase tracking-[0.08em] text-fg-subtle">
                <tr className="border-b border-line">
                  <th className="px-5 pb-3 font-normal sm:px-6">Code</th>
                  <th className="px-3 pb-3 text-right font-normal">Scans</th>
                  <th className="w-[38%] px-5 pb-3 font-normal sm:px-6">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {top.map((c) => {
                  const share = c.scans30 / CODES.reduce((s, x) => s + x.scans30, 0);
                  return (
                    <tr key={c.id}>
                      <td className="px-5 py-3 sm:px-6">
                        <Link href={`/dashboard/codes/${c.id}`} className="flex items-center gap-3 font-medium text-fg hover:underline">
                          <QrThumb data={`https://${c.shortUrl}`} design={c.design} className="size-8" />
                          <span className="truncate">{c.name}</span>
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-fg">{c.scans30.toLocaleString("en-US")}</td>
                      <td className="px-5 py-3 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-2 flex-1 rounded-full bg-glass-strong"><div className="h-2 rounded-full bg-fg/60" style={{ width: `${share * 100 * 3}%` }} /></div>
                          <span className="w-10 text-right tabular-nums text-fg-muted">{Math.round(share * 100)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-line bg-bg-raised p-5 sm:p-6" aria-label={title}>
      <h2 className="text-body font-semibold text-fg">{title}</h2>
      {desc && <p className="mt-1 text-fg-muted">{desc}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}
