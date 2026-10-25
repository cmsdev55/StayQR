"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useActive, useReducedMotion, useTheme } from "@/hooks/use-environment";
import { loadGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Scroll story: the same "Subscription cancelled" hits two printed codes. The rival code cracks
 * and falls apart; the StayQR code keeps taking scans. One scrubbed progress value (0–1) drives
 * every beat; scans run on their own clock so the StayQR side visibly stays alive.
 */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const beat = (p: number, a: number, b: number) => ease(clamp01((p - a) / (b - a)));
const BEATS = {
  cancelIn: [0.06, 0.18],
  cancelOut: [0.5, 0.6],
  crack: [0.26, 0.4],
  fall: [0.38, 0.72],
  end: [0.72, 0.94],
} as const;
type Phase = 0 | 1 | 2 | 3 | 4; // live · cancelled · cracking · dead · end
const phaseAt = (p: number): Phase => (p < 0.14 ? 0 : p < 0.27 ? 1 : p < 0.42 ? 2 : p < 0.72 ? 3 : 4);

const CITIES = ["Austin", "Leeds", "Lahore", "Lyon", "Osaka", "Denver", "Porto", "Dubai", "Oslo", "Perth"];
const END_WORDS = "Cancel anytime. Your codes keep working. Forever.".split(" ");

type Cell = { r: number; c: number; delay: number; vx: number; spin: number };
type Ping = { t0: number; r: number; c: number; failed?: boolean };

function seeded(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
}

/** A jagged crack across the rival code, in 0–1 coordinates, plus two branches. */
function makeCracks() {
  const rnd = seeded(91);
  const line = (x0: number, y0: number, x1: number, y1: number, steps: number, jag: number) => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const j = i === 0 || i === steps ? 0 : (rnd() - 0.5) * jag;
      pts.push([x0 + (x1 - x0) * t + j, y0 + (y1 - y0) * t + j * 0.6]);
    }
    return pts;
  };
  return [line(0.86, 0.02, 0.18, 0.98, 9, 0.12), line(0.55, 0.42, 0.98, 0.62, 4, 0.08), line(0.36, 0.7, 0.02, 0.5, 3, 0.07)];
}

function cellsOf(rows: string[], crack: [number, number][][], seed: number): Cell[] {
  const n = rows.length;
  const rnd = seeded(seed);
  const pts = crack.flat();
  const out: Cell[] = [];
  rows.forEach((row, r) =>
    [...row].forEach((ch, c) => {
      if (ch !== "1") return;
      const x = (c + 0.5) / n, y = (r + 0.5) / n;
      // modules near the crack let go first
      let d = Infinity;
      for (const [px, py] of pts) d = Math.min(d, Math.hypot(px - x, py - y));
      out.push({ r, c, delay: Math.min(1, d * 1.6) * 0.75 + rnd() * 0.2, vx: (rnd() - 0.5) * 2, spin: (rnd() - 0.5) * 6 });
    }),
  );
  return out;
}

function readColors() {
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string) => cs.getPropertyValue(name).trim().split(/\s+/).map(Number) as [number, number, number];
  return { fg: v("--text"), subtle: v("--text-subtle"), accent: v("--accent"), accentText: v("--accent-text"), danger: v("--danger"), bg: v("--bg") };
}
const rgba = ([r, g, b]: number[], a = 1) => `rgba(${r | 0},${g | 0},${b | 0},${a})`;
const mix = (a: number[], b: number[], t: number) => a.map((x, i) => x + (b[i] - x) * t);

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, rad: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, s, s, rad);
  ctx.fill();
}

export function NeverDiesStage({ theirs, ours }: { theirs: string[]; ours: string[] }) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cvTheirs = useRef<HTMLCanvasElement>(null);
  const cvOurs = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const theme = useTheme();
  const active = useActive(stage);

  // SSR / no-JS / reduced motion: the finished story. Motion resets it to the start on mount.
  const [phase, setPhase] = useState<Phase>(4);
  const [scans, setScans] = useState({ theirs: 8214, failed: 0, ours: 12409 });
  const [chip, setChip] = useState<{ id: number; city: string } | null>(null);
  const [failChip, setFailChip] = useState<number | null>(null);

  const progress = useRef(1);
  const cracks = useMemo(makeCracks, []);
  const theirCells = useMemo(() => cellsOf(theirs, cracks, 7), [theirs, cracks]);
  const ourCells = useMemo(() => cellsOf(ours, [], 3), [ours]);
  const ourGlow = useMemo(() => ({ hit: new Float32Array(ourCells.length).fill(-1e9) }), [ourCells]);

  // ── Scroll: pin + scrub (motion only) ────────────────────────────────
  useEffect(() => {
    // read the media query directly: the hook starts false, and a first pass with motion
    // would reset the story to its start before the real preference arrives
    if (reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      progress.current = 1;
      applyVars(1);
      setPhase(4);
      return;
    }
    let dead = false;
    let kill = () => {};
    progress.current = 0;
    applyVars(0);
    setPhase(0);
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (dead || !track.current || !stage.current) return;
      const proxy = { p: 0 };
      const tween = gsap.to(proxy, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: track.current,
          start: "top top",
          end: "bottom bottom",
          pin: stage.current,
          pinSpacing: false, // the track already reserves the scroll distance (no layout jump)
          scrub: 0.8,
        },
        onUpdate: () => {
          progress.current = proxy.p;
          applyVars(proxy.p);
          const ph = phaseAt(proxy.p);
          setPhase((old) => (old === ph ? old : ph));
        },
      });
      kill = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
      ScrollTrigger.refresh();
    });
    return () => {
      dead = true;
      kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  function applyVars(p: number) {
    const s = stage.current?.style;
    if (!s) return;
    s.setProperty("--b-in", beat(p, ...BEATS.cancelIn).toFixed(4));
    s.setProperty("--b-out", beat(p, ...BEATS.cancelOut).toFixed(4));
    s.setProperty("--b-end", beat(p, ...BEATS.end).toFixed(4));
  }

  // ── Canvas painting + scan clock ─────────────────────────────────────
  useEffect(() => {
    const a = cvTheirs.current, b = cvOurs.current;
    if (!a || !b) return;
    const colors = readColors();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const fit = (cv: HTMLCanvasElement) => {
      const r = cv.getBoundingClientRect();
      const w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
      }
      return { w, h };
    };
    const pings: { theirs: Ping[]; ours: Ping[] } = { theirs: [], ours: [] };
    let nextTheirs = 0.6, nextOurs = 0.2, raf = 0, last = performance.now() / 1000;
    const rnd = seeded(5);
    const pick = (cells: Cell[]) => cells[Math.floor(rnd() * cells.length)];
    let chipId = 0;

    const draw = (now: number) => {
      const p = progress.current;
      const crackP = beat(p, ...BEATS.crack);
      const fallP = clamp01((p - BEATS.fall[0]) / (BEATS.fall[1] - BEATS.fall[0]));
      const dim = beat(p, BEATS.cancelIn[0], BEATS.crack[1]);

      // rival code
      {
        const ctx = a.getContext("2d")!;
        const { w, h } = fit(a);
        ctx.clearRect(0, 0, w, h);
        const n = theirs.length, size = Math.min(w, h), m = size / n, ox = (w - size) / 2, oy = (h - size) / 2;
        const base = mix(colors.fg, colors.subtle, dim * 0.75);
        for (const cell of theirCells) {
          const u = clamp01((fallP * 1.6 - cell.delay) / 0.55);
          if (u >= 1) continue;
          const alpha = Math.pow(1 - u, 1.3);
          const x = ox + cell.c * m + cell.vx * u * m * 4;
          const y = oy + cell.r * m + u * u * size * 0.95;
          ctx.fillStyle = rgba(u > 0 ? mix(base, colors.danger, 0.35) : base, alpha);
          if (u > 0) {
            ctx.save();
            ctx.translate(x + m / 2, y + m / 2);
            ctx.rotate(cell.spin * u);
            roundRect(ctx, -m * 0.42 * (1 - u * 0.4), -m * 0.42 * (1 - u * 0.4), m * 0.84 * (1 - u * 0.4), m * 0.2);
            ctx.restore();
          } else roundRect(ctx, x + m * 0.08, y + m * 0.08, m * 0.84, m * 0.2);
        }
        // the crack: a dark split with a thin red edge, drawn in as it spreads
        if (crackP > 0 && fallP < 1) {
          const fade = 1 - clamp01(fallP * 1.4);
          for (const [li, pts] of cracks.entries()) {
            const reach = clamp01(crackP * (li === 0 ? 1 : 1.6) - (li === 0 ? 0 : 0.5));
            if (reach <= 0) continue;
            const upto = reach * (pts.length - 1);
            for (const [stroke, width] of [[rgba(colors.bg, fade), 4], [rgba(colors.danger, fade * 0.9), 1.25]] as const) {
              ctx.strokeStyle = stroke;
              ctx.lineWidth = width * dpr * (li === 0 ? 1 : 0.7);
              ctx.lineJoin = "round";
              ctx.beginPath();
              for (let i = 0; i <= Math.ceil(upto); i++) {
                const t = Math.min(1, upto - i + 1);
                const [x0, y0] = pts[Math.max(0, i - 1)], [x1, y1] = pts[i];
                const X = i === 0 ? x1 : x0 + (x1 - x0) * t, Y = i === 0 ? y1 : y0 + (y1 - y0) * t;
                const px = ox + X * size, py = oy + Y * size;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
              }
              ctx.stroke();
            }
          }
        }
        // where the code used to be
        if (fallP > 0.4) {
          ctx.strokeStyle = rgba(colors.subtle, 0.35 * clamp01((fallP - 0.4) / 0.4));
          ctx.lineWidth = dpr;
          ctx.setLineDash([4 * dpr, 5 * dpr]);
          ctx.strokeRect(ox + m * 0.5, oy + m * 0.5, size - m, size - m);
          ctx.setLineDash([]);
        }
        drawPings(ctx, pings.theirs, now, ox, oy, m, colors);
      }

      // StayQR code: lit modules stay softly lime
      {
        const ctx = b.getContext("2d")!;
        const { w, h } = fit(b);
        ctx.clearRect(0, 0, w, h);
        const n = ours.length, size = Math.min(w, h), m = size / n, ox = (w - size) / 2, oy = (h - size) / 2;
        const lime = theme === "light" ? colors.accent : colors.accent;
        ourCells.forEach((cell, i) => {
          const since = now - ourGlow.hit[i];
          const g = ourGlow.hit[i] < 0 ? 0 : Math.max(0.18, Math.exp(-since * 2.2));
          ctx.fillStyle = rgba(mix(colors.fg, lime, g * (theme === "light" ? 1 : 0.92)));
          roundRect(ctx, ox + cell.c * m + m * 0.08, oy + cell.r * m + m * 0.08, m * 0.84, m * 0.2);
        });
        drawPings(ctx, pings.ours, now, ox, oy, m, colors, theme === "light" ? colors.accentText : colors.accent, (pg, rad) => {
          // light up the modules the ring passes over
          ourCells.forEach((cell, i) => {
            const d = Math.hypot(cell.c - pg.c, cell.r - pg.r);
            if (d < Math.min(rad, 4.5) && now - ourGlow.hit[i] > 0.5) ourGlow.hit[i] = now - (rad - d) * 0.02;
          });
        });
      }
    };

    const tick = (ms: number) => {
      const now = ms / 1000;
      const dt = Math.min(0.1, now - last);
      last = now;
      nextOurs -= dt;
      nextTheirs -= dt;
      const ph = phaseAt(progress.current);
      if (nextOurs <= 0) {
        nextOurs = 1.1 + rnd() * 0.6;
        const c = pick(ourCells);
        pings.ours.push({ t0: now, r: c.r, c: c.c });
        setScans((s) => ({ ...s, ours: s.ours + 1 }));
        setChip({ id: ++chipId, city: CITIES[chipId % CITIES.length] });
      }
      if (nextTheirs <= 0) {
        nextTheirs = 1.4 + rnd() * 0.8;
        if (ph <= 1) {
          const c = pick(theirCells);
          pings.theirs.push({ t0: now, r: c.r, c: c.c });
          setScans((s) => ({ ...s, theirs: s.theirs + 1 }));
        } else if (ph >= 3) {
          const n = theirs.length;
          // failed scans land above or below the "no longer works" label
          const band = rnd() < 0.5 ? 0.08 + rnd() * 0.16 : 0.76 + rnd() * 0.16;
          pings.theirs.push({ t0: now, r: n * band, c: n * (0.2 + rnd() * 0.6), failed: true });
          setScans((s) => ({ ...s, failed: s.failed + 1 }));
          setFailChip(++chipId);
        }
      }
      for (const k of ["theirs", "ours"] as const) pings[k] = pings[k].filter((pg) => now - pg.t0 < 1.2);
      draw(now);
      raf = requestAnimationFrame(tick);
    };

    if (reduced) {
      // a still frame of the end state, with a few StayQR modules lit
      const now = performance.now() / 1000;
      ourCells.forEach((_, i) => i % 3 === 0 && (ourGlow.hit[i] = now - 10));
      draw(now);
      const ro = new ResizeObserver(() => draw(now));
      ro.observe(a);
      return () => ro.disconnect();
    }
    if (!active) {
      draw(performance.now() / 1000);
      return;
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced, theme, theirs, ours, theirCells, ourCells, ourGlow, cracks]);

  const dead = phase >= 3;
  const cancelled = phase >= 1;

  return (
    <div ref={track} className="story-track relative">
      <div
        ref={stage}
        className="story-stage relative flex h-[100svh] flex-col overflow-hidden"
        style={{ ["--b-in" as string]: 1, ["--b-out" as string]: 1, ["--b-end" as string]: 1 }}
      >
        <div className="mx-auto flex min-h-0 w-full max-w-wide flex-1 flex-col px-4 pb-6 pt-20 sm:px-6 sm:pb-10 sm:pt-24 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16 lg:px-12 lg:pb-12 lg:pt-28">
          {/* Heading: the question, then the answer masks in over it at the end */}
          <div className="text-center lg:text-left">
            <p className="eyebrow">What happens when you cancel</p>
            <div className="mt-4 grid [&>*]:[grid-area:1/1] lg:mt-6">
              <h2
                id="story-title"
                className="mx-auto max-w-[16ch] self-center font-display text-display-lg font-semibold text-fg [text-wrap:balance] lg:mx-0 lg:self-start lg:text-display-xl"
                style={{ opacity: "calc(1 - var(--b-end) * 1.6)", transform: "translateY(calc(var(--b-end) * -16px))" }}
              >
                Most QR codes are rentals.
              </h2>
              <p className="mx-auto max-w-[17ch] self-center font-display text-display-md font-semibold text-fg [text-wrap:balance] sm:text-display-lg lg:mx-0 lg:self-start">
                {END_WORDS.map((w, i) => (
                  <span key={i}>
                    <span className="reveal-word">
                      <span
                        className={i === END_WORDS.length - 1 ? "text-accent-text" : undefined}
                        style={{
                          transform: `translateY(calc((1 - clamp(0, calc(var(--b-end) * ${END_WORDS.length + 1} - ${i}), 1)) * 105%))`,
                        }}
                      >
                        {w}
                      </span>
                    </span>
                    {i < END_WORDS.length - 1 ? " " : null}
                  </span>
                ))}
              </p>
            </div>
            <p
              className="mx-auto mt-4 max-w-[40ch] text-body text-fg-muted sm:mt-6 sm:text-body-lg lg:mx-0"
              style={{ opacity: "calc(1 - var(--b-end) * 1.6)" }}
            >
              With some QR services, stop paying and the codes you printed pause or freeze where they are. Menus,
              signs and packaging stop doing their job.
            </p>
          </div>

          <p className="sr-only">
            With some dynamic QR services, cancelling pauses printed codes or freezes them so they can no longer be
            edited. When you cancel StayQR, your codes keep redirecting to their last destination, for life.
          </p>

          {/* The two printed codes */}
          <div aria-hidden className="relative mx-auto mt-6 flex min-h-0 w-full max-w-[760px] flex-1 items-center sm:mt-10 lg:mt-0 lg:h-full">
          <div className="relative grid w-full grid-cols-2 gap-3 sm:gap-6">
            <StoryCard
              label="A rented dynamic QR"
              status={dead ? { text: "Dead", tone: "danger" } : cancelled ? { text: "Plan cancelled", tone: "warning" } : { text: "Live", tone: "neutral" }}
              footer={
                <>
                  <span>Scans</span>
                  <span className="tabular-nums text-fg-muted">{scans.theirs.toLocaleString("en-US")}</span>
                  {dead && <span className="ml-auto tabular-nums text-danger">{scans.failed} failed</span>}
                </>
              }
            >
              <canvas ref={cvTheirs} className="absolute inset-0 h-full w-full" />
              <div
                className={cn(
                  "absolute inset-x-2 top-1/2 flex -translate-y-1/2 flex-col items-center gap-2 text-center transition-[opacity,transform] duration-slow ease-stay",
                  dead ? "opacity-100" : "translate-y-[-30%] opacity-0",
                )}
              >
                <span className="grid size-9 place-items-center rounded-full bg-danger/[0.14] text-danger sm:size-11">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 15l6-6M10.5 6.5l1.4-1.4a4 4 0 0 1 5.7 5.7l-1.4 1.4M13.5 17.5l-1.4 1.4a4 4 0 0 1-5.7-5.7l1.4-1.4M3 3l18 18" />
                  </svg>
                </span>
                <span className="max-w-[16ch] font-display text-[15px] font-semibold leading-tight text-fg sm:text-h4">This code no longer works</span>
                {failChip !== null && (
                  <span key={failChip} className="toast-in hidden font-mono text-[11px] text-danger sm:block">
                    Scan failed · 404
                  </span>
                )}
              </div>
            </StoryCard>

            <StoryCard
              label="StayQR"
              accent
              status={cancelled ? { text: "Still live", tone: "accent" } : { text: "Live", tone: "accent" }}
              footer={
                <>
                  <span>Scans</span>
                  <AnimatedCounter value={scans.ours} group duration={600} className="text-fg" />
                  {cancelled && <span className="ml-auto hidden text-fg-subtle sm:inline">plan cancelled</span>}
                </>
              }
            >
              <canvas ref={cvOurs} className="absolute inset-0 h-full w-full" />
              {chip && (
                <span
                  key={chip.id}
                  className="toast-in glass absolute bottom-2 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-bg-overlay/70 px-3 py-1.5 font-mono text-[11px] text-fg-muted sm:block"
                >
                  <span className="text-accent-text">●</span> Scanned in {chip.city}
                </span>
              )}
            </StoryCard>

            {/* "Subscription cancelled" slides in over both codes, then steps back */}
            <div
              className="pointer-events-none absolute left-1/2 top-[34%] z-10 w-[min(300px,82%)] lg:top-[18%]"
              style={{
                opacity: "calc(var(--b-in) - var(--b-out))",
                transform: "translate(-50%, calc((1 - var(--b-in)) * -28px + var(--b-out) * -12px)) scale(calc(1 - var(--b-out) * 0.04))",
              }}
            >
              <div className="glass flex items-center gap-3 rounded-md bg-bg-overlay/80 p-3 shadow-lg sm:p-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-danger/[0.14] text-danger">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-body-sm font-semibold text-fg">Subscription cancelled</span>
                  <span className="truncate font-mono text-[11px] text-fg-subtle">Both plans end today</span>
                </span>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function drawPings(
  ctx: CanvasRenderingContext2D,
  list: Ping[],
  now: number,
  ox: number,
  oy: number,
  m: number,
  colors: ReturnType<typeof readColors>,
  okColor = colors.fg,
  onRadius?: (pg: Ping, radiusInModules: number) => void,
) {
  for (const pg of list) {
    const age = (now - pg.t0) / 1.2;
    const rad = ease(age) * 7;
    onRadius?.(pg, rad);
    const x = ox + (pg.c + 0.5) * m, y = oy + (pg.r + 0.5) * m;
    ctx.strokeStyle = rgba(pg.failed ? colors.danger : okColor, (1 - age) * 0.9);
    ctx.lineWidth = Math.max(1, m * 0.22);
    ctx.beginPath();
    ctx.arc(x, y, rad * m + m * 0.5, 0, Math.PI * 2);
    ctx.stroke();
    if (pg.failed && age < 0.7) {
      const s = m * 1.2;
      ctx.strokeStyle = rgba(colors.danger, 1 - age / 0.7);
      ctx.beginPath();
      ctx.moveTo(x - s, y - s);
      ctx.lineTo(x + s, y + s);
      ctx.moveTo(x + s, y - s);
      ctx.lineTo(x - s, y + s);
      ctx.stroke();
    }
  }
}

function StoryCard({
  label,
  status,
  footer,
  accent,
  children,
}: {
  label: string;
  status: { text: string; tone: "neutral" | "warning" | "danger" | "accent" };
  footer: React.ReactNode;
  accent?: boolean;
  children: React.ReactNode;
}) {
  const tone = {
    neutral: "bg-glass-strong text-fg-muted",
    warning: "bg-warning/[0.12] text-warning",
    danger: "bg-danger/[0.12] text-danger",
    accent: "bg-accent/[0.14] text-accent-text",
  }[status.tone];
  return (
    <div className="glass flex flex-col rounded-lg p-3 sm:rounded-xl sm:p-5">
      <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
        <span className={cn("max-w-full truncate text-[13px] font-medium sm:text-body-sm", accent ? "text-fg" : "text-fg-muted")}>{label}</span>
        <span className={cn("inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors duration-base ease-stay sm:px-2.5 sm:text-[11px]", tone)}>
          <span className="relative flex size-1.5">
            {status.tone === "accent" && <span className="ping absolute inset-0 rounded-full bg-current" />}
            <span className="relative size-1.5 rounded-full bg-current" />
          </span>
          <span key={status.text} className="toast-in">{status.text}</span>
        </span>
      </div>
      <div className="relative my-3 aspect-square max-h-[calc(100svh-300px)] w-full sm:my-5 lg:max-h-[calc(100svh-260px)]">{children}</div>
      <div className="flex items-center gap-2 border-t border-line pt-2.5 font-mono text-[11px] text-fg-subtle sm:pt-3.5 sm:text-[12px]">{footer}</div>
    </div>
  );
}
