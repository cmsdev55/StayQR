import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { JsonLd, SITE, breadcrumbLd } from "@/components/content/json-ld";
import { CtaBand } from "@/components/sections/cta-band";
import { SectionHeading } from "@/components/ui/section-heading";
import { COMPANY } from "@/content/company";
import { QR_TYPES } from "@/lib/qr-types";

export const metadata: Metadata = {
  title: "About StayQR",
  description: "StayQR makes QR codes that keep working: free static codes that never expire, and dynamic codes that keep redirecting even after you cancel.",
  alternates: { canonical: "/about" },
};

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

const PRINCIPLES = [
  { title: "A printed code should outlive the print run", body: "Menus, signs and packaging stay in the world for years. A code on them shouldn't stop working because a trial ended or a card expired. Our dynamic codes keep redirecting to their last destination even after you cancel." },
  { title: "Free means free", body: `The generator makes ${QR_TYPES.length} kinds of static code with your logo, colours and a frame, and downloads PNG, SVG, JPEG or PDF up to 4096 px. No sign-up, no watermark, no scan limit, no expiry.` },
  { title: "Your content stays with you", body: "The free generator runs entirely in your browser. What you type and the logos you upload are never sent to our servers." },
  { title: "Honest comparisons", body: "When we compare StayQR with other services, every fact comes from that company's own pricing or help pages, with a link and the date we checked." },
];

export default function AboutPage() {
  return (
    <main>
      <JsonLd data={breadcrumbLd(CRUMBS)} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", name: COMPANY.name, url: SITE, logo: `${SITE}/icon.svg`, email: COMPANY.email.hello }} />
      <section aria-labelledby="about-title" className="noise bg-grid relative isolate overflow-hidden pb-20 pt-28 sm:pt-36 lg:pb-28">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <Breadcrumbs items={CRUMBS} />
          <SectionHeading
            as="h1"
            id="about-title"
            immediate
            className="mt-6"
            title="QR codes that *keep working.*"
            intro="StayQR exists because too many printed QR codes stop working the day a subscription ends. We build codes you can print once and trust for years."
          />
        </div>
      </section>

      <section aria-labelledby="story-title" className="border-t border-line py-20 lg:py-28">
        <div className="mx-auto grid max-w-container gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <h2 id="story-title" className="font-display text-display-md font-semibold text-fg">Why we built it</h2>
          <div className="flex max-w-[64ch] flex-col gap-5 text-body-lg text-fg-muted">
            <p>
              Many QR code services make dynamic codes that point through their own short links. That is useful, because you can change the destination after printing. But it also means the code only works while you keep paying. When a plan ends, the code on the menu, the poster or the box can switch to an upgrade page, or stop entirely.
            </p>
            <p>
              StayQR takes the opposite position. If you cancel, your dynamic codes keep redirecting to the last destination you set, with no service page and no ads. You only lose the ability to edit them and see new analytics until you come back.
            </p>
            <p>
              For everything that never needs to change, such as WiFi details, contact cards or a link to a page you own, we offer a free static generator. Static codes store their content in the pattern itself, so they work forever without us. Read more in our guide to{" "}
              <Link href="/guides/static-vs-dynamic-qr-codes" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">static vs dynamic QR codes</Link>.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="border-t border-line py-20 lg:py-28">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <SectionHeading id="principles-title" eyebrow="What we promise" title="Four *principles.*" />
          <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:gap-5">
            {PRINCIPLES.map((p, i) => (
              <li key={p.title} className="glass rounded-lg p-6 sm:p-8" data-reveal="" style={{ ["--stagger" as string]: i % 2 }}>
                <h3 className="font-display text-h4 font-semibold text-fg">{p.title}</h3>
                <p className="mt-3 text-body text-fg-muted">{p.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-body text-fg-muted">
            Questions, feedback or press: <Link href="/contact" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">contact us</Link>. A person reads every message.
          </p>
        </div>
      </section>

      <CtaBand title="Make your first code free." body="No sign-up and no watermark. Add your logo, then download PNG, SVG, JPEG or PDF." href="/qr-code-generator" cta="Open the generator" />
    </main>
  );
}
