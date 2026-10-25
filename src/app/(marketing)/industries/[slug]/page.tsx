import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IndustryIcon } from "@/components/industry-icon";
import { Pausable } from "@/components/motion/pausable";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { FAQ } from "@/content/faq";
import { INDUSTRIES, industryBySlug } from "@/content/industries";
import { qrMatrix, qrPath } from "@/lib/qr";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ind = industryBySlug((await params).slug);
  if (!ind) return {};
  return {
    title: `Dynamic QR codes for ${ind.name.toLowerCase()}`,
    description: `${ind.intro} Unlimited scans, and your codes keep working if you cancel.`,
    alternates: { canonical: `/industries/${ind.slug}` },
  };
}

export default async function IndustryPage({ params }: Props) {
  const ind = industryBySlug((await params).slug);
  if (!ind) notFound();
  const words = ind.headline.split(" ");
  const m = qrMatrix(`https://${ind.destinations[0].split("/")[0]}`, 0);
  const others = INDUSTRIES.filter((i) => i.slug !== ind.slug);

  return (
    <main>
      {/* Hero */}
      <section aria-labelledby="ind-title" className="noise bg-grid relative isolate overflow-hidden pb-24 pt-32 sm:pt-40 lg:pb-32">
        <div className="mx-auto grid max-w-container items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <p className="fade-up inline-flex items-center gap-2.5 font-mono text-label uppercase text-fg-subtle" style={{ ["--d" as string]: "0ms" }}>
              <IndustryIcon slug={ind.slug} size={16} /> StayQR for {ind.name.toLowerCase()}
            </p>
            <h1 id="ind-title" className="mt-5 max-w-[16ch] font-display text-display-lg font-semibold text-fg [text-wrap:balance]">
              {words.map((w, i) => (
                <span key={i}>
                  <span className="mask-word">
                    <span style={{ ["--i" as string]: i }}>{w}</span>
                  </span>
                  {i < words.length - 1 ? " " : null}
                </span>
              ))}
            </h1>
            <p className="fade-up mt-6 max-w-[52ch] text-body-lg text-fg-muted" style={{ ["--d" as string]: "300ms" }}>{ind.intro}</p>
            <div className="fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "380ms" }}>
              <ButtonLink href={`/signup?industry=${ind.slug}`} size="lg">Start free</ButtonLink>
              <ButtonLink href="/#generator" size="lg" variant="secondary">Make a free QR code</ButtonLink>
            </div>
          </div>

          {/* A printed table tent whose destination keeps changing */}
          <Pausable className="fade-up relative" style={{ ["--d" as string]: "200ms" }} data-loop aria-hidden>
            <div className="pointer-events-none absolute inset-0 -z-10 scale-125 rounded-full [background:radial-gradient(closest-side,rgb(var(--depth)/0.24),transparent)]" />
            <div className="glass mx-auto max-w-[400px] rounded-xl p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="eyebrow">Printed March 2026</span>
                <span className="inline-flex items-center gap-2 font-mono text-[12px] text-fg-subtle"><span className="size-1.5 rounded-full bg-accent" /> Live</span>
              </div>
              <div className="mx-auto mt-6 w-fit rounded-lg bg-white p-5 shadow-lg">
                <svg viewBox={`-0.5 -0.5 ${m.length + 1} ${m.length + 1}`} className="size-[180px] text-[#0B0D12]">
                  <path d={qrPath(m, "rounded")} fill="currentColor" />
                </svg>
              </div>
              <p className="mt-6 text-center text-body-sm text-fg-muted">Scan for</p>
              <div className="mx-auto mt-2 flex h-11 w-fit max-w-full items-center gap-2 rounded-full bg-glass-strong px-4 font-mono text-[12px] sm:text-[13px]">
                <span className="relative inline-block h-[1.5em] overflow-hidden">
                  <span className="url-morph flex flex-col text-fg">
                    {[...ind.destinations, ind.destinations[0]].map((d, i) => (
                      <span key={i} className="h-[1.5em] truncate leading-[1.5em]">{d}</span>
                    ))}
                  </span>
                </span>
              </div>
              <p className="url-saved mt-3 text-center font-mono text-[11px] text-accent-text">Destination changed · same printed code</p>
            </div>
          </Pausable>
        </div>
      </section>

      {/* Use cases */}
      <section aria-labelledby="uses-title" className="border-t border-line py-24 lg:py-32">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <SectionHeading id="uses-title" eyebrow="Use cases" title={`How ${ind.name.toLowerCase()} use *StayQR.*`} />
          <div className="mt-12 grid gap-4 md:grid-cols-3 lg:gap-5">
            {ind.useCases.map((u, i) => (
              <article key={u.title} className="glass rounded-lg p-6 sm:p-8" data-reveal="" style={{ ["--stagger" as string]: i }}>
                <span className="font-mono text-label text-fg-subtle">0{i + 1}</span>
                <h3 className="mt-6 font-display text-h3 font-semibold text-fg">{u.title}</h3>
                <p className="mt-3 text-body-sm text-fg-muted">{u.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-16 grid items-center gap-8 border-y border-line py-12 md:grid-cols-[auto_1fr] md:gap-16" data-reveal="">
            <p className="font-display text-display-lg font-semibold text-fg">{ind.stat.value}</p>
            <p className="max-w-[40ch] text-body-lg text-fg-muted">{ind.stat.label}. Change destinations from your phone, and the code you printed keeps working, even if you cancel.</p>
          </div>

          <ol className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              ["Create", "Make a dynamic code and point it at today's page."],
              ["Print", "Download print-ready SVG or PNG for menus, signs or packaging."],
              ["Change any time", "Update where it goes, pause it, or see who scanned. No reprints."],
            ].map(([t, b], i) => (
              <li key={t} className="flex gap-4" data-reveal="" style={{ ["--stagger" as string]: i }}>
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line-strong font-mono text-[12px] text-fg">{i + 1}</span>
                <div>
                  <h3 className="text-body font-semibold text-fg">{t}</h3>
                  <p className="mt-1 text-body-sm text-fg-muted">{b}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Faq items={[...ind.faq, FAQ[0], FAQ[2]]} title={`${ind.name}: common *questions.*`} />

      {/* Other industries */}
      <section aria-labelledby="more-title" className="border-t border-line py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <h2 id="more-title" className="eyebrow">More industries</h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/industries/${o.slug}`} className="glass flex h-12 items-center gap-2.5 rounded-sm px-3.5 text-body-sm text-fg-muted transition-colors duration-fast ease-stay hover:bg-glass-strong hover:text-fg">
                  <IndustryIcon slug={o.slug} size={16} /> {o.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={`Codes your ${ind.name.toLowerCase()} business can print once.`} href={`/signup?industry=${ind.slug}`} />
    </main>
  );
}
