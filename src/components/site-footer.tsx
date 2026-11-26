import Link from "next/link";
import { PrivacySettingsLink } from "@/components/ads/privacy-settings-link";
import { Logo } from "@/components/logo";
import { Pausable } from "@/components/motion/pausable";
import { SOCIAL } from "@/content/company";
import { COMPETITORS } from "@/content/competitors";
import { INDUSTRIES } from "@/content/industries";
import { QR_TYPES } from "@/lib/qr-types";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/dynamic-qr-code-generator", label: "Dynamic QR codes" },
      { href: "/app-download-qr-code", label: "App download QR" },
      { href: "/bulk-qr-code-generator", label: "Bulk QR generator" },
      { href: "/pricing", label: "Pricing" },
      { href: "/#compare", label: "Compare" },
      { href: "/guides", label: "Guides" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Free tools",
    links: [
      { href: "/qr-code-generator", label: "QR code generator" },
      { href: "/qr-code-with-logo", label: "QR code with logo" },
      { href: "/qr-code-generator-no-watermark", label: "No-watermark QR codes" },
      { href: "/qr-code-generator-no-expiration", label: "QR codes that never expire" },
      { href: "/qr-code-generator-no-sign-up", label: "No sign-up QR codes" },
      ...QR_TYPES.filter((t) => ["url", "wifi", "vcard", "whatsapp", "instagram"].includes(t.slug)).map((t) => ({ href: `/qr-code-generator/${t.slug}`, label: `${t.name} QR code` })),
      { href: "/qr-code-scanner", label: "QR code scanner" },
      { href: "/sample-qr-codes", label: "Sample QR codes" },
      { href: "/qr-code-templates", label: "Printable QR templates" },
      { href: "/qr-code-size-calculator", label: "QR size calculator" },
      { href: "/whatsapp-link-generator", label: "WhatsApp link generator" },
    ],
  },
  {
    title: "Industries",
    links: INDUSTRIES.slice(0, 6).map((i) => ({ href: `/industries/${i.slug}`, label: i.name })),
  },
  {
    title: "Alternatives",
    links: COMPETITORS.map((c) => ({ href: `/alternatives/${c.slug}`, label: `vs ${c.short}` })),
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
        <div className="grid gap-12 lg:grid-cols-[1.3fr_repeat(5,1fr)] lg:gap-8">
          <div className="max-w-[300px]">
            <Link href="/" className="flex items-center gap-2.5 text-fg" aria-label="EndureQR home">
              <Logo />
              <span className="font-display text-[20px] font-semibold tracking-[-0.02em]">EndureQR</span>
            </Link>
            <p className="mt-4 text-body-sm text-fg-muted">
              Dynamic QR codes that keep working, even if you cancel. Edit after printing, scan without limits.
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
              {SOCIAL.map((s) => (
                <li key={s.url}>
                  <a href={s.url} rel="me noopener" target="_blank" className="text-body-sm text-fg-muted transition-colors duration-fast ease-stay hover:text-fg">
                    {s.name}
                    {s.handle && <span className="ml-1 font-mono text-[12px] text-fg-subtle">{s.handle}</span>}
                  </a>
                </li>
              ))}
            </ul>
            {/* Launch-directory badges. Each directory checks the server-rendered HTML for its
                badge, so keep the hrefs and image URLs exactly as given and leave out nofollow. */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="https://startupbase.io/products/endureqr?utm_source=startupbase&utm_medium=badge&utm_campaign=launch-badge-neutral"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://statics.startupbase.io/site/badges/launched-on-sb-neutral.svg" alt="Launched on StartupBase" height={48} style={{ height: 48, width: "auto" }} />
              </a>
              <a href="https://www.scrolllaunch.com/products/endureqr?ref=badge" target="_blank" rel="noopener">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://www.scrolllaunch.com/api/badge/endureqr?variant=launched&theme=light" alt="EndureQR - Featured on ScrollLaunch" width={220} height={48} />
              </a>
              <a href="https://fazier.com" target="_blank" rel="noopener">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=light" width={120} alt="Fazier badge" />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-5">
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
            <span>© 2026 EndureQR. Codes that never die.</span>
            <Link href="/about" className="transition-colors hover:text-fg">About</Link>
            <Link href="/contact" className="transition-colors hover:text-fg">Contact</Link>
            <Link href="/terms" className="transition-colors hover:text-fg">Terms</Link>
            <Link href="/privacy" className="transition-colors hover:text-fg">Privacy</Link>
            <PrivacySettingsLink className="transition-colors hover:text-fg" />
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
