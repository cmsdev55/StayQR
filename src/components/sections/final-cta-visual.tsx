"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useActive, useTheme } from "@/hooks/use-environment";
import { useLazyScene } from "@/hooks/use-lazy-scene";
import { cn } from "@/lib/utils";

const CtaScene = dynamic(() => import("@/components/three/cta-scene"), { ssr: false });

const MASK = "[mask-image:radial-gradient(ellipse_56%_60%_at_50%_50%,#000_55%,transparent_100%)]";

/** Static render of the finished mark until the scene is ready; the scene plays when in view. */
export function FinalCtaVisual() {
  const box = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const active = useActive(box, "0px");
  const { tier, use3D } = useLazyScene(box, "600px");
  const [ready, setReady] = useState(false);
  return (
    <div ref={box} className="relative mx-auto -mt-4 h-[clamp(340px,90vw,440px)] w-full max-w-wide sm:h-[clamp(440px,44vw,600px)]" aria-hidden>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[min(1000px,110%)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 [background:radial-gradient(closest-side,rgb(var(--depth)/0.26),rgb(var(--depth)/0.06)_55%,transparent)] [[data-theme=light]_&]:opacity-40" />
      {(["dark", "light"] as const).map((t) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={t}
          src={`/cta-mark-${t}.webp`}
          alt=""
          width={1360}
          height={600}
          loading="lazy"
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full select-none object-cover transition-opacity duration-slow ease-stay",
            MASK,
            t === "dark" ? "[[data-theme=light]_&]:hidden" : "hidden [[data-theme=light]_&]:block",
            use3D && ready ? "opacity-0" : "opacity-100",
          )}
        />
      ))}
      {use3D && tier && (
        <div className={cn("absolute inset-0 transition-opacity duration-slow ease-stay", MASK, ready ? "opacity-100" : "opacity-0")} data-scene="cta">
          <CtaScene tier={tier} theme={theme} active={active} onReady={() => setReady(true)} />
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}
