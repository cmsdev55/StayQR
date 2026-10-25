import type { CSSProperties } from "react";
import { qrRuns } from "@/lib/qr";

export type QrSvgShape = "square" | "rounded" | "dots";

/** A static QR code as one stroked path (server or client; no hooks). */
export function QrSvg({ m, shape = "square", className, style }: { m: boolean[][]; shape?: QrSvgShape; className?: string; style?: CSSProperties }) {
  const n = m.length;
  return (
    <svg viewBox={`-0.5 -0.5 ${n + 1} ${n + 1}`} className={className} style={style} aria-hidden>
      <path
        d={qrRuns(m)}
        fill="none"
        stroke="currentColor"
        strokeWidth={shape === "square" ? 1 : 0.86}
        strokeLinecap={shape === "square" ? "square" : "round"}
        strokeDasharray={shape === "dots" ? "0 1" : undefined}
      />
    </svg>
  );
}
