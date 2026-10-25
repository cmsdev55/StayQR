import type { ReactNode } from "react";
import { Pausable } from "@/components/motion/pausable";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { qrMatrix, qrPath } from "@/lib/qr";
import { cn } from "@/lib/utils";
import { GlobeVisual } from "./features/globe-card";

/**
 * Section 4: features bento (6 columns × 280px rows on desktop, DESIGN.md §3).
 * Every loop is CSS (see "Bento loops" in globals.css), paused off screen by <Pausable>
 * and frozen on its first frame for reduced motion. Only the globe is 3D.
 */
export function Features() {
  const menu = qrMatrix("https://osteria.co/m", 0);
  const small = qrMatrix("https://stayqr.com/s", 0);
  return (
    <section id="features" aria-labelledby="features-title" className="relative border-t border-line py-24 lg:py-40">
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <SectionHeading
          id="features-title"
          eyebrow="Features"
          title="Everything a printed code *needs.*"
          intro="Change destinations, see who scans, and make hundreds of codes at once, from one calm dashboard."
        />

        <Pausable className="bento mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-6 lg:auto-rows-[280px] lg:gap-5" data-loop>
          {/* 1 · Edit after printing */}
          <Tile i={0} className="lg:col-span-4" title="Edit after printing" body="Change where a code points any time. The one on the table stays exactly the same.">
            <div className="flex h-full items-center gap-4 sm:gap-6">
              <div className="relative shrink-0">
                <div className="rounded-sm bg-white p-2 shadow-md">
                  <MiniQR m={menu} className="size-[72px] text-[#0B0D12] sm:size-[88px]" />
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-fg-subtle">printed once</span>
              </div>
              <div className="relative h-px min-w-6 flex-1 [background-image:linear-gradient(90deg,var(--border-strong)_50%,transparent_0)] [background-size:8px_1px]">
                <span className="url-dot absolute inset-0">
                  <span className="absolute -left-[3px] -top-[3px] size-[7px] rounded-full bg-accent" />
                </span>
              </div>
              <div className="min-w-0 shrink">
                <div className="glass flex h-11 items-center gap-2 rounded-full bg-glass-strong pl-3 pr-4 font-mono text-[12px] sm:text-[13px]">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="shrink-0 text-fg-subtle" aria-hidden><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></svg>
                  <span className="text-fg-muted">osteria.co/menu/</span>
                  <span className="relative inline-block h-[1.5em] overflow-hidden align-top">
                    <span className="url-morph flex flex-col text-fg">
                      <span className="h-[1.5em] leading-[1.5em]">summer</span>
                      <span className="h-[1.5em] leading-[1.5em]">autumn</span>
                      <span className="h-[1.5em] leading-[1.5em]">winter</span>
                      <span className="h-[1.5em] leading-[1.5em]">summer</span>
                    </span>
                  </span>
                </div>
                <p className="url-saved mt-2 flex items-center gap-1.5 pl-3 font-mono text-[11px] text-accent-text">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 8.5l3 3 7-7" /></svg>
                  Saved · live in 1s
                </p>
              </div>
            </div>
          </Tile>

          {/* 2 · Style cycler */}
          <Tile i={1} className="lg:col-span-2" title="Make it yours" body="Colours, dot styles and corners. Every style still scans.">
            <div className="flex h-full items-center justify-center gap-5">
              <div className="relative size-[112px] rounded-md bg-white p-2.5 shadow-md">
                {(
                  [
                    ["square", "#0B0D12"],
                    ["rounded", "#5B21B6"],
                    ["dots", "#065F46"],
                  ] as const
                ).map(([shape, color], k) => (
                  <MiniQR key={shape} m={small} shape={shape} className="style-cycle absolute inset-2.5" style={{ color, animationDelay: `${-k * 3 + 0}s`, ["--k" as string]: k }} />
                ))}
              </div>
              <ul className="flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.08em]">
                {["Square", "Rounded", "Dots"].map((l, k) => (
                  <li key={l} className="style-label flex items-center gap-2 text-fg-subtle" style={{ animationDelay: `${-k * 3}s` }}>
                    <span className="size-1.5 rounded-full bg-current" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </Tile>

          {/* 3 · ScanGlobe */}
          <Card tilt spotlight data-reveal="" style={{ ["--stagger" as string]: 2 }} className="relative min-h-[420px] p-6 sm:col-span-2 sm:p-8 lg:col-span-3 lg:row-span-2 lg:min-h-0">
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 [background:radial-gradient(60%_60%_at_50%_85%,rgb(var(--depth)/0.22),transparent_70%)]" />
            <GlobeVisual />
            <div className="relative">
              <h3 className="font-display text-h3 font-semibold text-fg">See every scan</h3>
              <p className="mt-2 max-w-[34ch] text-body-sm text-fg-muted">Live map of scans by city, device and time of day. Analytics on every plan, for every code.</p>
            </div>
          </Card>

          {/* 4 · iOS / Android split */}
          <Tile i={3} className="lg:col-span-3" title="One code, two app stores" body="iPhones go to the App Store, Android to Google Play. Everyone else gets your website.">
            <div className="flex h-full items-center justify-between gap-2">
              <Store name="App Store" os="iPhone" side="left" />
              <div className="relative flex flex-1 items-center">
                <span className="relative h-px flex-1 [background-image:linear-gradient(90deg,var(--border-strong)_50%,transparent_0)] [background-size:6px_1px]">
                  <span className="split-left absolute inset-0">
                    <span className="absolute -left-[3px] -top-[3px] size-[7px] rounded-full bg-accent" />
                  </span>
                </span>
                <div className="mx-2 rounded-sm bg-white p-1.5 shadow-md">
                  <MiniQR m={small} className="size-14 text-[#0B0D12]" />
                </div>
                <span className="relative h-px flex-1 [background-image:linear-gradient(90deg,var(--border-strong)_50%,transparent_0)] [background-size:6px_1px]">
                  <span className="split-right absolute inset-0">
                    <span className="absolute -left-[3px] -top-[3px] size-[7px] rounded-full bg-accent" />
                  </span>
                </span>
              </div>
              <Store name="Google Play" os="Android" side="right" />
            </div>
          </Tile>

          {/* 5 · Infinite code stack */}
          <Tile i={4} className="lg:col-span-3" title="Unlimited codes" body="No cap on codes or scans. One for every table, sign and box you print.">
            <div className="flex h-full items-center justify-center gap-8">
              <div className="relative h-[104px] w-[150px]">
                {[0, 1, 2, 3].map((k) => (
                  <div
                    key={k}
                    className="code-stack absolute inset-x-0 bottom-0 flex items-center gap-3 rounded-sm border border-line bg-bg-overlay p-2.5 shadow-md"
                    style={{ animationDelay: `${-k * 2}s`, ["--k" as string]: k }}
                  >
                    <div className="rounded-[6px] bg-white p-1">
                      <MiniQR m={small} className="size-9 text-[#0B0D12]" />
                    </div>
                    <div className="font-mono text-[11px] leading-tight">
                      <p className="text-fg">#{(1204 + 3 - k).toLocaleString("en-US")}</p>
                      <p className="text-fg-subtle">{["Table 4", "Window", "Box lid", "Flyer"][k]}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden text-center sm:block">
                <p className="font-display text-display-md font-semibold text-fg">∞</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-fg-subtle">codes</p>
              </div>
            </div>
          </Tile>

          {/* 6 · CSV rows → codes */}
          <Tile i={5} className="sm:col-span-2 lg:col-span-4" title="Bulk create from CSV" body="Upload a spreadsheet, get a print-ready code for every row in seconds.">
            <div className="flex h-full items-center gap-4 sm:gap-8">
              <div className="min-w-0 flex-1 overflow-hidden rounded-sm border border-line font-mono text-[11px] sm:text-[12px]">
                <div className="flex items-center gap-2 border-b border-line bg-glass-strong px-3 py-1.5 text-fg-subtle">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M4 1.5h5.5L13 5v9.5H4z" /><path d="M9.5 1.5V5H13" /></svg>
                  tables.csv
                </div>
                {[1, 2, 3, 4].map((t, k) => (
                  <div key={t} className="csv-row flex gap-3 border-b border-line px-3 py-1.5 last:border-0" style={{ animationDelay: `${k * 0.9}s` }}>
                    <span className="w-14 shrink-0 text-fg-muted">Table {t}</span>
                    <span className="truncate text-fg-subtle">osteria.co/t/{t}</span>
                  </div>
                ))}
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-fg-subtle" aria-hidden><path d="M4 10h12M11 5l5 5-5 5" /></svg>
              <div className="grid shrink-0 grid-cols-2 gap-2">
                {[0, 1, 2, 3].map((k) => (
                  <div key={k} className="csv-code rounded-[6px] bg-white p-1 shadow-sm" style={{ animationDelay: `${k * 0.9}s` }}>
                    <MiniQR m={qrMatrix(`https://osteria.co/t/${k + 1}`, 0)} className="size-9 text-[#0B0D12] sm:size-11" />
                  </div>
                ))}
              </div>
            </div>
          </Tile>

          {/* 7 · Unlimited scans */}
          <Tile i={6} className="sm:col-span-2 lg:col-span-2" title="Unlimited scans" body="No caps, no throttling, no surprise bills when a code goes viral.">
            <div className="flex h-full flex-col justify-center">
              <AnimatedCounter value={48291} from={0} group duration={1800} className="font-display text-display-md font-semibold text-fg" label="48,291 scans this month" />
              <p className="mt-1 font-mono text-[11px] text-fg-subtle">scans this month</p>
              <div className="mt-4 flex h-12 items-end gap-1" aria-hidden>
                {[30, 42, 38, 55, 48, 62, 58, 70, 66, 80, 74, 88, 84, 96].map((h, k) => (
                  <span key={k} className={cn("bar-grow flex-1 rounded-t-[3px]", k === 13 ? "bg-accent" : "bg-fg/15")} style={{ height: `${h}%`, transitionDelay: `${300 + k * 40}ms` }} />
                ))}
              </div>
            </div>
          </Tile>
        </Pausable>
      </div>
    </section>
  );
}

function Tile({ i, title, body, className, children }: { i: number; title: string; body: string; className?: string; children: ReactNode }) {
  return (
    <Card tilt spotlight data-reveal="" style={{ ["--stagger" as string]: i }} className={cn("flex min-h-[280px] flex-col p-6 sm:p-7 lg:min-h-0", className)}>
      <div className="min-h-0 flex-1 pb-5" aria-hidden>{children}</div>
      <h3 className="font-display text-[22px] font-semibold leading-tight tracking-[-0.02em] text-fg">{title}</h3>
      <p className="mt-1.5 max-w-[46ch] text-body-sm text-fg-muted">{body}</p>
    </Card>
  );
}

function MiniQR({ m, shape = "square", className, style }: { m: boolean[][]; shape?: "square" | "rounded" | "dots"; className?: string; style?: React.CSSProperties }) {
  const n = m.length;
  return (
    <svg viewBox={`-0.5 -0.5 ${n + 1} ${n + 1}`} className={className} style={style} aria-hidden>
      <path d={qrPath(m, shape)} fill="currentColor" />
    </svg>
  );
}

function Store({ name, os, side }: { name: string; os: string; side: "left" | "right" }) {
  return (
    <div className={cn("store flex w-[104px] shrink-0 flex-col items-center gap-2 rounded-md border border-line p-3 text-center sm:w-[120px]", side === "left" ? "store-left" : "store-right")}>
      <span className="grid size-9 place-items-center rounded-full bg-glass-strong text-fg">
        {side === "left" ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.9-3-.8a4.5 4.5 0 0 0-3.8 2.3c-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2-1.1 2.8-2.3.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.8zM14.2 5.8c.6-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z" /></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M17.5 9.3l1.6-2.8a.4.4 0 0 0-.7-.4l-1.6 2.8a9.8 9.8 0 0 0-8.6 0L6.6 6.1a.4.4 0 0 0-.7.4l1.6 2.8A9.3 9.3 0 0 0 2.5 17h19a9.3 9.3 0 0 0-4-7.7zM7.5 14.3a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm9 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" /></svg>
        )}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-subtle">{os}</span>
      <span className="text-[12px] font-medium text-fg">{name}</span>
    </div>
  );
}
