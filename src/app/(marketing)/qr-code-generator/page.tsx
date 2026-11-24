import type { Metadata } from "next";
import { AD_SLOTS, AdSlot } from "@/components/ads/ad-slot";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { GuideCards } from "@/components/content/guide-cards";
import { RichText } from "@/components/content/rich-text";
import { JsonLd, SITE, breadcrumbLd, pageGraph, toolLd } from "@/components/content/json-ld";
import { TypeGrid } from "@/components/content/type-grid";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { GeneratorApp } from "@/components/sections/generator-app";
import { SectionHeading } from "@/components/ui/section-heading";
import { GUIDES } from "@/content/guides";
import { QR_TYPE_PAGES } from "@/content/qr-type-pages";
import { qrMatrix } from "@/lib/qr";
import { QR_TYPES, qrType } from "@/lib/qr-types";

export const metadata: Metadata = {
  // The hub owns the head term and the types. "No sign-up" and "never expires" have their own pages
  // (/qr-code-generator-no-sign-up, /qr-code-generator-no-expiration): keep them out of this title so the pages don't compete.
  title: "Free QR Code Generator: Link, WiFi, vCard & More",
  description: `Make a free QR code for a link, WiFi, vCard, WhatsApp and ${QR_TYPES.length - 4} more types. Add your logo, colours and a frame, then download PNG, SVG or PDF up to 4096 px.`,
  alternates: { canonical: "/qr-code-generator" },
};

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "QR code generator", path: "/qr-code-generator" },
];

const FAQ_ITEMS = [
  { q: "Is this QR code generator really free?", a: "Yes. Every type on this page is free, with no sign-up, no watermark and no scan limit. You can add a logo and a frame and download PNG, SVG, JPEG or PDF up to 4096 px." },
  { q: "Do the QR codes expire?", a: "No. These are static codes: the content is stored in the pattern itself, so they keep working as long as the print survives. Nothing on our side can switch them off." },
  { q: "Can I change a code after printing it?", a: "Not a static one, because the content is baked into the pattern. If you might need to change the destination later, use a dynamic code from an EndureQR plan: you can edit it any time, and it keeps redirecting even if you cancel." },
  { q: "Is my data stored anywhere?", a: "No. The code is generated in your browser and the file is built on your device. What you type into the generator is never sent to our servers." },
  { q: "Which format should I download?", a: "SVG or PDF for print, since they stay sharp at any size. PNG for websites, documents and slides. JPEG when you need the smallest file." },
  { q: "Can I add my logo?", a: "Yes. Upload a PNG, JPEG, SVG or WebP up to 1 MB. The generator switches to the highest error correction level automatically, so the code still scans with the logo covering part of it." },
];

export default function GeneratorHubPage() {
  const placeholder = qrMatrix(qrType("url")!.defaults.url, 0).map((r) => r.map((on) => (on ? "1" : "0")).join(""));
  return (
    <main>
      <JsonLd data={breadcrumbLd(CRUMBS)} />
      <JsonLd
        data={pageGraph(...toolLd({ path: "/qr-code-generator", name: "EndureQR free QR code generator", description: String(metadata.description) }), {
          "@type": "ItemList",
          "@id": `${SITE}/qr-code-generator#types`,
          name: "QR code generators by type",
          itemListElement: QR_TYPE_PAGES.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.h1, url: `${SITE}/qr-code-generator/${t.slug}` })),
        })}
      />
      <section aria-labelledby="hub-title" className="noise bg-grid relative isolate overflow-hidden pb-16 pt-28 sm:pt-36 lg:pb-24">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <Breadcrumbs items={CRUMBS} />
          <SectionHeading
            as="h1"
            id="hub-title"
            immediate
            className="mt-6"
            title="Free QR code generator for *links, WiFi, vCards and more.*"
            intro={
              <RichText
                text={`EndureQR's free QR code generator makes static QR codes in ${QR_TYPES.length} types, including website links, WiFi, contact cards (vCard), WhatsApp, email, SMS, calendar events and social profiles. Add a logo, colours and a frame, then download PNG, SVG, JPEG or PDF up to 4096 px. It's [free with no sign-up](/qr-code-generator-no-sign-up) and [no watermark](/qr-code-generator-no-watermark), the code is built in your browser, and static codes [never expire](/qr-code-generator-no-expiration).`}
              />
            }
          />
          <h2 className="sr-only">Create your QR code</h2>
          <div className="mt-12">
            <GeneratorApp placeholder={placeholder} />
          </div>
        </div>
      </section>

      <AdSlot slot={AD_SLOTS.tool} className="py-8" />

      <section aria-labelledby="types-title" className="border-t border-line py-24 lg:py-32">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <SectionHeading id="types-title" eyebrow="Every type" title="Pick what your code *opens.*" intro="Each type has its own page with step-by-step instructions, printing tips and answers to common questions." />
          <TypeGrid className="mt-12" />
        </div>
      </section>

      <section aria-labelledby="guides-title" className="border-t border-line py-24 lg:py-32">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <SectionHeading id="guides-title" eyebrow="Guides" title="Get it right *before you print.*" />
          <div className="mt-12"><GuideCards guides={GUIDES.slice(0, 3)} /></div>
        </div>
      </section>

      <Faq items={FAQ_ITEMS} title="Free generator *questions.*" />
      <CtaBand
        title="Need to change it after printing?"
        body="A dynamic code can point somewhere new any time, shows you who scans it, and keeps working even if you cancel."
        cta="Make a dynamic code"
      />
    </main>
  );
}
