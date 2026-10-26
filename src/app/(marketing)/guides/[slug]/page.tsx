import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AD_SLOTS, AdSlot } from "@/components/ads/ad-slot";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { GuideCards } from "@/components/content/guide-cards";
import { JsonLd, SITE, breadcrumbLd } from "@/components/content/json-ld";
import { Block } from "@/components/content/blocks";
import { RelatedTypes } from "@/components/content/type-grid";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { GUIDES, guideBySlug, type GuideBlock } from "@/content/guides";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = guideBySlug((await params).slug);
  if (!g) return {};
  return {
    // keep the brand suffix only while the whole title fits in ~60 characters
    title: g.title.length + " · EndureQR".length > 60 ? { absolute: g.title } : g.title,
    description: g.description,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: {
      type: "article",
      title: g.h1,
      description: g.description,
      publishedTime: g.published,
      modifiedTime: g.updated,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "EndureQR: QR codes that never stop working" }],
    },
  };
}

const fmt = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function GuidePage({ params }: Props) {
  const g = guideBySlug((await params).slug);
  if (!g) notFound();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: g.h1, path: `/guides/${g.slug}` },
  ];
  const toc = g.body.filter((b): b is Extract<GuideBlock, { type: "h2" }> => b.type === "h2");
  // an in-content ad after the second section, never above the fold
  const adAfter = toc[2] ? g.body.indexOf(toc[2]) : -1;
  // same category first, then the guides that follow this one, so links spread across the whole set
  const at = GUIDES.findIndex((o) => o.slug === g.slug);
  const more = GUIDES.map((o, i) => ({ o, d: (i - at + GUIDES.length) % GUIDES.length }))
    .filter(({ o }) => o.slug !== g.slug)
    .sort((a, b) => Number(b.o.category === g.category) - Number(a.o.category === g.category) || a.d - b.d)
    .slice(0, 3)
    .map(({ o }) => o);

  return (
    <main>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: g.h1,
          description: g.description,
          datePublished: g.published,
          dateModified: g.updated,
          mainEntityOfPage: `${SITE}/guides/${g.slug}`,
          image: `${SITE}/opengraph-image`,
          author: { "@type": "Organization", name: "EndureQR", url: SITE },
          publisher: { "@type": "Organization", name: "EndureQR", url: SITE, logo: { "@type": "ImageObject", url: `${SITE}/icon.svg` } },
        }}
      />

      <article aria-labelledby="guide-title" className="pb-16 pt-28 sm:pt-36">
        <header className="mx-auto max-w-container px-4 sm:px-6">
          <Breadcrumbs items={crumbs} />
          <p className="eyebrow fade-up mt-8">{g.category}</p>
          <h1 id="guide-title" className="fade-up mt-4 max-w-[24ch] font-display text-display-lg font-semibold text-fg [text-wrap:balance]">{g.h1}</h1>
          <p className="fade-up mt-5 max-w-[60ch] text-body-lg text-fg-muted" style={{ ["--d" as string]: "120ms" }}>{g.summary}</p>
          <p className="mt-6 font-mono text-[12px] text-fg-subtle">
            Updated <time dateTime={g.updated}>{fmt(g.updated)}</time> · {g.readMinutes} min read
          </p>
        </header>

        <div className="mx-auto mt-14 grid max-w-container gap-12 border-t border-line px-4 pt-14 sm:px-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,8fr)] lg:gap-16">
          <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">On this page</p>
            <ol className="mt-4 flex flex-col gap-2.5 border-l border-line pl-4">
              {toc.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className="text-body-sm text-fg-muted transition-colors hover:text-fg">{h.text}</a>
                </li>
              ))}
            </ol>
            <Link href="/qr-code-generator" className="mt-8 hidden rounded-md border border-line bg-bg-raised p-4 text-body-sm text-fg-muted transition-colors hover:border-line-strong lg:block">
              <span className="block font-medium text-fg">Free QR code generator</span>
              No sign-up, no watermark. Logo, frames, PNG/SVG/PDF.
            </Link>
          </nav>

          <div className="flex max-w-[68ch] flex-col gap-5">
            {g.body.map((b, i) => (
              <div key={i} className="contents">
                {i === adAfter && <AdSlot slot={AD_SLOTS.guide} className="!px-0 py-4" minHeight={250} />}
                <Block b={b} />
              </div>
            ))}
          </div>
        </div>
      </article>

      <section aria-labelledby="tools-title" className="border-t border-line py-20 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <h2 id="tools-title" className="font-display text-display-md font-semibold text-fg">Try it free</h2>
          <div className="mt-8"><RelatedTypes slugs={g.relatedTools} /></div>
        </div>
      </section>

      <AdSlot slot={AD_SLOTS.guide} className="py-8" />

      <Faq items={g.faq} id="guide-faq" title="Quick *answers.*" />

      <section aria-labelledby="more-title" className="border-t border-line py-20 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <h2 id="more-title" className="font-display text-display-md font-semibold text-fg">More guides</h2>
          <div className="mt-8"><GuideCards guides={more} /></div>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
