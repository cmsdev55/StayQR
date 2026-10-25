import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AD_SLOTS, AdSlot } from "@/components/ads/ad-slot";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { JsonLd, SITE, breadcrumbLd } from "@/components/content/json-ld";
import { RelatedTypes } from "@/components/content/type-grid";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { GeneratorApp } from "@/components/sections/generator-app";
import { SectionHeading } from "@/components/ui/section-heading";
import { GUIDES } from "@/content/guides";
import { QR_TYPE_PAGES, qrTypePage } from "@/content/qr-type-pages";
import { qrMatrix } from "@/lib/qr";
import { qrType } from "@/lib/qr-types";

type Props = { params: Promise<{ type: string }> };

export function generateStaticParams() {
  return QR_TYPE_PAGES.map((p) => ({ type: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = qrTypePage((await params).type);
  if (!page) return {};
  return { title: { absolute: page.title }, description: page.description, alternates: { canonical: `/qr-code-generator/${page.slug}` } };
}

export default async function QrTypePageRoute({ params }: Props) {
  const page = qrTypePage((await params).type);
  const def = page && qrType(page.slug);
  if (!page || !def) notFound();

  const placeholder = qrMatrix(def.encode(def.defaults) || "https://stayqr.com", 0).map((r) => r.map((on) => (on ? "1" : "0")).join(""));
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "QR code generator", path: "/qr-code-generator" },
    { name: `${def.name} QR code`, path: `/qr-code-generator/${page.slug}` },
  ];
  const guides = GUIDES.filter((g) => g.relatedTools.includes(page.slug)).slice(0, 3);

  return (
    <main>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: `StayQR ${def.name} QR code generator`,
          url: `${SITE}/qr-code-generator/${page.slug}`,
          description: page.description,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any (runs in the browser)",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />

      <section aria-labelledby="type-title" className="noise bg-grid relative isolate overflow-hidden pb-16 pt-28 sm:pt-36 lg:pb-24">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <Breadcrumbs items={crumbs} />
          <SectionHeading as="h1" id="type-title" immediate className="mt-6" title={page.h1} intro={page.intro} />
          <div className="mt-12">
            <GeneratorApp placeholder={placeholder} initialType={page.slug} />
          </div>
        </div>
      </section>

      <AdSlot slot={AD_SLOTS.tool} className="py-8" />

      <section aria-labelledby="steps-title" className="border-t border-line py-24 lg:py-32">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <SectionHeading id="steps-title" eyebrow="How it works" title={`How to make a ${def.name} QR code`} />
          <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {page.steps.map((s, i) => (
              <li key={s.title} className="glass rounded-lg p-6 sm:p-7" data-reveal="" style={{ ["--stagger" as string]: i }}>
                <span className="grid size-8 place-items-center rounded-full border border-line-strong font-mono text-[12px] text-fg">{i + 1}</span>
                <h3 className="mt-6 font-display text-h3 font-semibold text-fg">{s.title}</h3>
                <p className="mt-3 text-body-sm text-fg-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="uses-title" className="border-t border-line py-24 lg:py-32">
        <div className="mx-auto grid max-w-container gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading id="uses-title" eyebrow="Where it helps" title="Use *cases.*" />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {page.useCases.map((u, i) => (
                <li key={u.title} className="rounded-lg border border-line bg-bg-raised p-5" data-reveal="" style={{ ["--stagger" as string]: i }}>
                  <h3 className="text-body font-semibold text-fg">{u.title}</h3>
                  <p className="mt-2 text-body-sm text-fg-muted">{u.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading id="tips-title" eyebrow="Before you print" title="Tips that *save a reprint.*" />
            <ul className="mt-10 flex flex-col gap-4" aria-labelledby="tips-title">
              {page.tips.map((t, i) => (
                <li key={i} className="flex gap-3 text-body-sm text-fg-muted" data-reveal="" style={{ ["--stagger" as string]: i }}>
                  <svg className="mt-0.5 shrink-0 text-accent-text" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12l5 5L20 7" /></svg>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="related-title" className="border-t border-line py-24 lg:py-32">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <SectionHeading id="related-title" eyebrow="More free generators" title="Related *QR codes.*" />
          <div className="mt-10"><RelatedTypes slugs={page.related} /></div>
          <p className="mt-6 text-body-sm text-fg-muted">
            <Link href="/qr-code-generator" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">See every QR code type</Link>
            {guides.length > 0 && (
              <>
                {" · Guides: "}
                {guides.map((g, i) => (
                  <span key={g.slug}>
                    <Link href={`/guides/${g.slug}`} className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">{g.h1}</Link>
                    {i < guides.length - 1 ? " · " : ""}
                  </span>
                ))}
              </>
            )}
          </p>
        </div>
      </section>

      <AdSlot slot={AD_SLOTS.tool} className="py-8" />

      <Faq items={page.faq} title={`${def.name} QR code *questions.*`} />
      <CtaBand
        title="Need to change it after printing?"
        body="A dynamic code can point somewhere new any time, shows you who scans it, and keeps working even if you cancel."
        cta="Make a dynamic code"
      />
    </main>
  );
}
