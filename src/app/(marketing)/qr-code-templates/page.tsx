import type { Metadata } from "next";
import Link from "next/link";
import { Block } from "@/components/content/blocks";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { APP_ID, JsonLd, breadcrumbLd, pageGraph, webPageLd } from "@/components/content/json-ld";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { QrTemplates } from "@/components/sections/qr-templates";
import { SectionHeading } from "@/components/ui/section-heading";
import type { GuideBlock } from "@/content/guides";

const TITLE = "Free Printable QR Code Templates: WiFi, Menu, Review, Pay";
const DESCRIPTION =
  "Free printable QR code templates: a WiFi sign, a table tent for menus, Google review cards and a scan-to-pay sign. Add your details, print or save as PDF.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/qr-code-templates" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/qr-code-templates", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const BODY: GuideBlock[] = [
  { type: "h2", id: "how-to-use", text: "How to make a printable QR code sign" },
  {
    type: "ol",
    items: [
      "Choose a template above: a WiFi sign, a table tent, review cards or a scan-to-pay sign.",
      "Add your details. For WiFi, type the network name and password; for the others, paste your link.",
      "Change the heading and pick a colour and paper size (A4 or US Letter).",
      "Press **Print or save as PDF**. In the print window, set the scale to 100% or \"Actual size\", or choose **Save as PDF** to print later or send to a print shop.",
      "Scan the printout with your phone before you put it out, ideally with an iPhone and an Android phone.",
    ],
  },
  {
    type: "p",
    text: "The codes are made in your browser and are static, so they never expire and have no scan limit. Nothing you type is sent to EndureQR, including your WiFi password. Need an SVG for Canva, Word or a designer? Press **Download SVG** and you get the whole sheet as a vector file that stays sharp at any size.",
  },
  { type: "h2", id: "templates", text: "Which template to use" },
  {
    type: "table",
    head: ["Template", "Layout", "Good for"],
    rows: [
      ["WiFi sign", "One sign per page, password printed as a backup", "Cafés, hotel rooms, offices, rentals, waiting rooms"],
      ["Table tent", "Landscape sheet, fold in half, code on both sides", "Restaurant menus, ordering, feedback on tables"],
      ["Review cards", "Four cards per sheet, cut along the dashed lines", "Counters, receipts, delivery bags, thank-you notes"],
      ["Scan to pay", "One sign per page with the payee name and link", "Market stalls, tip jars, counters, invoices"],
    ],
  },
  {
    type: "p",
    text: "For the WiFi sign, our [WiFi QR code guide](/guides/wifi-qr-code) explains guest networks and what to do when the password changes. For menus, see [QR codes for restaurant menus](/guides/qr-code-for-restaurant-menu). For review cards, here's [how to find your Google review link](/guides/qr-code-for-google-reviews).",
  },
  { type: "h2", id: "printing-qr-codes", text: "Printing QR codes: what matters" },
  {
    type: "ul",
    items: [
      "**Size.** The templates print the code at about 12 cm on a sign, 8 cm on a table tent and 6 cm on a card, so it scans from a comfortable distance. As a rule, a code should be at least a tenth of the scanning distance wide. Our guide to [QR code size for printing](/guides/qr-code-size-for-printing) has the full table, and the [QR code size calculator](/qr-code-size-calculator) works it out for your own link.",
      "**Scale.** Print at 100% or \"Actual size\". \"Fit to page\" works too, but don't shrink review cards further, or the codes get small.",
      "**Contrast.** The code itself is always printed dark on white, which every phone can read. Your colour goes on the heading and the trim.",
      "**Quiet zone.** The white border around each code is part of it. Don't trim into it when cutting cards, and keep stickers and tape off it.",
      "**Paper and finish.** Use thick paper or card (160 to 300 gsm) for table tents and cards. Matte or a soft-touch laminate works best; glossy laminate can reflect lights and stop a scan.",
      "**Test.** Scan every design from the distance people will stand at, in the lighting where it will hang.",
    ],
  },
  { type: "h2", id: "scan-to-pay-safety", text: "Keep scan-to-pay signs safe" },
  {
    type: "p",
    text: "Fake QR stickers placed over real ones are a known scam, sometimes called quishing. Print the payee name under the code (the template does this), put the sign behind glass or a counter where you can see it, and check it each morning for stickers. Tell customers to check the name on the payment page before they pay. More in [are QR codes safe?](/guides/are-qr-codes-safe)",
  },
  { type: "h2", id: "change-later", text: "When a printed code needs to change" },
  {
    type: "p",
    text: "A static code always opens the same thing. If your menu link, review link or payment page might change, make a [dynamic QR code](/dynamic-qr-code-generator) instead and paste its short link into the template. You can then point the printed sign somewhere new without reprinting it, and see how many people scan it. EndureQR's dynamic codes keep working even if you cancel. To see whether a free code will keep working, read [we tested 20 free QR code generators](/guides/free-qr-code-generators-tested).",
  },
];

const FAQ = [
  {
    q: "Are these QR code templates free?",
    a: "Yes. Every template is free to use and print, with no sign-up and no watermark. The QR codes are static, so they never expire.",
  },
  {
    q: "How do I print a QR code sign at the right size?",
    a: "Press Print or save as PDF, then set the scale to 100% or Actual size in the print window and pick the paper size you chose (A4 or US Letter). The templates already size the code for the distance people scan from.",
  },
  {
    q: "Can I edit the template in Canva or Word?",
    a: "Yes. Press Download SVG to get the whole sheet as a vector file, then import it into Canva, Word, PowerPoint, Illustrator or Inkscape.",
  },
  {
    q: "How do I make a table tent with a QR code?",
    a: "Choose the Table tent template, paste your menu link, and print it on A4 or Letter card in landscape. Fold along the dashed line: the code appears the right way up on both sides.",
  },
  {
    q: "Is it safe to print my WiFi password on the sign?",
    a: "For a guest network, yes, that's the point. The QR code contains the password anyway. Don't put your main or office network on a public sign; set up a separate guest network instead.",
  },
];

export default function QrTemplatesPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Printable QR code templates", path: "/qr-code-templates" },
  ];
  const toc = BODY.filter((b): b is Extract<GuideBlock, { type: "h2" }> => b.type === "h2");
  return (
    <main>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={pageGraph(webPageLd({ path: "/qr-code-templates", name: TITLE, description: DESCRIPTION, about: APP_ID }))} />

      <section aria-labelledby="templates-title" className="noise bg-grid relative isolate overflow-hidden pb-16 pt-28 sm:pt-36 lg:pb-24">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <Breadcrumbs items={crumbs} />
          <SectionHeading
            as="h1"
            id="templates-title"
            immediate
            className="mt-6"
            eyebrow="Free printables"
            title="Printable QR code *templates*"
            intro="Ready-to-print QR code signs: a WiFi sign, a folding table tent for your menu, Google review cards and a scan-to-pay sign. Add your details, see your real QR code on the sheet, then print it or save it as a PDF. Free, no sign-up, and nothing you type leaves your browser."
          />
          <div className="mt-12">
            <h2 className="sr-only">Make your printable sign</h2>
            <QrTemplates />
          </div>
        </div>
      </section>

      <section aria-label="In depth" className="border-t border-line py-20 lg:py-28">
        <div className="mx-auto grid max-w-container grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,8fr)] lg:gap-16">
          <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">On this page</p>
            <ol className="mt-4 flex flex-col gap-2.5 border-l border-line pl-4">
              {toc.map((h) => (
                <li key={h.id}><a href={`#${h.id}`} className="text-body-sm text-fg-muted transition-colors hover:text-fg">{h.text}</a></li>
              ))}
            </ol>
            <p className="mt-8 text-body-sm text-fg-muted">
              Need just the code?{" "}
              <Link href="/qr-code-generator" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">Free QR code generator</Link>
              {" · "}
              <Link href="/qr-code-with-logo" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">Add your logo</Link>
            </p>
          </nav>
          <div className="flex max-w-[68ch] flex-col gap-5">
            {BODY.map((b, i) => <Block key={i} b={b} />)}
          </div>
        </div>
      </section>

      <Faq items={FAQ} title="Template *questions.*" />
      <CtaBand
        title="Want a code with your logo?"
        body="Make a QR code with your logo, colours and a frame in the free generator, or a dynamic code you can change after printing."
        href="/qr-code-generator"
        cta="Open the generator"
      />
    </main>
  );
}
