import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 font-mono text-[11px] uppercase tracking-[0.08em]",
  {
    variants: {
      variant: {
        accent: "bg-accent/[0.14] text-accent-text",
        neutral: "bg-glass-strong text-fg-muted",
        warning: "bg-warning/[0.12] text-warning",
        danger: "bg-danger/[0.12] text-danger",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export function Badge({ className, variant, ...props }: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
