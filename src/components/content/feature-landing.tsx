import type { Metadata } from "next";
import { AD_SLOTS, AdSlot } from "@/components/ads/ad-slot";
import { PaymentMethods } from "@/components/billing/payment-methods";
import { Block } from "@/components/content/blocks";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { DynamicTry } from "@/components/content/dynamic-try";
import { GuideCards } from "@/components/content/guide-cards";
import { JsonLd, ORG_ID, SITE, breadcrumbLd, softwareAppLd } from "@/components/content/json-ld";
import { RelatedTypes } from "@/components/content/type-grid";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { GeneratorApp } from "@/components/sections/generator-app";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { featurePage, type FeatureSlug } from "@/content/feature-pages";
import { GUIDES } from "@/content/guides";
import { qrMatrix } from "@/lib/qr";
import { qrType } from "@/lib/qr-types";

export function featureMetadata(slug: FeatureSlug): Metadata {
  const p = featurePage(slug);
  return {
    title: { absolute: p.title },
    description: p.description,
    alternates: { canonical: `/${p.slug}` },
    openGraph: { title: p.title, description: p.description, url: `/${p.slug}`, images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
  };
}

/** Landing page for a feature EndureQR already has: hero, optional live generator, benefits, steps, long-form body, FAQ. */
export function FeatureLanding({ slug }: { slug: FeatureSlug }) {
  const p = featurePage(slug);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: p.eyebrow, path: `/${p.slug}` },
  ];
  const guides = p.relatedGuides.map((s) => GUIDES.find((g) => g.slug === s)).filter((g): g is (typeof GUIDES)[number] => !!g);
  const placeholder = p.tool ? qrMatrix(qrType("url")!.defaults.url, 0).map((r) => r.map((on) => (on ? "1" : "0")).join("")) : [];
  const toc = p.body.filter((b): b is Extract<(typeof p.body)[number], { type: "h2" }> => b.type === "h2");

  return (
    <main>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={
          p.tool
            ? { "@context": "https://schema.org", "@type": "WebApplication", name: p.title, url: `${SITE}/${p.slug}`, description: p.description, applicationCategory: "UtilitiesApplication", operatingSystem: "Any (runs in the browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@id": ORG_ID } }
            : { "@context": "https://schema.org", ...softwareAppLd(), description: p.description }
        }
      />

      <section aria-labelledby="feature-title" className="noise bg-grid relative isolate overflow-hidden pb-16 pt-28 sm:pt-36 lg:pb-24">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <Breadcrumbs items={crumbs} />
          <SectionHeading as="h1" id="feature-title" immediate className="mt-6" eyebrow={p.eyebrow} title={p.h1} intro={p.intro} />
          {p.slug === "dynamic-qr-code-generator" && <DynamicTry />}
          {!p.tool && p.slug !== "dynamic-qr-code-generator" && (
            <div className="fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "380ms" }}>
              <ButtonLink href={p.cta.href} size="lg">{p.cta.label}</ButtonLink>
              <ButtonLink href="/pricing" size="lg" variant="secondary">See pricing</ButtonLink>
            </div>
          )}
          {!p.tool && <PaymentMethods className="mt-5" />}
          {p.tool && (
            <div id="generator" className="mt-12 scroll-mt-24">
              <h2 className="sr-only">Make your QR code</h2>
              <GeneratorApp placeholder={placeholder} collapseTypes />
            </div>
          )}
        </div>
      </section>

      {p.tool && <AdSlot slot={AD_SLOTS.tool} className="py-8" />}

      <section aria-labelledby="benefits-title" className="border-t border-line py-20 lg:py-28">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <h2 id="benefits-title" className="sr-only">Why it helps</h2>
          <ul className="grid gap-4 md:grid-cols-3 lg:gap-5">
            {p.benefits.map((b, i) => (
              <li key={b.title} className="glass rounded-lg p-6 sm:p-8" data-reveal="" style={{ ["--stagger" as string]: i }}>
                <h3 className="font-display text-h4 font-semibold text-fg">{b.title}</h3>
                <p className="mt-3 text-body-sm text-fg-muted">{b.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="steps-title" className="border-t border-line py-20 lg:py-28">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <SectionHeading id="steps-title" eyebrow="How it works" title="Step by *step.*" />
          <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {p.steps.map((s, i) => (
              <li key={s.title} className="rounded-lg border border-line bg-bg-raised p-6" data-reveal="" style={{ ["--stagger" as string]: i }}>
                <span className="grid size-8 place-items-center rounded-full border border-line-strong font-mono text-[12px] text-fg">{i + 1}</span>
                <h3 className="mt-5 font-display text-h4 font-semibold text-fg">{s.title}</h3>
                <p className="mt-2 text-body-sm text-fg-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-label="In depth" className="border-t border-line py-20 lg:py-28">
        <div className="mx-auto grid max-w-container gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,8fr)] lg:gap-16">
          <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">On this page</p>
            <ol className="mt-4 flex flex-col gap-2.5 border-l border-line pl-4">
              {toc.map((h) => (
                <li key={h.id}><a href={`#${h.id}`} className="text-body-sm text-fg-muted transition-colors hover:text-fg">{h.text}</a></li>
              ))}
            </ol>
          </nav>
          <div className="flex max-w-[68ch] flex-col gap-5">
            {p.body.map((b, i) => <Block key={i} b={b} />)}
          </div>
        </div>
      </section>

      <section aria-labelledby="related-title" className="border-t border-line py-20 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <h2 id="related-title" className="font-display text-display-md font-semibold text-fg">Free generators to start with</h2>
          <div className="mt-8"><RelatedTypes slugs={p.relatedTools} /></div>
          {guides.length > 0 && (
            <>
              <h2 className="mt-16 font-display text-display-md font-semibold text-fg">Guides</h2>
              <div className="mt-8"><GuideCards guides={guides} /></div>
            </>
          )}
        </div>
      </section>

      <Faq items={p.faq} title="Common *questions.*" />
      <CtaBand
        title={p.tool ? "Want to change it after printing?" : "Print it once. Keep it forever."}
        body={p.tool ? "A dynamic code keeps your logo and design, lets you change the link any time, and keeps working even if you cancel." : "Unlimited codes and scans. Your codes keep working even if you cancel."}
        href={p.tool ? "/dynamic-qr-code-generator" : p.cta.href}
        cta={p.tool ? "See dynamic codes" : p.cta.label}
      />
    </main>
  );
}
