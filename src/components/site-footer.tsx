import Link from "next/link";
import { Logo } from "@/components/logo";
import { Pausable } from "@/components/motion/pausable";
import { COMPETITORS } from "@/content/competitors";
import { INDUSTRIES } from "@/content/industries";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/#generator", label: "Free QR generator" },
      { href: "/#features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/#compare", label: "Compare" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Industries",
    links: INDUSTRIES.slice(0, 6).map((i) => ({ href: `/industries/${i.slug}`, label: i.name })),
  },
  {
    title: "Alternatives",
    links: COMPETITORS.map((c) => ({ href: `/alternatives/${c.slug}`, label: `vs ${c.name}` })),
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/signup", label: "Sign up free" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-line" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">Site footer</h2>
      {/* the grid, with one faint scan line drifting down it */}
      <Pausable aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000)]">
        <span className="footer-scan absolute inset-0" />
      </Pausable>

      <div className="mx-auto max-w-wide px-4 pb-10 pt-20 sm:px-6 lg:px-12 lg:pt-28">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_repeat(4,1fr)] lg:gap-8">
          <div className="max-w-[300px]">
            <Link href="/" className="flex items-center gap-2.5 text-fg" aria-label="StayQR home">
              <Logo />
              <span className="font-display text-[20px] font-semibold tracking-[-0.02em]">StayQR</span>
            </Link>
            <p className="mt-4 text-body-sm text-fg-muted">
              Dynamic QR codes that keep working, even if you cancel. Edit after printing, scan without limits.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-4">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className="eyebrow">{col.title}</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-body-sm text-fg-muted transition-colors duration-fast ease-stay hover:text-fg">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-line pt-8 font-mono text-[12px] text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>© 2026 StayQR. Codes that never die.</span>
            <Link href="/terms" className="transition-colors hover:text-fg">Terms</Link>
            <Link href="/privacy" className="transition-colors hover:text-fg">Privacy</Link>
          </p>
          <p className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="ping absolute inset-0 rounded-full bg-accent" />
              <span className="relative size-2 rounded-full bg-accent" />
            </span>
            All codes redirecting
          </p>
        </div>
      </div>
    </footer>
  );
}
