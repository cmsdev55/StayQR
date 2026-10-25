import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { JsonLd, SITE, breadcrumbLd } from "@/components/content/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import { COMPANY } from "@/content/company";

export const metadata: Metadata = {
  title: "Contact StayQR",
  description: `Get help with StayQR, ask about plans and billing, report a harmful QR code or make a privacy request. A person replies within ${COMPANY.replyWithin}.`,
  alternates: { canonical: "/contact" },
};

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

const CHANNELS = [
  { title: "Help and billing", body: "Questions about the generator, your codes, plans, refunds or invoices.", email: COMPANY.email.hello },
  { title: "Report a harmful code", body: "A StayQR code that leads to phishing, malware, fraud or other abuse. Include the code's short link or a photo of it.", email: COMPANY.email.abuse },
  { title: "Privacy requests", body: "Access, export, correction or deletion of your personal data.", email: COMPANY.email.privacy },
];

export default function ContactPage() {
  return (
    <main>
      <JsonLd data={breadcrumbLd(CRUMBS)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          url: `${SITE}/contact`,
          mainEntity: { "@type": "Organization", name: COMPANY.name, url: SITE, contactPoint: CHANNELS.map((c) => ({ "@type": "ContactPoint", contactType: c.title, email: c.email })) },
        }}
      />
      <section aria-labelledby="contact-title" className="noise bg-grid relative isolate overflow-hidden pb-24 pt-28 sm:pt-36 lg:pb-32">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <Breadcrumbs items={CRUMBS} />
          <SectionHeading
            as="h1"
            id="contact-title"
            immediate
            className="mt-6"
            title="Talk to a *person.*"
            intro={`Email the right address below and a person will reply within ${COMPANY.replyWithin}.`}
          />
          <ul className="mt-14 grid gap-4 md:grid-cols-3 lg:gap-5">
            {CHANNELS.map((c, i) => (
              <li key={c.email} className="glass flex flex-col rounded-lg p-6 sm:p-8" data-reveal="" style={{ ["--stagger" as string]: i }}>
                <h2 className="font-display text-h4 font-semibold text-fg">{c.title}</h2>
                <p className="mt-3 flex-1 text-body-sm text-fg-muted">{c.body}</p>
                <a href={`mailto:${c.email}`} className="mt-6 font-mono text-body-sm text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">{c.email}</a>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-[64ch] text-body text-fg-muted">
            Many answers are already in our <Link href="/guides" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">guides</Link> and the{" "}
            <Link href="/#faq" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">FAQ</Link>. For how we handle data, see the{" "}
            <Link href="/privacy" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">Privacy Policy</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
