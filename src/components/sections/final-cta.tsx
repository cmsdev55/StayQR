import { ButtonLink, Magnetic } from "@/components/ui/button";
import { FinalCtaVisual } from "./final-cta-visual";

/** Section 9: the cube QR returns, scatters into a field and reforms into the StayQR mark. */
export function FinalCta() {
  const words = "Print it once. Keep it forever.".split(" ");
  return (
    <section aria-labelledby="cta-title" className="noise bg-grid relative isolate overflow-hidden border-t border-line pt-24 lg:pt-40">
      <div className="relative z-10 mx-auto flex max-w-container flex-col items-center px-4 text-center sm:px-6">
        <p className="eyebrow" data-reveal="">Start free</p>
        <h2 id="cta-title" data-reveal="words" className="mt-4 max-w-[14ch] font-display text-display-xl font-semibold text-fg [text-wrap:balance]">
          {words.map((w, i) => (
            <span key={i}>
              <span className="reveal-word">
                <span style={{ ["--i" as string]: i }} className={i >= 3 ? "text-accent-text" : undefined}>{w}</span>
              </span>
              {i < words.length - 1 ? " " : null}
            </span>
          ))}
        </h2>
        <p className="mt-6 max-w-[48ch] text-body-lg text-fg-muted" data-reveal="" style={{ ["--stagger" as string]: 3 }}>
          Make your first dynamic code in a minute. If you ever leave, it keeps working.
        </p>
        <div className="mt-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row" data-reveal="" style={{ ["--stagger" as string]: 4 }}>
          <Magnetic>
            <ButtonLink href="/signup" size="lg" className="w-full sm:w-auto">
              Start free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 8h10M9 4l4 4-4 4" /></svg>
            </ButtonLink>
          </Magnetic>
          <Magnetic>
            <ButtonLink href="/pricing" size="lg" variant="secondary" className="w-full sm:w-auto">See pricing</ButtonLink>
          </Magnetic>
        </div>
      </div>
      <FinalCtaVisual />
    </section>
  );
}
