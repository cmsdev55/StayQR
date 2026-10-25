/**
 * Competitor facts for the comparison table and /alternatives pages.
 * Verified 26 Oct 2026 against each company's own pricing page and help centre; third-party sources are flagged.
 * Re-check before launch and every quarter: prices change, and these are factual claims about other companies.
 *
 * Naming trap: "QR Code Generator Pro" is qr-code-generator.com, now branded "QR Code Generator by Bitly" (QRCG).
 * "The QR Code Generator" (the-qrcode-generator.com) is a different company. Don't mix their facts.
 *
 * `confirmed` = shown on the vendor's current pricing page. Anything else renders a visible [verify] tag.
 */
export const CHECKED = "26 Oct 2026";

export type Verdict = "yes" | "no" | "partial";
export type Fact = { text: string; verdict?: Verdict; confirmed: boolean };

export type Competitor = {
  slug: string;
  name: string;
  /** For tight spots (footer, phone tables). */
  short: string;
  plan: string;
  pricePerYear: number;
  priceNote?: string;
  price: Fact;
  codes: Fact;
  scans: Fact;
  edit: Fact;
  /** "What happens when you cancel": short text, no tick or cross. */
  cancel: Fact;
  cancelLong: string;
  /** /alternatives page: headline (*asterisks* = accent), pitch, closing CTA. */
  headline: string;
  pitch: string;
  ctaTitle: string;
  sources: { label: string; url: string; thirdParty?: boolean }[];
};

export const COMPETITORS: Competitor[] = [
  {
    slug: "qr-code-generator-pro",
    name: "QR Code Generator by Bitly",
    short: "QR Code Generator",
    plan: "Starter",
    pricePerYear: 60,
    priceNote: "USD price as shown to US visitors on 26 Oct 2026. EU visitors see €96/yr (third-party figure).",
    price: { text: "$60 (Starter, billed yearly)", confirmed: true },
    codes: { text: "2 dynamic codes", verdict: "partial", confirmed: true },
    scans: { text: "10,000 scans on Starter", verdict: "no", confirmed: true },
    edit: { text: "Yes, on paid plans", verdict: "yes", confirmed: true },
    cancel: { text: "Deactivated after the trial; links “pause” if you stop paying", confirmed: false },
    cancelLong:
      "Dynamic codes are deactivated when the free trial ends and point to a service page. For paid plans, their own blog says that if you stop paying, the links pause until you renew. Their cancellation help article (read 25 Oct 2026, now behind a bot check) said codes keep redirecting for 30 days after the plan ends.",
    headline: "The QR Code Generator alternative that never *pauses* your codes",
    pitch:
      "QR Code Generator by Bitly's Starter plan is $60 a year for two dynamic codes and 10,000 scans, and links pause if you stop paying. StayQR Pro is $29 a year with unlimited codes and scans, and your codes keep working after you cancel.",
    ctaTitle: "Codes that don't pause when the plan does.",
    sources: [
      { label: "Pricing", url: "https://www.qr-code-generator.com/pricing/" },
      { label: "Help: trial expires", url: "https://support.qr-code-generator.com/hc/en-us/articles/7665046137613" },
      { label: "Blog: do QR codes expire?", url: "https://www.qr-code-generator.com/blog/do-qr-codes-expire/" },
      { label: "Help: cancelling", url: "https://support.qr-code-generator.com/hc/en-us/articles/7665399659277-How-do-I-cancel-my-QRCG-by-Bitly-subscription" },
    ],
  },
  {
    slug: "bitly",
    name: "Bitly",
    short: "Bitly",
    plan: "Core",
    pricePerYear: 120,
    price: { text: "$120 (Core, annual only)", confirmed: true },
    codes: { text: "5 QR codes a month", verdict: "partial", confirmed: true },
    scans: { text: "Unlimited", verdict: "yes", confirmed: true },
    edit: { text: "Capped: 5 redirects a month on Core, none on Free", verdict: "partial", confirmed: true },
    cancel: { text: "Keep working; complimentary-domain links stop when the domain lapses", confirmed: false },
    cancelLong:
      "Bitly links and their QR codes keep working after you downgrade. Links on a complimentary custom domain stop when that domain's registration expires, and the Free plan allows no destination changes at all.",
    headline: "The Bitly alternative with *unlimited edits* after printing",
    pitch:
      "Bitly Core is $120 a year, makes 5 QR codes a month, and lets you change where they point only 5 times a month. StayQR Pro is $29 a year with unlimited codes and unlimited edits, and your codes keep working if you cancel.",
    ctaTitle: "Change your codes as often as you like.",
    sources: [
      { label: "Pricing", url: "https://bitly.com/pages/pricing" },
      { label: "Help: downgrading", url: "https://support.bitly.com/hc/en-us/articles/360029870551-What-happens-when-I-downgrade-to-a-lower-subscription-plan" },
    ],
  },
  {
    slug: "flowcode",
    name: "Flowcode",
    short: "Flowcode",
    plan: "Pro Plus",
    pricePerYear: 300,
    price: { text: "$300 (Pro Plus, billed yearly)", confirmed: true },
    codes: { text: "Up to 50 codes", verdict: "partial", confirmed: true },
    scans: { text: "Unlimited scans; analytics stop at 6,000", verdict: "partial", confirmed: true },
    edit: { text: "“Edit destination anytime” (which plans?)", verdict: "partial", confirmed: false },
    cancel: { text: "Keep scanning but frozen; only the 2 most recent stay editable", confirmed: false },
    cancelLong:
      "After cancelling you keep access to only your 2 most recent codes. All others keep scanning to the destination you last set, but you can't change them until you subscribe again. The help article also mentions codes “deleted due to the cancellation” without saying which.",
    headline: "The Flowcode alternative that never *freezes* your codes",
    pitch:
      "Flowcode Pro Plus is $300 a year for up to 50 codes, with analytics capped at 6,000 scans. Cancel, and all but your 2 newest codes are frozen. StayQR Pro is $29 a year with unlimited codes, scans and analytics, and every code stays yours after you cancel.",
    ctaTitle: "Codes that stay editable, every one of them.",
    sources: [
      { label: "Pricing", url: "https://www.flowcode.com/pricing" },
      { label: "Help: what happens when I cancel", url: "https://support.flowcode.com/what-happens-to-my-flowcodes-when-i-cancel-go-to-flowcode" },
    ],
  },
];

export const STAYQR_ROW = {
  name: "StayQR",
  plan: "Pro",
  pricePerYear: 29,
  price: "$29, or $79 once",
  codes: "Unlimited codes",
  scans: "Unlimited",
  edit: "Unlimited",
  cancel: "Keep working, for life",
};

export const competitorBySlug = (slug: string) => COMPETITORS.find((c) => c.slug === slug);
