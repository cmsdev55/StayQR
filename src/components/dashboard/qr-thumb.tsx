"use client";

import { useMemo } from "react";
import { QrSvg } from "@/components/qr/qr-svg";
import type { QrDesign } from "@/lib/qr-design";
import { qrMatrix } from "@/lib/qr";
import { cn } from "@/lib/utils";

/** Small, crisp code thumbnail in the code's own colours. */
export function QrThumb({ data, design, className }: { data: string; design: QrDesign; className?: string }) {
  const m = useMemo(() => qrMatrix(data, 0), [data]);
  const shape = design.dots === "dots" ? "dots" : design.dots === "square" ? "square" : "rounded";
  return (
    <span className={cn("grid shrink-0 place-items-center rounded-[8px] p-1 shadow-[inset_0_0_0_1px_var(--border)]", className)} style={{ background: design.bg, color: design.fg }}>
      <QrSvg m={m} shape={shape} className="size-full" />
    </span>
  );
}
