"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { useActive, useTheme } from "@/hooks/use-environment";
import { useLazyScene } from "@/hooks/use-lazy-scene";
import { cn } from "@/lib/utils";

const GlobeScene = dynamic(() => import("@/components/three/globe-scene"), { ssr: false });

const DEVICES = ["iPhone", "Android", "iPhone", "iPad", "Android"];

/** ScanGlobe visual: static render until the scene is ready (same box, so nothing moves). */
export function GlobeVisual() {
  const box = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const active = useActive(box);
  const { tier, use3D } = useLazyScene(box);
  const [ready, setReady] = useState(false);
  const [feed, setFeed] = useState<{ id: number; city: string; device: string }[]>([
    { id: -2, city: "Toronto", device: "Android" },
    { id: -1, city: "Lagos", device: "iPhone" },
  ]);
  const onPing = useCallback((city: string) => {
    setFeed((f) => {
      const id = (f[f.length - 1]?.id ?? 0) + 1;
      return [...f, { id, city, device: DEVICES[Math.abs(id) % DEVICES.length] }].slice(-3);
    });
  }, []);

  return (
    <>
      <div ref={box} className="absolute inset-x-0 bottom-0 top-[22%] sm:top-[18%]" aria-hidden>
        {(["dark", "light"] as const).map((t) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={t}
            src={`/globe-${t}.webp`}
            alt=""
            width={760}
            height={760}
            loading="lazy"
            decoding="async"
            className={cn(
              "absolute inset-0 h-full w-full object-contain object-bottom transition-opacity duration-slow ease-stay",
              t === "dark" ? "[[data-theme=light]_&]:hidden" : "hidden [[data-theme=light]_&]:block",
              use3D && ready ? "opacity-0" : "opacity-100",
            )}
          />
        ))}
        {use3D && tier && (
          <div className={cn("absolute inset-0 transition-opacity duration-slow ease-stay", ready ? "opacity-100" : "opacity-0")} data-scene="globe">
            <GlobeScene tier={tier} theme={theme} active={active} onPing={onPing} onReady={() => setReady(true)} />
          </div>
        )}
      </div>
      {/* live feed */}
      <ul className="absolute bottom-5 left-5 flex flex-col gap-1.5 sm:bottom-7 sm:left-7" aria-hidden>
        {feed.map((f, i) => (
          <li
            key={f.id}
            className={cn(
              "toast-in glass flex w-max items-center gap-2 rounded-full bg-bg-overlay/60 px-3 py-1.5 font-mono text-[11px] text-fg-muted transition-opacity duration-base ease-stay",
              i < feed.length - 1 && "opacity-60",
            )}
          >
            <span className="size-1.5 rounded-full bg-accent" />
            {f.city} · {f.device} · now
          </li>
        ))}
      </ul>
    </>
  );
}
