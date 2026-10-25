"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { detectTier, useActive, useReducedMotion, useTheme, type DeviceTier } from "@/hooks/use-environment";
import { cn } from "@/lib/utils";

// 3D lives in its own chunk, fetched only after the page's text has painted.
const HeroScene = dynamic(() => import("@/components/three/hero-scene"), { ssr: false });

const SCANS = [
  { city: "Lahore, PK", device: "iPhone" },
  { city: "Manchester, UK", device: "Android" },
  { city: "Austin, US", device: "iPhone" },
  { city: "Dubai, AE", device: "Android" },
  { city: "Toronto, CA", device: "iPhone" },
  { city: "Berlin, DE", device: "Android" },
  { city: "Sydney, AU", device: "iPhone" },
];

export function HeroVisual() {
  const box = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const theme = useTheme();
  const active = useActive(box);
  const [tier, setTier] = useState<DeviceTier | null>(null);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const [scan, setScan] = useState<{ i: number; n: number } | null>(null);

  useEffect(() => {
    const t = detectTier();
    setTier(t);
    if (t === "none") return;
    // Wait for idle after first paint so text, LCP and hydration go first.
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const go = () => setMount(true);
    if (w.requestIdleCallback) w.requestIdleCallback(go, { timeout: 1200 });
    else setTimeout(go, 300);
  }, []);

  const onScan = useCallback(() => {
    setScan((s) => ({ i: s ? (s.i + 1) % SCANS.length : 0, n: s ? s.n + 1 : 12409 }));
  }, []);

  const use3D = mount && !reduced && tier !== null && tier !== "none";
  const s = scan ? SCANS[scan.i] : null;

  return (
    <div
      ref={box}
      className="relative z-0 mx-auto -mt-4 h-[clamp(360px,100vw,480px)] w-full max-w-wide sm:-mt-12 sm:h-[clamp(480px,46vw,660px)]"
    >
      {/* depth glow (blue-violet, behind the code only) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[18%] h-[90%] w-[min(1100px,120%)] -translate-x-1/2 rounded-full opacity-70 [background:radial-gradient(closest-side,rgb(var(--depth)/0.30),rgb(var(--depth)/0.08)_55%,transparent)] [[data-theme=light]_&]:opacity-40"
      />

      {/* Static fallback: shown until the scene is ready, and always on reduced-motion / weak devices.
          Dark is preloaded (it is often the LCP element); light only loads when light mode is on. */}
      {(["dark", "light"] as const).map((t) => (
        // Plain <img>: the files are already small, pre-sized webp (26–37 KB), so skipping the
        // optimizer saves a redirect hop; dark gets fetchpriority=high as the usual LCP element.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={t}
          src={`/hero-qr-${t}.webp`}
          alt=""
          aria-hidden
          width={1360}
          height={660}
          fetchPriority={t === "dark" ? "high" : "low"}
          loading={t === "dark" ? "eager" : "lazy"}
          decoding={t === "dark" ? "sync" : "async"}
          className={cn(
            "pointer-events-none absolute inset-0 h-full w-full select-none object-cover transition-opacity duration-slow ease-stay [mask-image:radial-gradient(ellipse_58%_62%_at_50%_58%,#000_60%,transparent_100%)]",
            t === "dark" ? "[[data-theme=light]_&]:hidden" : "hidden [[data-theme=light]_&]:block",
            use3D && ready ? "opacity-0" : "opacity-100",
          )}
        />
      ))}

      {use3D && (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-slow ease-stay [mask-image:radial-gradient(ellipse_58%_62%_at_50%_58%,#000_60%,transparent_100%)]",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <HeroScene
            tier={tier as "high" | "low"}
            theme={theme}
            active={active}
            onScan={onScan}
            onReady={() => setReady(true)}
          />
        </div>
      )}

      {/* bottom fade into the page */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-bg" />

      {/* "Scanned in …" toast, driven by the 3D scan beam */}
      <div className="pointer-events-none absolute bottom-[14%] left-1/2 z-10 w-[min(280px,calc(100%-32px))] -translate-x-1/2 sm:bottom-auto sm:left-auto sm:right-[8%] sm:top-[22%] sm:translate-x-0 lg:right-[12%]" aria-live="polite">
        {(s || !use3D) && (
          <div
            key={scan?.n ?? "static"}
            className="toast-in glass flex items-center gap-3 rounded-md bg-bg-overlay/70 px-4 py-3 shadow-lg"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-accent/[0.14]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-text" aria-hidden>
                <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
                <circle cx="12" cy="9.5" r="2.5" />
              </svg>
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-body-sm font-semibold text-fg">Scanned in {(s ?? SCANS[0]).city}</span>
              <span className="font-mono text-[12px] text-fg-muted">
                {(s ?? SCANS[0]).device} · just now · #{(scan?.n ?? 12409).toLocaleString("en-US")}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
