"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type QRCodeStyling from "qr-code-styling";
import { stylingOptions, type QrDesign } from "@/lib/qr-design";
import { cn } from "@/lib/utils";

export type QrPreviewHandle = {
  /** Export at print size with a quiet zone. */
  download: (ext: "svg" | "png", name?: string) => Promise<void>;
};

/**
 * Live qr-code-styling preview. The library is fetched only when the preview nears the viewport;
 * until then (and on the server) the `placeholder` matrix is drawn so the box never shifts.
 * Every change crossfades from a ghost of the previous render.
 */
export const QrPreview = forwardRef<QrPreviewHandle, {
  data: string;
  design: QrDesign;
  size: number;
  placeholder: string[];
  className?: string;
  onRender?: () => void;
}>(function QrPreview({ data, design, size, placeholder, className, onRender }, ref) {
  const box = useRef<HTMLDivElement>(null);
  const live = useRef<HTMLDivElement>(null);
  const ghost = useRef<HTMLDivElement>(null);
  const qr = useRef<QRCodeStyling | null>(null);
  const Lib = useRef<typeof QRCodeStyling | null>(null);
  const [ready, setReady] = useState(false);
  const latest = useRef({ data, design });
  latest.current = { data, design };

  // load the library when we're close to view
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let dead = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        import("qr-code-styling").then(({ default: Q }) => {
          if (dead || !live.current) return;
          Lib.current = Q;
          qr.current = new Q({ ...stylingOptions(latest.current.data, latest.current.design, size), type: "svg" });
          qr.current.append(live.current);
          setReady(true);
        });
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => {
      dead = true;
      io.disconnect();
    };
  }, [size]);

  // live updates, with a crossfade from the previous frame
  useEffect(() => {
    if (!ready || !qr.current || !live.current || !ghost.current) return;
    const t = setTimeout(() => {
      const prev = live.current!.firstElementChild;
      const g = ghost.current!;
      g.replaceChildren(...(prev ? [prev.cloneNode(true)] : []));
      g.style.transition = "none";
      g.style.opacity = "1";
      qr.current!.update(stylingOptions(data, design, size));
      requestAnimationFrame(() => {
        g.style.transition = "";
        g.style.opacity = "0";
      });
      onRender?.();
    }, 110);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, data, design.dots, design.corners, design.fg, design.bg, size]);

  useImperativeHandle(ref, () => ({
    async download(ext, name = "stayqr-code") {
      const Q = Lib.current ?? (await import("qr-code-styling")).default;
      const out = new Q({ ...stylingOptions(latest.current.data, latest.current.design, 1024, 64), type: ext === "svg" ? "svg" : "canvas" });
      await out.download({ name, extension: ext });
    },
  }));

  const n = placeholder.length;
  return (
    <div ref={box} className={cn("relative", className)} style={{ width: size, height: size }} aria-hidden>
      {!ready && n > 0 && (
        <svg viewBox={`0 0 ${n} ${n}`} width={size} height={size} className="absolute inset-0" shapeRendering="crispEdges">
          <rect width={n} height={n} fill={design.bg} />
          {placeholder.flatMap((row, r) =>
            [...row].map((ch, c) => (ch === "1" ? <rect key={`${r}-${c}`} x={c + 0.06} y={r + 0.06} width={0.88} height={0.88} rx={0.3} fill={design.fg} /> : null)),
          )}
        </svg>
      )}
      <div ref={live} className="absolute inset-0 [&>svg]:block [&>svg]:h-full [&>svg]:w-full" />
      <div ref={ghost} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-base ease-stay [&>svg]:block [&>svg]:h-full [&>svg]:w-full" />
    </div>
  );
});
