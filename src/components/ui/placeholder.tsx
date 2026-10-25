import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Visible stand-in for content StayQR must supply (customer names, quotes, logos, numbers,
 * screenshots, legal details). Always shows its [brackets]; never replace it with invented copy.
 */
export function Placeholder({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("rounded-[4px] bg-warning/[0.08] px-1 font-mono text-[0.85em] text-fg-muted [box-decoration-break:clone] [text-decoration:underline_dashed_rgb(var(--warning)/0.5)] [text-underline-offset:4px]", className)}>
      [{children}]
    </span>
  );
}

/** Dashed box for a missing image, logo or screenshot. */
export function PlaceholderSlot({ label, className, children }: { label: ReactNode; className?: string; children?: ReactNode }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-line-strong bg-glass p-3 text-center", className)}>
      <span className="font-mono text-[12px] text-fg-subtle">[{label}]</span>
      {children}
    </div>
  );
}

/** Marks a claim about another company that isn't confirmed on their current pricing page. */
export function VerifyTag({ className }: { className?: string }) {
  return (
    <span className={cn("ml-1 inline-flex h-5 items-center rounded-[4px] bg-warning/[0.12] px-1.5 align-middle font-mono text-[10px] uppercase tracking-[0.06em] text-warning", className)}>
      [verify]
    </span>
  );
}
