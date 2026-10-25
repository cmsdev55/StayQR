import Link from "next/link";
import { Logo } from "@/components/logo";

/** Login / signup: form on the left, a quiet brand panel on large screens. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[100svh] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="flex flex-col px-4 py-6 sm:px-10 lg:px-16">
        <Link href="/" className="flex w-fit items-center gap-2.5 text-fg" aria-label="StayQR home">
          <Logo />
          <span className="font-display text-[20px] font-semibold tracking-[-0.02em]">StayQR</span>
        </Link>
        <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-12">{children}</main>
        <p className="font-mono text-[12px] text-fg-subtle">© 2026 StayQR · Codes that never die</p>
      </div>

      <aside className="noise bg-grid relative isolate hidden overflow-hidden border-l border-line bg-bg-raised lg:flex lg:flex-col lg:justify-end lg:p-16" aria-label="Why StayQR">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-[38%] -z-10 h-[70%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full [background:radial-gradient(closest-side,rgb(var(--depth)/0.26),transparent)]" />
        {(["dark", "light"] as const).map((t) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={t}
            src={`/hero-qr-${t}.webp`}
            alt=""
            width={1360}
            height={660}
            className={`pointer-events-none absolute inset-x-0 top-[8%] h-[56%] w-full select-none object-contain [mask-image:radial-gradient(ellipse_48%_52%_at_50%_50%,#000_55%,transparent_100%)] ${t === "dark" ? "[[data-theme=light]_&]:hidden" : "hidden [[data-theme=light]_&]:block"}`}
          />
        ))}
        <div className="relative">
          <p className="max-w-[18ch] font-display text-display-md font-semibold text-fg">Your codes keep working, even if you leave.</p>
          <ul className="mt-6 flex flex-col gap-3 text-body text-fg-muted">
            {["Edit any code after it's printed", "Unlimited scans on every plan", "No service pages, no ads, ever"].map((f) => (
              <li key={f} className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-accent-text" aria-hidden><path d="M3 8.5l3 3 7-7" /></svg>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
