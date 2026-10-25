import Link from "next/link";
import { preload } from "react-dom";
import { ButtonLink, Magnetic } from "@/components/ui/button";
import { HeroVisual } from "./hero-visual";

const HEADLINE = [["QR", "codes", "that", "never"], ["stop", "working."]];

/** Server component: all copy is real HTML, rendered before any 3D loads. */
export function Hero() {
  // The static code image is usually the LCP element; fetch it with the HTML.
  preload("/hero-qr-dark.webp", { as: "image", fetchPriority: "high", type: "image/webp" });
  let i = 0;
  return (
    <section className="noise bg-grid relative isolate overflow-hidden pt-24 sm:pt-32" aria-labelledby="hero-title">
      <div className="relative z-10 mx-auto flex max-w-container flex-col items-center px-4 text-center sm:px-6">
        <Link
          href="/pricing"
          className="fade-up glass inline-flex h-8 items-center gap-2.5 rounded-full py-0 pl-1.5 pr-3.5 text-[13px] text-fg-muted transition-colors duration-fast ease-stay hover:text-fg"
          style={{ ["--d" as string]: "0ms" }}
        >
          <span className="inline-flex h-[22px] items-center rounded-full bg-accent/[0.14] px-2 font-mono text-[11px] tracking-[0.08em] text-accent-text">
            LIFETIME
          </span>
          One payment of $79. Codes live forever.
        </Link>

        <h1
          id="hero-title"
          className="mt-6 max-w-[1100px] font-display text-display-2xl font-semibold text-fg [text-wrap:balance]"
        >
          {HEADLINE.map((line, li) => (
            <span key={li} className="block">
              {line.map((w, wi) => {
                const idx = i++;
                const last = w === "working.";
                return (
                  <span key={w}>
                    <span className="mask-word">
                      <span style={{ ["--i" as string]: idx }} className={last ? "text-accent-text" : undefined}>
                        {w}
                      </span>
                    </span>
                    {wi < line.length - 1 ? " " : null}
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        <p className="mt-5 max-w-[600px] text-body text-fg-muted sm:mt-6 sm:text-body-lg">
          Dynamic QR codes you can edit after printing, with unlimited scans and real analytics. Cancel any time.
          Your codes keep working.
        </p>

        <div className="fade-up mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center" style={{ ["--d" as string]: "380ms" }}>
          <Magnetic>
            <ButtonLink href="/#generator" size="lg" className="w-full shadow-glow-accent sm:w-auto">
              Create free QR
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </ButtonLink>
          </Magnetic>
          <Magnetic>
            <ButtonLink href="/pricing" variant="secondary" size="lg" className="w-full sm:w-auto">
              See pricing
            </ButtonLink>
          </Magnetic>
        </div>

        <ul className="fade-up mt-6 flex flex-wrap justify-center gap-x-4 gap-y-1 font-mono sm:gap-x-6 text-[12px] text-fg-subtle" style={{ ["--d" as string]: "460ms" }}>
          <li>Unlimited scans</li>
          <li aria-hidden className="hidden sm:list-item">·</li>
          <li>Edit after printing</li>
          <li aria-hidden className="hidden sm:list-item">·</li>
          <li>Live after you cancel</li>
        </ul>
      </div>

      <HeroVisual />
    </section>
  );
}
