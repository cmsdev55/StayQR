import Link from "next/link";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";

/** What someone sees when they scan a code its owner has paused. Friendly, fast, phone-first. */
export function PausedView({ owner, site, reason, back }: { owner: string | null; site: string | null; reason: string | null; back: string | null }) {
  const name = owner || site || "The owner";
  const initials = name.split(/[\s.]+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("");
  return (
    <main className="noise bg-grid relative isolate flex min-h-[100svh] flex-col items-center px-4 py-10 sm:py-16">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[30%] -z-10 h-[520px] w-[min(720px,140%)] -translate-x-1/2 rounded-full [background:radial-gradient(closest-side,rgb(var(--depth)/0.2),transparent)]" />

      <div className="fade-up flex items-center gap-3" style={{ ["--d" as string]: "0ms" }}>
        <span className="grid size-10 place-items-center rounded-full bg-fg font-display text-body-sm font-semibold text-bg">{initials}</span>
        <span className="flex flex-col">
          <span className="text-body-sm font-semibold text-fg">{name}</span>
          {site && <span className="font-mono text-[11px] text-fg-subtle">{site}</span>}
        </span>
      </div>

      <div className="glass fade-up mt-10 w-full max-w-[420px] rounded-xl p-6 text-center sm:p-8" style={{ ["--d" as string]: "120ms" }}>
        <div className="paused-breathe relative mx-auto grid size-[132px] place-items-center rounded-lg bg-bg-raised shadow-inner-glow" aria-hidden>
          <svg viewBox="0 0 7 7" className="size-[84px] text-fg-subtle/60">
            {[0, 1, 2, 3, 4, 5, 6].flatMap((r) =>
              [0, 1, 2, 3, 4, 5, 6].map((c) => {
                const ring = r === 0 || r === 6 || c === 0 || c === 6;
                const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
                return ring || core ? <rect key={`${r}${c}`} x={c + 0.08} y={r + 0.08} width={0.84} height={0.84} rx={0.22} fill="currentColor" /> : null;
              }),
            )}
          </svg>
          <span className="absolute -bottom-3 -right-3 grid size-11 place-items-center rounded-full border-4 border-bg bg-warning text-bg">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="3" y="2" width="2.6" height="10" rx="1" /><rect x="8.4" y="2" width="2.6" height="10" rx="1" /></svg>
          </span>
        </div>

        <span className="mt-8 inline-flex h-6 items-center gap-1.5 rounded-full bg-warning/[0.12] px-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-warning">
          <span className="size-1.5 rounded-full bg-current" /> Paused
        </span>
        <h1 className="mt-4 font-display text-h3 font-semibold text-fg sm:text-[30px] sm:leading-tight">This code is taking a short break</h1>
        <p className="mt-3 text-body text-fg-muted">
          {name} has paused it{reason ? ` ${reason.replace(/^[\s,]+|[.\s]+$/g, "")}` : " for now"}. It&apos;ll be back at this same code.
        </p>

        {back && (
          <dl className="mt-6 flex items-center justify-between rounded-sm border border-line px-4 py-3 text-left">
            <dt className="text-body-sm text-fg-subtle">Back on</dt>
            <dd className="text-body-sm font-medium text-fg">{back}</dd>
          </dl>
        )}

        {site && (
          <div className="mt-6 grid gap-3">
            <ButtonLink href={`https://${site}`} variant="secondary" className="w-full">Visit {site}</ButtonLink>
          </div>
        )}
      </div>

      <footer className="fade-up mt-auto pt-12 text-center" style={{ ["--d" as string]: "240ms" }}>
        <Link href="/" className="inline-flex items-center gap-2 font-mono text-[12px] text-fg-subtle transition-colors hover:text-fg">
          <Logo size={14} /> Codes made with StayQR never expire. Make your own →
        </Link>
      </footer>
    </main>
  );
}
