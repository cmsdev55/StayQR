import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AD_SLOTS, AdSlot } from "@/components/ads/ad-slot";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { GuideCards } from "@/components/content/guide-cards";
import { JsonLd, SITE, breadcrumbLd } from "@/components/content/json-ld";
import { RichText } from "@/components/content/rich-text";
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
    title: g.title.length + 9 > 60 ? { absolute: g.title } : g.title,
    description: g.description,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: { type: "article", title: g.h1, description: g.description, publishedTime: g.published, modifiedTime: g.updated },
  };
}

const fmt = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

function Block({ b }: { b: GuideBlock }) {
  switch (b.type) {
    case "p":
      return <p className="text-body-lg text-fg-muted"><RichText text={b.text} /></p>;
    case "h2":
      return <h2 id={b.id} className="scroll-mt-28 pt-8 font-display text-h3 font-semibold sm:text-[2rem] sm:leading-[1.15] text-fg [text-wrap:balance]">{b.text}</h2>;
    case "h3":
      return <h3 className="pt-2 font-display text-h4 font-semibold text-fg">{b.text}</h3>;
    case "ul":
    case "ol": {
      const List = b.type;
      return (
        <List className={`${b.type === "ul" ? "list-disc" : "list-decimal"} flex flex-col gap-2 pl-6 text-body-lg text-fg-muted marker:text-fg-subtle`}>
          {b.items.map((it, i) => <li key={i} className="pl-1"><RichText text={it} /></li>)}
        </List>
      );
    }
    case "table":
      return (
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[480px] text-left text-body-sm">
            <thead className="bg-glass-strong">
              <tr>{b.head.map((h) => <th key={h} scope="col" className="px-4 py-3 font-semibold text-fg">{h}</th>)}</tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className="border-t border-line">
                  {r.map((c, j) => (j === 0 ? <th key={j} scope="row" className="px-4 py-3 font-medium text-fg"><RichText text={c} /></th> : <td key={j} className="px-4 py-3 text-fg-muted"><RichText text={c} /></td>))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "tip":
      return (
        <aside className="rounded-lg border border-line border-l-accent bg-bg-raised px-5 py-4 text-body text-fg-muted [border-left-width:3px]">
          <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.08em] text-accent-text">Tip</span>
          <RichText text={b.text} />
        </aside>
      );
  }
}

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
  const more = GUIDES.filter((o) => o.slug !== g.slug).slice(0, 3);

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
          author: { "@type": "Organization", name: "StayQR", url: SITE },
          publisher: { "@type": "Organization", name: "StayQR", url: SITE, logo: { "@type": "ImageObject", url: `${SITE}/icon.svg` } },
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
