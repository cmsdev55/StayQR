import { COMPANY } from "@/content/company";
import { COMPETITORS } from "@/content/competitors";
import { FEATURE_PAGES } from "@/content/feature-pages";
import { INDUSTRIES } from "@/content/industries";
import { GUIDES } from "@/content/guides";
import { QR_TYPE_PAGES } from "@/content/qr-type-pages";
import { LIFETIME, PRO } from "@/content/plans";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/** Headings mark accent words with *stars*; plain text here. */
const plain = (s: string) => s.replace(/\*/g, "");

/** llms.txt (llmstxt.org): a plain map of the site for AI assistants. Optional; search engines ignore it. */
export function GET() {
  const body = `# EndureQR

> EndureQR makes QR codes that keep working. The free generator creates static QR codes (links, WiFi, contact cards, WhatsApp and 13 more types) with no sign-up, no watermark and no expiry. Dynamic codes can be edited after printing and come with scan analytics and iPhone/Android smart redirects; a free account includes one, paid plans make them unlimited, and dynamic codes keep redirecting even after you cancel.

Pricing: free static codes and one free dynamic code; Pro $${PRO.monthly}/month or $${PRO.yearly}/year; Lifetime $${LIFETIME} once. Contact: ${COMPANY.email.hello}.

## Free QR code generators

- [QR code generator](${SITE_URL}/qr-code-generator): every type, logo, frames, PNG/SVG/JPEG/PDF downloads
${QR_TYPE_PAGES.map((p) => `- [${p.h1}](${SITE_URL}/qr-code-generator/${p.slug}): ${p.description}`).join("\n")}

## Dynamic codes and features

${FEATURE_PAGES.map((p) => `- [${plain(p.h1)}](${SITE_URL}/${p.slug}): ${p.description}`).join("\n")}

## Guides

${GUIDES.map((g) => `- [${g.h1}](${SITE_URL}/guides/${g.slug}): ${g.description}`).join("\n")}

## By industry

${INDUSTRIES.map((i) => `- [QR codes for ${i.name.toLowerCase()}](${SITE_URL}/industries/${i.slug}): ${i.headline}`).join("\n")}

## Compared with other QR services

${COMPETITORS.map((c) => `- [${c.name} alternative](${SITE_URL}/alternatives/${c.slug}): ${plain(c.headline)}`).join("\n")}

## Product

- [Pricing](${SITE_URL}/pricing): plans, feature matrix and billing FAQ
- [About](${SITE_URL}/about): why EndureQR exists, who runs it and what it promises
- [Contact](${SITE_URL}/contact): support and privacy email
- [Terms](${SITE_URL}/terms) and [Privacy](${SITE_URL}/privacy)
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
