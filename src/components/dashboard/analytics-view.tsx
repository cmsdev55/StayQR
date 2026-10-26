"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { BarList, Heatmap, ScansChart } from "@/components/dashboard/charts";
import { QrThumb } from "@/components/dashboard/qr-thumb";
import { SegmentedToggle } from "@/components/ui/toggle";
import type { Analytics, Range } from "@/lib/dashboard-types";
import { cn } from "@/lib/utils";

/** Analytics: one filter row scopes every number below it; a refetch keeps the frame (no skeleton flash). */
export function AnalyticsView({ data, codes }: { data: Analytics; codes: { id: string; name: string }[] }) {
  const router = useRouter();
  const [loading, start] = useTransition();
  const go = (range: Range, code: string) => start(() => router.push(`/dashboard/analytics?range=${range}${code !== "all" ? `&code=${code}` : ""}`, { scroll: false }));

  const { series, total: cur, previousTotal: prev, range } = data;
  const best = series.reduce((a, b) => (b.current > a.current ? b : a), series[0]);
  const pct = (a: number, b: number) => (b ? Math.round(((a - b) / b) * 100) : a ? 100 : 0);
  const name = data.code === "all" ? "All codes" : (codes.find((c) => c.id === data.code)?.name || "Untitled code");
  const until = data.until ? new Date(data.until).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null;
  const allTotal = data.top.reduce((s, t) => s + t.scans, 0);

  const tiles = [
    { label: "Scans", value: cur, delta: pct(cur, prev) },
    { label: "Average per day", value: Math.round(cur / series.length), delta: pct(cur, prev) },
    { label: "Codes scanned", value: data.codesScanned, sub: data.code === "all" ? `of ${codes.length}` : "this code" },
    { label: "Busiest day", value: best?.current ?? 0, sub: best?.current ? best.label : "No scans yet" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-h4 font-semibold text-fg sm:text-[26px]">Analytics</h1>
          <p className="mt-1 text-fg-muted">
            {name} · last {range} days{until ? ` to ${until}` : ""}, compared with the {range} days before
          </p>
        </div>
        <a href={`/api/export/scans${data.code !== "all" ? `?code=${data.code}` : ""}`} className="inline-flex h-10 items-center rounded-sm border border-line px-4 font-medium text-fg transition-colors hover:bg-glass-strong">
          Export CSV
        </a>
      </div>

      {until && (
        <p role="status" className="mt-6 rounded-md border border-warning/30 bg-warning/[0.06] px-4 py-3 text-fg">
          Your plan ended on {until}. Your codes keep working; <Link href="/dashboard/billing" className="underline underline-offset-4">resume a plan</Link> to see scans since then.
        </p>
      )}

      {/* Filters: one row, above everything they scope */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <SegmentedToggle
          label="Date range"
          size="sm"
          value={String(range) as "7" | "30" | "90"}
          onChange={(v) => go(Number(v) as Range, data.code)}
          options={[
            { value: "7", label: "7 days" },
            { value: "30", label: "30 days" },
            { value: "90", label: "90 days" },
          ]}
        />
        <label className="flex items-center gap-2">
          <span className="sr-only">Code</span>
          <select value={data.code} onChange={(e) => go(range, e.target.value)} className="h-10 max-w-[260px] rounded-sm border border-line bg-bg-raised px-3 text-fg hover:border-line-strong focus:border-accent focus:outline-none">
            <option value="all">All codes</option>
            {codes.map((c) => <option key={c.id} value={c.id}>{c.name || "Untitled code"}</option>)}
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
                  {t.delta >= 0 ? "↑" : "↓"} {Math.abs(t.delta)}% <span className="text-fg-subtle">vs previous {range} days</span>
                </p>
              ) : (
                <p className="mt-1 font-mono text-[12px] text-fg-subtle">{t.sub}</p>
              )}
            </div>
          ))}
        </div>

        <Panel title="Scans per day" desc={cur ? undefined : "No scans in this period yet. Print the code and scan it once to see it here."}>
          <ScansChart data={series} />
        </Panel>

        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Devices">
            <BarList total={Math.max(1, cur)} items={data.devices} />
          </Panel>
          <Panel title="Top cities" desc="Approximate, from the scanner's network. We don't store IP addresses.">
            <BarList total={Math.max(1, cur)} items={data.cities.length ? data.cities : [{ label: "No scans yet", value: 0 }]} />
          </Panel>
        </div>

        <Panel title="When people scan" desc="Scans by weekday and hour, your local time.">
          <Heatmap grid={data.heatmap} total={cur} />
        </Panel>

        {data.code === "all" && data.top.length > 0 && (
          <Panel title="Top codes" desc={`Last ${range} days.`}>
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
                  {data.top.map((c) => {
                    const share = c.scans / Math.max(1, cur);
                    return (
                      <tr key={c.id}>
                        <td className="px-5 py-3 sm:px-6">
                          <Link href={`/dashboard/codes/${c.id}`} className="flex items-center gap-3 font-medium text-fg hover:underline">
                            <QrThumb data={`https://${c.shortUrl}`} design={c.design} className="size-8" />
                            <span className="truncate">{c.name || "Untitled code"}</span>
                          </Link>
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums text-fg">{c.scans.toLocaleString("en-US")}</td>
                        <td className="px-5 py-3 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-2 flex-1 rounded-full bg-glass-strong"><div className="h-2 rounded-full bg-fg/60" style={{ width: `${Math.min(100, (c.scans / Math.max(1, allTotal)) * 100)}%` }} /></div>
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
        )}
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
