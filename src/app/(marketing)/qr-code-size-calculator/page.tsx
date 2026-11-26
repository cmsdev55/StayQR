import type { Metadata } from "next";
import Link from "next/link";
import { Block } from "@/components/content/blocks";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { APP_ID, JsonLd, breadcrumbLd, pageGraph, webPageLd } from "@/components/content/json-ld";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { QrSizeCalculator } from "@/components/sections/qr-size-calculator";
import { SectionHeading } from "@/components/ui/section-heading";
import type { GuideBlock } from "@/content/guides";

const TITLE = "QR Code Size Calculator: Print Size by Distance";
const DESCRIPTION =
  "Free QR code size calculator: enter your link and how far away people scan, and get the minimum print size in cm and inches, module size and pixels at 300 DPI.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/qr-code-size-calculator" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/qr-code-size-calculator", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const BODY: GuideBlock[] = [
  { type: "h2", id: "how-it-works", text: "How the QR code size calculator works" },
  {
    type: "p",
    text: "The calculator checks two limits and uses whichever is larger. The first is **distance**: a printed QR code should be at least one tenth as wide as the distance people scan it from, so a poster read from 2 metres needs a code about 20 cm wide. The second is **content**: every QR code is a grid of small squares called modules, and longer content needs more of them. Each module has to be big enough for a phone camera to see, so a dense code can't shrink as far as a simple one.",
  },
  {
    type: "p",
    text: "To get the module count, the calculator encodes your actual content in your browser, the same way a generator would, with medium error correction (level M), or high (level H) if you add a logo. It then allows at least **0.8 mm per module** for everyday printing, or **0.4 mm** for sharp professional printing, close to the 0.396 mm minimum that GS1 sets for QR codes scanned at retail checkouts.",
  },
  { type: "h2", id: "examples", text: "QR code sizes for common uses" },
  {
    type: "table",
    head: ["Where it goes", "Typical scan distance", "Minimum code width"],
    rows: [
      ["Business card", "20 cm (8 in)", "2 cm (0.8 in)"],
      ["Flyer, brochure, packaging", "30 cm (12 in)", "3 cm (1.2 in)"],
      ["Table tent, menu, counter card", "50 cm (20 in)", "5 cm (2 in)"],
      ["Poster at eye level, shop window", "1 m (3.3 ft)", "10 cm (4 in)"],
      ["Large poster, trade show stand", "2 m (6.6 ft)", "20 cm (8 in)"],
      ["Banner or sign seen from a path", "5 m (16 ft)", "50 cm (20 in)"],
    ],
  },
  {
    type: "p",
    text: "These assume a short link. A contact card or a long link with tracking tags may need more, which is what the calculator works out for you. For the reasoning behind the numbers, including a table of minimum sizes by content, read our guide to the [minimum QR code size for printing](/guides/qr-code-size-for-printing).",
  },
  { type: "h2", id: "make-it-smaller", text: "How to make a QR code print smaller" },
  {
    type: "ul",
    items: [
      "**Shorten the content.** Remove tracking tags from links, or link to a page instead of encoding long text. Fewer characters means fewer modules.",
      "**Use a short link.** A [dynamic QR code](/dynamic-qr-code-generator) stores a short redirect link, so the pattern stays simple however long the real address is.",
      "**Skip the logo on tiny codes.** A logo needs level H error correction, which adds modules. On a business card, a plain code can be noticeably smaller.",
      "**Print it sharply.** A print shop or label printer can reproduce smaller modules than an office inkjet.",
    ],
  },
  { type: "h2", id: "files-and-dpi", text: "Which file to print" },
  {
    type: "p",
    text: "Download an **SVG or PDF** from the [free QR code generator](/qr-code-generator) whenever you can: vector files stay perfectly sharp at any size, so the result above is all you need. For a PNG, use the pixel size the calculator shows, which is 300 DPI at the final print size. Never enlarge a small image; download it again at the right size instead. Making signs? Our [printable QR code templates](/qr-code-templates) are already sized for tables, walls and counters.",
  },
  {
    type: "tip",
    text: "Print one test copy at the final size, put it where it will really go, and scan it with an iPhone and an Android phone from where people will stand. If it takes more than a second to scan, go bigger.",
  },
];

const FAQ = [
  {
    q: "How do I calculate the size of a QR code?",
    a: "Divide the scanning distance by 10 to get the minimum width, then check the code has at least 0.8 mm per module for everyday printing. The calculator above does both from your real content and uses the larger answer.",
  },
  {
    q: "What is the smallest size a QR code can be printed?",
    a: "About 2 cm (0.8 in) for everyday printing, scanned from close up. With very short content and sharp professional printing it can go down to about 1 cm, but test it on several phones first.",
  },
  {
    q: "What size should a QR code be on a poster?",
    a: "At least a tenth of the distance people read it from: about 10 cm for a poster at eye level read from 1 metre, and 20 cm or more for one seen from 2 metres away.",
  },
  {
    q: "How many pixels should a QR code be for printing?",
    a: "300 pixels per inch of printed width. A 2 inch (5 cm) code needs at least 600 × 600 pixels. Or use an SVG or PDF, which scale without losing sharpness.",
  },
  {
    q: "Does a logo change the QR code size?",
    a: "Yes. A logo needs high error correction (level H), which adds modules, typically making the code 15% to 30% wider for the same content. Tick the logo option in the calculator to see the difference.",
  },
];

export default function QrSizeCalculatorPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "QR code size calculator", path: "/qr-code-size-calculator" },
  ];
  const toc = BODY.filter((b): b is Extract<GuideBlock, { type: "h2" }> => b.type === "h2");
  return (
    <main>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={pageGraph(webPageLd({ path: "/qr-code-size-calculator", name: TITLE, description: DESCRIPTION, about: APP_ID }))} />

      <section aria-labelledby="calc-title" className="noise bg-grid relative isolate overflow-hidden pb-16 pt-28 sm:pt-36 lg:pb-24">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <Breadcrumbs items={crumbs} />
          <SectionHeading
            as="h1"
            id="calc-title"
            immediate
            className="mt-6"
            eyebrow="Free tool"
            title="QR code size *calculator*"
            intro="How big should your QR code be? Paste your link, say how far away people will scan it, and get the minimum print size in centimetres and inches, the size of each module and the pixels you need at 300 DPI. It counts the real modules in your code, so the answer fits your content."
          />
          <div className="mt-12">
            <h2 className="sr-only">Calculate your QR code size</h2>
            <QrSizeCalculator />
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
              Related:{" "}
              <Link href="/guides/qr-code-size-for-printing" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">Minimum QR code size guide</Link>
              {" · "}
              <Link href="/qr-code-templates" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">Printable templates</Link>
            </p>
          </nav>
          <div className="flex max-w-[68ch] flex-col gap-5">
            {BODY.map((b, i) => <Block key={i} b={b} />)}
          </div>
        </div>
      </section>

      <Faq items={FAQ} title="Size *questions.*" />
      <CtaBand
        title="Make a code that scans first time."
        body="Free QR codes with your logo and colours, downloaded as SVG or PDF so they print sharp at any size. No sign-up, no watermark."
        href="/qr-code-generator"
        cta="Open the generator"
      />
    </main>
  );
}
