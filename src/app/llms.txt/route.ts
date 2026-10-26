import { COMPANY } from "@/content/company";
import { GUIDES } from "@/content/guides";
import { QR_TYPE_PAGES } from "@/content/qr-type-pages";
import { LIFETIME, PRO } from "@/content/plans";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/** llms.txt (llmstxt.org): a plain map of the site for AI assistants. Optional; search engines ignore it. */
export function GET() {
  const body = `# StayQR

> StayQR makes QR codes that keep working. The free generator creates static QR codes (links, WiFi, contact cards, WhatsApp and 13 more types) with no sign-up, no watermark and no expiry. Paid plans add dynamic codes you can edit after printing, scan analytics and iPhone/Android smart redirects, and dynamic codes keep redirecting even after you cancel.

Pricing: free static codes; Pro $${PRO.monthly}/month or $${PRO.yearly}/year; Lifetime $${LIFETIME} once. Contact: ${COMPANY.email.hello}.

## Free QR code generators

- [QR code generator](${SITE_URL}/qr-code-generator): every type, logo, frames, PNG/SVG/JPEG/PDF downloads
${QR_TYPE_PAGES.map((p) => `- [${p.h1}](${SITE_URL}/qr-code-generator/${p.slug}): ${p.description}`).join("\n")}

## Guides

${GUIDES.map((g) => `- [${g.h1}](${SITE_URL}/guides/${g.slug}): ${g.description}`).join("\n")}

## Product

- [Pricing](${SITE_URL}/pricing): plans, feature matrix and billing FAQ
- [About](${SITE_URL}/about): why StayQR exists and what it promises
- [Terms](${SITE_URL}/terms) and [Privacy](${SITE_URL}/privacy)
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
