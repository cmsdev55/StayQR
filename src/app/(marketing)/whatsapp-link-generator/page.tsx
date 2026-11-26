import type { Metadata } from "next";
import Link from "next/link";
import { Block } from "@/components/content/blocks";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { APP_ID, JsonLd, breadcrumbLd, pageGraph, webPageLd } from "@/components/content/json-ld";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { WhatsAppLinkGenerator } from "@/components/sections/whatsapp-link-generator";
import { SectionHeading } from "@/components/ui/section-heading";
import type { GuideBlock } from "@/content/guides";

const TITLE = "WhatsApp Link Generator: Free wa.me Click-to-Chat Link";
const DESCRIPTION =
  "Free WhatsApp link generator: make a wa.me link that opens a chat with you, with a message already typed, plus a QR code. For your bio, website and ads.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/whatsapp-link-generator" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/whatsapp-link-generator", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const BODY: GuideBlock[] = [
  { type: "h2", id: "what-is-a-wa-me-link", text: "What is a WhatsApp link?" },
  {
    type: "p",
    text: "A WhatsApp link, or click-to-chat link, is WhatsApp's own way to start a chat without saving a number first. It looks like **wa.me/923001234567**: the domain wa.me followed by the full phone number in international format. Add **?text=** and a message, and that message is already typed when the chat opens. Tapping the link opens WhatsApp on a phone or computer, or WhatsApp Web in the browser.",
  },
  { type: "h2", id: "how-to-make", text: "How to create a WhatsApp link" },
  {
    type: "ol",
    items: [
      "Type your WhatsApp number with the country code, for example +92 300 1234567 or +44 7700 900123. The generator removes the +, spaces and dashes for you.",
      "Add an opening message if you like, such as \"Hi, I'd like to order\" or \"Hi, I saw your ad\".",
      "Press **Copy link** and paste it wherever you want people to contact you.",
      "Press **Test it** to check it opens a chat with the right number before you share it.",
    ],
  },
  {
    type: "p",
    text: "The most common mistake is the local format. Leave out the leading 0 of a local number and any 00 or + before the country code: **0300 1234567** in Pakistan becomes **923001234567**, and **07700 900123** in the UK becomes **447700900123**. A wrong format opens a \"phone number shared via url is invalid\" message instead of your chat.",
  },
  { type: "h2", id: "link-formats", text: "WhatsApp link formats" },
  {
    type: "table",
    head: ["Link", "What it does"],
    rows: [
      ["wa.me/923001234567", "Opens a chat with that number"],
      ["wa.me/923001234567?text=Hi%20there", "Opens the chat with \"Hi there\" already typed"],
      ["wa.me/?text=Hi%20there", "Opens WhatsApp with the message ready and lets the person choose a contact"],
      ["api.whatsapp.com/send?phone=923001234567", "The older long form; it does the same as wa.me"],
      ["chat.whatsapp.com/…", "A group invite link, made in the group's settings, not here"],
    ],
  },
  {
    type: "p",
    text: "Spaces and special characters in the message are encoded automatically (a space becomes %20), so the link works in any app. Messages in Urdu, Hindi, Arabic and other languages, and emoji, all work.",
  },
  { type: "h2", id: "where-to-use", text: "Where to put your WhatsApp link" },
  {
    type: "ul",
    items: [
      "**Instagram and TikTok bio:** paste the link in your profile's website field, or add it to your link-in-bio page.",
      "**Facebook page:** paste it in your page's About section or a pinned post, or connect WhatsApp in the page settings to get a WhatsApp button.",
      "**Your website:** make a \"Chat on WhatsApp\" button that links to it.",
      "**Google Business Profile:** add it as your website or booking link so customers can message you from Maps.",
      "**Email signature and ads:** one tap starts a conversation instead of a form.",
      "**Print:** posters, flyers, packaging and shop windows need a QR code instead. The generator above makes one from the same link, and the [WhatsApp QR code generator](/qr-code-generator/whatsapp) adds your logo, colours and a \"Scan to chat\" frame.",
    ],
  },
  { type: "h2", id: "tips", text: "Tips for more chats" },
  {
    type: "ul",
    items: [
      "**Write the message as the customer would say it.** \"Hi, I'd like to book a table for tonight\" gets a better start than \"Contact us\".",
      "**Use a different message per place.** \"Hi, from Instagram\" and \"Hi, from the website\" tell you where each chat came from, with no tracking tools.",
      "**Reply quickly.** People expect WhatsApp answers in minutes. A WhatsApp Business account can send a greeting or away message automatically.",
      "**Show the number too.** Some people prefer to call or save the contact.",
    ],
  },
  {
    type: "p",
    text: "Printing the code on something that lasts? A static code holds the link itself and never expires. If your number or message might change, a [dynamic QR code](/dynamic-qr-code-generator) lets you edit where it points after printing. Our [printable QR code templates](/qr-code-templates) turn any link into a ready-to-print sign.",
  },
];

const FAQ = [
  {
    q: "How do I create a WhatsApp link?",
    a: "Type your number with the country code into the generator above, add an optional message and copy the link. It's a wa.me link, such as wa.me/923001234567, which opens a chat with you.",
  },
  {
    q: "Is the WhatsApp link generator free?",
    a: "Yes, completely free with no sign-up. The link is WhatsApp's own click-to-chat format, so it never expires and works without EndureQR.",
  },
  {
    q: "Why does my WhatsApp link say the phone number is invalid?",
    a: "The number is usually in local format. Use the full international number without the leading 0, +, spaces or dashes: 0300 1234567 in Pakistan becomes 923001234567. Also check the number is registered on WhatsApp.",
  },
  {
    q: "Can I make a WhatsApp link with a message?",
    a: "Yes. Add your message in the generator and it's added to the link after ?text=. When someone taps the link, the chat opens with your message already typed, and they can edit it before sending.",
  },
  {
    q: "Does a WhatsApp link work with WhatsApp Business?",
    a: "Yes. A wa.me link works for any number registered on WhatsApp or WhatsApp Business.",
  },
  {
    q: "How do I turn a WhatsApp link into a QR code?",
    a: "The generator above shows a QR code for your link as you type, and you can download it as SVG. For a logo, colours or PNG and PDF files, use the free WhatsApp QR code generator.",
  },
];

export default function WhatsAppLinkGeneratorPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "WhatsApp link generator", path: "/whatsapp-link-generator" },
  ];
  const toc = BODY.filter((b): b is Extract<GuideBlock, { type: "h2" }> => b.type === "h2");
  return (
    <main>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={pageGraph(webPageLd({ path: "/whatsapp-link-generator", name: TITLE, description: DESCRIPTION, about: APP_ID }))} />

      <section aria-labelledby="wa-title" className="noise bg-grid relative isolate overflow-hidden pb-16 pt-28 sm:pt-36 lg:pb-24">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <Breadcrumbs items={crumbs} />
          <SectionHeading
            as="h1"
            id="wa-title"
            immediate
            className="mt-6"
            eyebrow="Free tool"
            title="WhatsApp link *generator*"
            intro="Make a free WhatsApp link that opens a chat with you, with your message already typed. Paste it in your Instagram bio, on your website or in an ad, and get a QR code for print from the same link. No sign-up, and your number never leaves your browser."
          />
          <div className="mt-12">
            <h2 className="sr-only">Create your WhatsApp link</h2>
            <WhatsAppLinkGenerator />
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
              Need it on paper?{" "}
              <Link href="/qr-code-generator/whatsapp" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">WhatsApp QR code generator</Link>
            </p>
          </nav>
          <div className="flex max-w-[68ch] flex-col gap-5">
            {BODY.map((b, i) => <Block key={i} b={b} />)}
          </div>
        </div>
      </section>

      <Faq items={FAQ} title="WhatsApp link *questions.*" />
      <CtaBand
        title="Put your WhatsApp on paper."
        body="Turn your WhatsApp link into a QR code with your logo and colours, free, or a dynamic code you can change after printing."
        href="/qr-code-generator/whatsapp"
        cta="Make a WhatsApp QR code"
      />
    </main>
  );
}
