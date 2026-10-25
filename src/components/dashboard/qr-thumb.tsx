"use client";

import { useMemo } from "react";
import type { QrDesign } from "@/lib/qr-design";
import { qrMatrix, qrPath } from "@/lib/qr";
import { cn } from "@/lib/utils";

/** Small, crisp code thumbnail in the code's own colours (an SVG path, no library canvas). */
export function QrThumb({ data, design, className }: { data: string; design: QrDesign; className?: string }) {
  const { n, d } = useMemo(() => {
    const m = qrMatrix(data, 0);
    return { n: m.length, d: qrPath(m, design.dots === "dots" ? "dots" : design.dots === "square" ? "square" : "rounded", 0.04) };
  }, [data, design.dots]);
  return (
    <span className={cn("grid shrink-0 place-items-center rounded-[8px] p-1 shadow-[inset_0_0_0_1px_var(--border)]", className)} style={{ background: design.bg }}>
      <svg viewBox={`-0.5 -0.5 ${n + 1} ${n + 1}`} className="size-full" aria-hidden>
        <path d={d} fill={design.fg} />
      </svg>
    </span>
  );
}
