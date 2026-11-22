import type { Metadata } from "next";
import Link from "next/link";
import { Block } from "@/components/content/blocks";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { APP_ID, JsonLd, breadcrumbLd, pageGraph, webPageLd } from "@/components/content/json-ld";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { QrScanner } from "@/components/sections/qr-scanner";
import { SectionHeading } from "@/components/ui/section-heading";
import type { GuideBlock } from "@/content/guides";

const TITLE = "QR Code Scanner From Image: Free Online, No App";
const DESCRIPTION =
  "Scan a QR code from an image or screenshot, free and online. Drop or paste the picture to read links, WiFi and contacts. Nothing is uploaded, no app needed.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/qr-code-scanner" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/qr-code-scanner", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const BODY: GuideBlock[] = [
  { type: "h2", id: "how-to-scan-from-image", text: "How to scan a QR code from an image or screenshot" },
  {
    type: "ol",
    items: [
      "Save the image or take a screenshot of the code. On a computer, use the Snipping Tool (Windows) or Shift+Cmd+4 (Mac); on a phone, take a normal screenshot.",
      "Drop the image into the box above, paste it with Ctrl+V or Cmd+V, or press **Choose image**.",
      "Read the result before you open anything. The scanner shows the full address, so you can check where a link really goes.",
      "Press **Open link**, or copy the text, WiFi details or contact card.",
    ],
  },
  {
    type: "p",
    text: "Everything happens in your browser. The image is read on your device and never uploaded, so it's safe to scan screenshots that contain private details, such as a WiFi password.",
  },
  { type: "h2", id: "scan-without-an-app", text: "Can you scan a QR code from a photo on your phone?" },
  {
    type: "p",
    text: "Yes, and often without any app. On most iPhones, open the photo and touch and hold the code to see its link. On Android, open the image in Google Photos and tap **Lens**. For a code on paper or another screen, the phone's camera app is quickest. Our guide on [how to scan a QR code](/guides/how-to-scan-a-qr-code) covers iPhone, Android and laptops step by step.",
  },
  { type: "h2", id: "will-it-keep-working", text: "Will this QR code keep working?" },
  {
    type: "p",
    text: "The scanner tells you how the code is built. A **direct (static)** code holds the final address itself, so it keeps working as long as that page exists. A **dynamic** code holds a QR company's short link instead, which forwards to the real page, and it only works while that company keeps the link switched on. The scanner recognises short links from EndureQR, QRStuff, Unitag, ME-QR, Scanova, Flowcode, Canva and Bitly.",
  },
  {
    type: "p",
    text: "When [we tested 20 free QR code generators](/guides/free-qr-code-generators-tested), 3 gave codes that run through their own short link, and 10 of the 17 services that offer dynamic codes say on their own pages that some codes stop, pause or change when a trial or plan ends. If you're about to print, check your code here first.",
  },
  { type: "h2", id: "is-it-safe", text: "Is it safe to scan a QR code from an image?" },
  {
    type: "p",
    text: "Reading the code is safe: the scanner only shows what the code contains and opens nothing by itself. The risk is the link inside. Scammers stick fake codes on parking meters and send them in emails, a trick called quishing. Check that the address is the site you expect, and never enter passwords or card details after scanning a code you don't trust. More in [are QR codes safe?](/guides/are-qr-codes-safe)",
  },
  { type: "h2", id: "not-scanning", text: "Why can't the scanner read my QR code?" },
  {
    type: "ul",
    items: [
      "**The image is blurry or the code is tiny.** Zoom in before taking the screenshot, or crop closer to the code.",
      "**The white border is cut off.** Scanners need a light margin around the code; include it in the crop.",
      "**There are several codes in one picture.** The scanner reads one code; crop the image to the one you want.",
      "**Glare, shadows or a curved surface.** Take the photo straight on, in even light.",
      "**Very low contrast.** Light codes on light backgrounds may not read. Inverted codes (light on dark) are fine.",
    ],
  },
  {
    type: "p",
    text: "Still stuck? Work through our [QR code not scanning](/guides/qr-code-not-scanning) checklist. To make a new code that scans first time, use the [free QR code generator](/qr-code-generator).",
  },
];

const FAQ = [
  {
    q: "How do I scan a QR code from a screenshot?",
    a: "Take the screenshot, then paste it into this page with Ctrl+V or Cmd+V, or drop the image file into the box. The scanner reads the code in your browser and shows what it contains.",
  },
  {
    q: "Can I scan a QR code without an app?",
    a: "Yes. This page works in any browser, and most phone cameras read QR codes directly. On iPhone you can also touch and hold a code in a photo; on Android, use Lens in Google Photos.",
  },
  {
    q: "Is this QR code scanner free and private?",
    a: "Yes. It's free with no sign-up, and the image is processed on your device. Nothing is uploaded to EndureQR or anyone else.",
  },
  {
    q: "Can I scan a QR code that's on my computer screen?",
    a: "Yes. Take a screenshot of the code and paste it here. You can also point your phone's camera at the screen.",
  },
  {
    q: "How can I tell if a QR code will stop working?",
    a: "Scan it and look at the address. If it's the page's own website, it's a direct code and keeps working. If it's a QR company's short link, the code depends on that company keeping the link active.",
  },
];

export default function QrScannerPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "QR code scanner", path: "/qr-code-scanner" },
  ];
  const toc = BODY.filter((b): b is Extract<GuideBlock, { type: "h2" }> => b.type === "h2");
  return (
    <main>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={pageGraph(webPageLd({ path: "/qr-code-scanner", name: TITLE, description: DESCRIPTION, about: APP_ID }))} />

      <section aria-labelledby="scanner-title" className="noise bg-grid relative isolate overflow-hidden pb-16 pt-28 sm:pt-36 lg:pb-24">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <Breadcrumbs items={crumbs} />
          <SectionHeading
            as="h1"
            id="scanner-title"
            immediate
            className="mt-6"
            eyebrow="Free QR code scanner"
            title="Scan a QR code *from an image*"
            intro="Read a QR code from a screenshot, photo or saved image, free and without an app. Drop the picture below to see what the code contains, whether it opens a link directly, and if it depends on a QR company's short link. It all happens in your browser: the image is never uploaded."
          />
          <div className="mt-12">
            <h2 className="sr-only">Scan your image</h2>
            <QrScanner />
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
              Need a code instead?{" "}
              <Link href="/qr-code-generator" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">Make one free</Link>
              {" · "}
              <Link href="/sample-qr-codes" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">Sample QR codes to test</Link>
            </p>
          </nav>
          <div className="flex max-w-[68ch] flex-col gap-5">
            {BODY.map((b, i) => <Block key={i} b={b} />)}
          </div>
        </div>
      </section>

      <Faq items={FAQ} title="Scanner *questions.*" />
      <CtaBand
        title="Make a QR code that never stops working."
        body="Free static codes with your logo and no sign-up, or dynamic codes you can edit after printing that keep working even if you cancel."
        href="/qr-code-generator"
        cta="Open the generator"
      />
    </main>
  );
}
