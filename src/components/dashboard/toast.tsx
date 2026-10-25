"use client";

import { AnimatePresence, LazyMotion, m } from "framer-motion";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const loadFeatures = () => import("@/lib/motion-features").then((r) => r.default);

/** Dashboard confirmation toast. Framer handles the exit (CSS can't animate an unmounting node). */
export function Toast({ message, raised }: { message: string | null; raised?: boolean }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <div aria-live="polite" className={cn("pointer-events-none fixed left-1/2 z-50 -translate-x-1/2 lg:left-[calc(50%+124px)]", raised ? "bottom-20" : "bottom-6")}>
        <AnimatePresence mode="wait">
          {message && (
            <m.p
              key={message}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-bg-overlay px-4 py-2.5 font-medium text-fg shadow-lg"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-text" aria-hidden>
                <path d="M3 8.5l3 3 7-7" />
              </svg>
              {message}
            </m.p>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}
