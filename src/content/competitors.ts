/**
 * Competitor facts for the comparison table and /alternatives pages.
 * The comparison covers Bitly and QRFY. Prices match the pricing-page screenshots supplied on 26 Oct 2026
 * (docs/evidence/); other facts come from each company's own pricing page or FAQ, read the same day.
 * Re-check before launch and every quarter: prices change, and these are factual claims about other companies.
 *
 * `confirmed` = stated on the vendor's own pricing, help or FAQ page (cited in `sources`). An unconfirmed fact
 * renders a visible [verify] tag, so leave it false until you have read it on the vendor's site.
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
  /** Verbatim from the vendor's own help/FAQ page, shown on /alternatives as "in their words". */
  quote: { text: string[]; source: string; url: string };
  /** /alternatives page: headline (*asterisks* = accent), pitch, closing CTA. */
  headline: string;
  pitch: string;
  ctaTitle: string;
  sources: { label: string; url: string; thirdParty?: boolean }[];
};

export const COMPETITORS: Competitor[] = [
  {
    slug: "bitly",
    name: "Bitly",
    short: "Bitly",
    plan: "Core",
    pricePerYear: 120,
    price: { text: "$120 (Core, $10/mo billed yearly)", confirmed: true },
    codes: { text: "5 QR codes a month", verdict: "partial", confirmed: true },
    scans: { text: "Unlimited", verdict: "yes", confirmed: true },
    edit: { text: "Capped: 5 redirects a month on Core, none on Free", verdict: "partial", confirmed: true },
    cancel: { text: "Keep working; complimentary-domain links stop when the domain lapses", confirmed: true },
    cancelLong:
      "Bitly links and their QR codes keep working after you downgrade. Links on a complimentary custom domain stop when that domain's registration expires, and the Free plan allows no destination changes at all.",
    quote: {
      text: [
        "Your bit.ly links continue to work after you downgrade your account.",
        "If you downgrade to a plan that doesn't include a custom domain: We won't renew the registration for your complimentary domain. When that registration expires, any links using that domain will stop working.",
      ],
      source: "Bitly Support: What happens when I downgrade to a lower subscription plan?",
      url: "https://support.bitly.com/hc/en-us/articles/360029870551-What-happens-when-I-downgrade-to-a-lower-subscription-plan",
    },
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
    slug: "qrfy",
    name: "QRFY",
    short: "QRFY",
    plan: "12-month",
    pricePerYear: 228,
    priceNote: "QRFY's cheapest rate needs a 12-month commitment. Shorter terms cost more: $117 a quarter or $174 every six months. VAT excluded.",
    price: { text: "$228 (12-month plan, $19/mo)", confirmed: true },
    codes: { text: "Unlimited dynamic codes", verdict: "yes", confirmed: true },
    scans: { text: "Unlimited", verdict: "yes", confirmed: true },
    edit: { text: "Yes, any time", verdict: "yes", confirmed: true },
    cancel: { text: "Kept but locked: no access to codes or their data until you pay again", confirmed: true },
    cancelLong:
      "QRFY's FAQ says your codes \u201cwon't go anywhere, but you won't be able to access them or the collected data until you update your plan.\u201d It doesn't say whether dynamic codes keep redirecting in the meantime. After the 7-day trial, codes are stored for three months, again without access, unless you subscribe.",
    quote: {
      text: [
        "Your QR codes won't go anywhere, but you won't be able to access them or the collected data until you update your plan.",
        "Your QR codes will be stored for three months after the trial period has ended. During this period you will not be able to access them until you contract one of our plans.",
      ],
      source: "QRFY FAQ: What happens to my QR codes if my subscription is cancelled?",
      url: "https://qrfy.com/faq",
    },
    headline: "The QRFY alternative that stays *yours* after you cancel",
    pitch:
      "QRFY is $228 a year on its 12-month plan, or $39 a month if you pay quarterly. Cancel, and you lose access to your codes and their data until you pay again. StayQR Pro is $29 a year, or $79 once, and your codes keep working after you cancel.",
    ctaTitle: "Keep your codes, and $199 a year.",
    sources: [
      { label: "Pricing", url: "https://qrfy.com/pricing" },
      { label: "FAQ", url: "https://qrfy.com/faq" },
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
