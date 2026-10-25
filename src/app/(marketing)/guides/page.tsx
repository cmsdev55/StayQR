import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { GuideCards } from "@/components/content/guide-cards";
import { JsonLd, SITE, breadcrumbLd } from "@/components/content/json-ld";
import { CtaBand } from "@/components/sections/cta-band";
import { SectionHeading } from "@/components/ui/section-heading";
import { GUIDES } from "@/content/guides";

export const metadata: Metadata = {
  title: "QR Code Guides: Printing, Design and Expiry",
  description: "Plain answers on QR codes: whether they expire, static vs dynamic, the right print size, menus, WiFi codes and design rules that keep every code scannable.",
  alternates: { canonical: "/guides" },
};

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Guides", path: "/guides" },
];

export default function GuidesIndexPage() {
  return (
    <main>
      <JsonLd data={breadcrumbLd(CRUMBS)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: GUIDES.map((g, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/guides/${g.slug}`, name: g.h1 })),
        }}
      />
      <section aria-labelledby="guides-title" className="noise bg-grid relative isolate overflow-hidden pb-24 pt-28 sm:pt-36 lg:pb-32">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <Breadcrumbs items={CRUMBS} />
          <SectionHeading
            as="h1"
            id="guides-title"
            immediate
            className="mt-6"
            title="QR code *guides.*"
            intro="Short, practical answers to the questions people ask before they print a QR code."
          />
          <div className="mt-14"><GuideCards guides={GUIDES} /></div>
        </div>
      </section>
      <CtaBand title="Make one now, free." body="No sign-up and no watermark. Add your logo, then download PNG, SVG, JPEG or PDF." href="/qr-code-generator" cta="Open the generator" />
    </main>
  );
}
