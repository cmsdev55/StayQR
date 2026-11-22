import type { Metadata } from "next";
import Link from "next/link";
import { Block } from "@/components/content/blocks";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { APP_ID, JsonLd, breadcrumbLd, pageGraph, webPageLd } from "@/components/content/json-ld";
import { QrSvg } from "@/components/qr/qr-svg";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { SectionHeading } from "@/components/ui/section-heading";
import type { GuideBlock } from "@/content/guides";
import { qrMatrix } from "@/lib/qr";

const TITLE = "Sample QR Codes: Free Test Codes for Every Type";
const DESCRIPTION =
  "Free sample QR codes to test a scanner, app or printer: website link, WiFi, contact card, email, phone, SMS, location, event and text. Safe example data only.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/sample-qr-codes" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/sample-qr-codes", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

/** Example payloads use reserved or fictional data: example.com (IANA), 555-01xx numbers, a network that doesn't exist. */
const SAMPLES: { name: string; tests: string; data: string; make?: string }[] = [
  { name: "Website link", tests: "Opens a web page. The most common QR code.", data: "https://example.com", make: "url" },
  { name: "WiFi network", tests: "Offers to join a WiFi network (it doesn't exist, so joining will fail).", data: "WIFI:T:WPA;S:Example Guest WiFi;P:sample-password-123;;", make: "wifi" },
  { name: "Contact card (vCard)", tests: "Offers to save a contact with name, phone, email and company.", data: "BEGIN:VCARD\nVERSION:3.0\nN:Example;Jane\nFN:Jane Example\nORG:Example Ltd\nTEL:+15555550100\nEMAIL:jane@example.com\nURL:https://example.com\nEND:VCARD", make: "vcard" },
  { name: "Email", tests: "Opens a new email with the address, subject and message filled in.", data: "mailto:hello@example.com?subject=Test%20QR%20code&body=This%20is%20a%20sample%20QR%20code.", make: "email" },
  { name: "Phone number", tests: "Offers to call a fictional 555 number.", data: "tel:+15555550100", make: "phone" },
  { name: "SMS", tests: "Opens a text message with the number and message ready to send.", data: "SMSTO:+15555550100:Hello from a sample QR code", make: "sms" },
  { name: "Location", tests: "Opens a map at a set point (Trafalgar Square, London).", data: "geo:51.5080,-0.1281", make: "location" },
  { name: "Calendar event", tests: "Offers to add an event to the calendar.", data: "BEGIN:VEVENT\nSUMMARY:Sample QR code event\nDTSTART:20270115T100000Z\nDTEND:20270115T110000Z\nLOCATION:Example Hall\nEND:VEVENT", make: "event" },
  { name: "Plain text", tests: "Shows a short message on screen, with no internet needed.", data: "Hello! This is a sample QR code from EndureQR. If you can read this, your scanner works.", make: "text" },
];

/** Same destination, different density: checks how a scanner copes with small modules. */
const DENSITY: { name: string; tests: string; data: string }[] = [
  { name: "Simple code (25 × 25)", tests: "A short link: large modules, the easiest code to scan.", data: "https://example.com" },
  { name: "Dense code (49 × 49)", tests: "A long link with tracking tags: small modules, harder at a distance or when printed small.", data: "https://example.com/landing/sample-page?utm_source=qr&utm_medium=print&utm_campaign=sample-qr-code-density-test&ref=endureqr-test-12345678" },
];

function CodeCard({ name, tests, data, make }: { name: string; tests: string; data: string; make?: string }) {
  const m = qrMatrix(data, 0);
  return (
    <li className="glass flex flex-col rounded-lg p-5 sm:p-6">
      <div className="mx-auto w-full max-w-[220px] rounded-md bg-white p-4 text-[#0B0D12]">
        <QrSvg m={m} className="block aspect-square w-full" />
      </div>
      <h3 className="mt-5 font-display text-h4 font-semibold text-fg">{name}</h3>
      <p className="mt-1 text-body-sm text-fg-muted">{tests}</p>
      <details className="mt-3 text-body-sm">
        <summary className="cursor-pointer text-fg-muted hover:text-fg">What it contains ({m.length} × {m.length} modules)</summary>
        <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-all rounded-sm border border-line bg-bg-raised p-3 font-mono text-[12px] text-fg">{data}</pre>
      </details>
      {make && (
        <Link href={`/qr-code-generator/${make}`} className="mt-auto pt-4 text-body-sm text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">
          Make your own {name.toLowerCase()} QR code
        </Link>
      )}
    </li>
  );
}

const BODY: GuideBlock[] = [
  { type: "h2", id: "how-to-use", text: "How to use these sample QR codes" },
  {
    type: "ol",
    items: [
      "Open your phone's camera, a scanning app or the [online QR code scanner](/qr-code-scanner).",
      "Point it at a sample on this screen, or save the page and test from a printout.",
      "Check that the right action appears: a link to open, a network to join, a contact to save.",
      "Expand **What it contains** under a code to compare what your scanner read with what the code holds.",
    ],
  },
  {
    type: "p",
    text: "Every sample uses safe placeholder data: example.com is reserved for examples, the phone numbers are fictional 555 numbers, and the WiFi network doesn't exist. Nothing here tracks you, because every code is static: the content is stored in the pattern itself and phones read it without contacting EndureQR.",
  },
  { type: "h2", id: "what-to-test", text: "What sample QR codes are useful for" },
  {
    type: "ul",
    items: [
      "**Checking a scanner or app** you're building, buying or setting up, such as a ticket scanner or a point-of-sale camera.",
      "**Testing print quality.** Print the simple and dense codes at the size you plan to use and scan them from where people will stand. Our guide to the [minimum QR code size](/guides/qr-code-size-for-printing) explains the numbers.",
      "**Showing people how QR codes work** in a class or a workshop, without sending them anywhere real.",
      "**Testing design choices.** Compare a plain code with your own design, made in the [free QR code generator](/qr-code-generator), to check colours and a logo don't stop it scanning.",
    ],
  },
  { type: "h2", id: "density", text: "Why some QR codes are harder to scan" },
  {
    type: "p",
    text: "A QR code gets more modules (the small squares) as it holds more data. The simple sample holds a short link in a 25 × 25 grid; the dense one holds a long link with tracking tags in a 49 × 49 grid. At the same printed size, the dense code's modules are about half the width, so phones need to be closer and the print needs to be sharper. If your own code looks busy, shorten the link before printing.",
  },
];

const FAQ = [
  { q: "Are these sample QR codes safe to scan?", a: "Yes. They use placeholder data only: example.com, fictional 555 phone numbers and a WiFi network that doesn't exist. They're static codes, so scanning them doesn't contact EndureQR or track you." },
  { q: "Can I use these QR codes in my own tests or materials?", a: "Yes, use them freely for testing, teaching or demos. To make codes with your own content, use the free QR code generator; there's no sign-up." },
  { q: "Why doesn't the WiFi sample connect?", a: "On purpose: the network in the sample doesn't exist. Your phone should still offer to join \"Example Guest WiFi\", which shows the scanner read the code correctly." },
  { q: "How do I scan a QR code that's on my screen?", a: "Point another phone's camera at your screen, or take a screenshot and drop it into our online QR code scanner, which reads it in your browser." },
];

export default function SampleQrCodesPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Sample QR codes", path: "/sample-qr-codes" },
  ];
  return (
    <main>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={pageGraph(webPageLd({ path: "/sample-qr-codes", name: TITLE, description: DESCRIPTION, about: APP_ID }))} />

      <section aria-labelledby="samples-title" className="noise bg-grid relative isolate overflow-hidden pb-16 pt-28 sm:pt-36 lg:pb-24">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <Breadcrumbs items={crumbs} />
          <SectionHeading
            as="h1"
            id="samples-title"
            immediate
            className="mt-6"
            eyebrow="Test codes"
            title="Sample QR codes *for every type*"
            intro="Free example QR codes to test a scanner, an app or a printer. Each one shows what it should do when scanned, and what it contains. Safe placeholder data only, and every code is static, so nothing tracks your scans."
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {SAMPLES.map((s) => <CodeCard key={s.name} {...s} />)}
          </ul>
          <h2 className="mt-16 font-display text-display-md font-semibold text-fg">Simple vs dense</h2>
          <p className="mt-3 max-w-[60ch] text-body text-fg-muted">The same kind of content at two lengths, to test how a scanner or a print size copes with small modules.</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {DENSITY.map((s) => <CodeCard key={s.name} {...s} />)}
          </ul>
        </div>
      </section>

      <section aria-label="In depth" className="border-t border-line py-20 lg:py-28">
        <div className="mx-auto flex max-w-[68ch] flex-col gap-5 px-4 sm:px-6">
          {BODY.map((b, i) => <Block key={i} b={b} />)}
        </div>
      </section>

      <Faq items={FAQ} title="Sample code *questions.*" />
      <CtaBand
        title="Ready to make your own?"
        body="Free QR codes with your logo and colours, no sign-up, no watermark, and they never expire."
        href="/qr-code-generator"
        cta="Open the generator"
      />
    </main>
  );
}
