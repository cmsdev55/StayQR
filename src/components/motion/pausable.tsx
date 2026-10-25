"use client";

import { useRef, type ComponentProps } from "react";
import { useActive } from "@/hooks/use-environment";

/**
 * Pauses every CSS animation inside it while it's off screen or the tab is hidden
 * (sets [data-paused]; see globals.css). Wrap any section with looping CSS motion in one.
 */
export function Pausable({ rootMargin = "100px", ...props }: ComponentProps<"div"> & { rootMargin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useActive(ref, rootMargin);
  return <div ref={ref} data-paused={active ? undefined : ""} {...props} />;
}
