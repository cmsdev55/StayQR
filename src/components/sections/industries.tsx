"use client";

import Link from "next/link";
import { useState } from "react";
import { IndustryIcon } from "@/components/industry-icon";
import { Marquee } from "@/components/ui/marquee";
import { INDUSTRIES } from "@/content/industries";

const USES = ["Table menus", "Yard signs", "Event badges", "Packaging", "Waiting-room posters", "Room cards", "Course handouts", "Campaign flyers", "Business cards", "Shop windows"];

/** Section 7: two marquees, industries one way and the things people print the other. */
export function IndustriesMarquee() {
  const [paused, setPaused] = useState(false);
  return (
    <div className="relative">
      <div className="[mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <Marquee speed={36} paused={paused} gap={16}>
          {INDUSTRIES.map((ind) => (
            <Link
              key={ind.slug}
              href={`/industries/${ind.slug}`}
              className="glass group flex h-[88px] w-[340px] shrink-0 items-center gap-4 rounded-lg px-5 transition-[background-color,box-shadow] duration-fast ease-stay hover:bg-glass-strong"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-glass-strong text-fg transition-colors duration-fast ease-stay group-hover:bg-accent group-hover:text-accent-ink">
                <IndustryIcon slug={ind.slug} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-body font-medium text-fg">{ind.name}</span>
                <span className="truncate text-body-sm text-fg-muted">{ind.line}</span>
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="ml-auto shrink-0 -translate-x-1 text-fg-subtle opacity-0 transition-[opacity,transform] duration-fast ease-stay group-hover:translate-x-0 group-hover:opacity-100" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          ))}
        </Marquee>
        <Marquee speed={24} reverse paused={paused} gap={12} className="mt-4">
          {USES.map((u) => (
            <span key={u} className="inline-flex h-10 shrink-0 items-center rounded-full border border-line px-4 font-mono text-[12px] text-fg-subtle">
              {u}
            </span>
          ))}
        </Marquee>
      </div>
      <div className="mx-auto mt-8 flex max-w-container justify-end px-4 sm:px-6">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-line px-3.5 font-mono text-[12px] text-fg-muted transition-colors duration-fast ease-stay hover:border-line-strong hover:text-fg motion-reduce:hidden"
        >
          {paused ? (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden><path d="M2 1l7 4-7 4z" /></svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden><path d="M2 1h2v8H2zM6 1h2v8H6z" /></svg>
          )}
          {paused ? "Play" : "Pause"} motion
        </button>
      </div>
    </div>
  );
}
