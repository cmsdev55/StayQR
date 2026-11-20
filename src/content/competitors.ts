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
  /** /alternatives page <title> and meta description. */
  seoTitle: string;
  metaDescription: string;
  /** /alternatives page: headline (*asterisks* = accent), pitch, closing CTA. */
  headline: string;
  pitch: string;
  ctaTitle: string;
  sources: { label: string; url: string; thirdParty?: boolean; /** Whose page it is, when not the competitor's own. */ by?: string }[];
  /** When this competitor's facts were read, if later than CHECKED. */
  checked?: string;
  /** false = only on its /alternatives page, not in the home comparison table (e.g. a free tool, not a paid plan). */
  homeTable?: false;
  /** Whose words `quote` is, when it isn't the competitor itself (e.g. the paid product it sends users to). */
  quoteFrom?: string;
  /** Replaces the hero's main button (default: "Switch to EndureQR" → sign-up). */
  primaryCta?: { label: string; href: string };
  /** Replaces the sentence under the yearly saving. */
  savingNote?: string;
  /** Replaces the three "Switching" steps. */
  switchSteps?: [string, string][];
  /** Replaces the competitor-specific FAQ items (the general EndureQR item is still added). */
  faq?: { q: string; a: string }[];
};

export const COMPETITORS: Competitor[] = [
  {
    slug: "bitly",
    seoTitle: "Bitly Alternative for QR Codes: $29 a Year, Unlimited Edits",
    metaDescription: "Bitly Core is $120 a year for 5 QR codes and 5 edits a month. EndureQR Pro is $29 a year for unlimited codes, edits and scans; codes work if you cancel.",
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
    headline: "The Bitly QR code alternative with *unlimited edits* after printing",
    pitch:
      "EndureQR is an alternative to Bitly for QR codes you need to edit after printing. According to Bitly's pricing page, checked 26 October 2026, Bitly Core costs $120 a year billed yearly and allows 5 QR codes and 5 destination changes a month. EndureQR Pro costs $29 a year with unlimited dynamic codes, edits and scans, and its codes keep redirecting if you cancel.",
    ctaTitle: "Change your codes as often as you like.",
    sources: [
      { label: "Pricing", url: "https://bitly.com/pages/pricing" },
      { label: "Help: downgrading", url: "https://support.bitly.com/hc/en-us/articles/360029870551-What-happens-when-I-downgrade-to-a-lower-subscription-plan" },
    ],
  },
  {
    slug: "qrfy",
    seoTitle: "QRFY Alternative: Unlimited Dynamic QR Codes for $29 a Year",
    metaDescription: "QRFY costs $228 a year, and cancelling locks you out of your codes and data. EndureQR Pro is $29 a year or $79 once, and codes keep working if you cancel.",
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
      "EndureQR is an alternative to QRFY for dynamic QR codes that stay usable after you stop paying. QRFY's 12-month plan costs $228 a year ($19 a month), and its FAQ says cancelled accounts cannot access their codes or data until they pay again (checked 26 October 2026). EndureQR Pro costs $29 a year, or $79 once, and its dynamic codes keep redirecting after you cancel.",
    ctaTitle: "Keep your codes, and $199 a year.",
    sources: [
      { label: "Pricing", url: "https://qrfy.com/pricing" },
      { label: "FAQ", url: "https://qrfy.com/faq" },
    ],
  },
  {
    slug: "qr-code-monkey",
    checked: "21 Nov 2026",
    homeTable: false,
    seoTitle: "QR Code Monkey Alternative With Editable Codes, $29 a Year",
    metaDescription: "QR Code Monkey makes free static codes you can't edit. EndureQR makes the same free codes, plus editable ones for $29 a year that keep working if you cancel.",
    name: "QR Code Monkey",
    short: "QR Code Monkey",
    plan: "Starter (QR Code Generator PRO)",
    pricePerYear: 119.88,
    priceNote:
      "QR Code Monkey itself is free for static codes. The price is the Starter plan of QR Code Generator PRO, where QR Code Monkey sends you for editable codes, in US dollars: $9.99 a month billed yearly or $19.99 billed monthly. Some countries see a lower regional price, from $60 a year. VAT excluded.",
    price: { text: "Free for static codes. Editable codes: $119.88 (QR Code Generator PRO Starter)", confirmed: true },
    codes: { text: "Unlimited static codes; 2 dynamic codes on PRO Starter", verdict: "partial", confirmed: true },
    scans: { text: "Unlimited on static codes; 10,000 on PRO Starter", verdict: "partial", confirmed: true },
    edit: { text: "Static codes can't be edited; 2 dynamic codes on PRO Starter", verdict: "partial", confirmed: true },
    cancel: { text: "Static codes keep working; PRO dynamic codes go to a service page 30 days after the contract ends", confirmed: true },
    cancelLong:
      "QR Code Monkey's free codes are static: its site says they \u201cdo not expire and will work forever\u201d, but you can't edit them. For editable codes it points you to QR Code Generator PRO. That product's help pages say dynamic codes point to a service page when the 14-day trial ends, and 30 days after a cancelled contract ends.",
    quoteFrom: "QR Code Generator PRO",
    quote: {
      text: [
        "Dynamic QR Codes are deactivated and point to a service page rather than the original destination.",
        "Once the 30 days are over, your account is locked and your Dynamic QR Codes redirect to a service page instead of their original destination.",
      ],
      source: "QRCG by Bitly Help: when the trial expires, and after you cancel",
      url: "https://support.qr-code-generator.com/hc/en-us/articles/7665399659277-How-do-I-cancel-my-QRCG-by-Bitly-subscription",
    },
    headline: "The QR Code Monkey alternative with codes you can *edit after printing*",
    pitch:
      "EndureQR is an alternative to QR Code Monkey for people who want the same free QR codes with a logo, plus codes they can change after printing. QR Code Monkey's codes are static, and its site says you \u201ccan't edit the QR code again\u201d. For editable codes it sends you to QR Code Generator PRO, whose Starter plan costs $119.88 a year in US dollars for 2 dynamic codes (checked 21 November 2026). EndureQR Pro costs $29 a year for unlimited editable codes that keep redirecting if you cancel.",
    ctaTitle: "Free codes today, editable ones when you need them.",
    primaryCta: { label: "Make a free QR code", href: "/qr-code-generator" },
    savingNote:
      "Comparing QR Code Generator PRO Starter, where QR Code Monkey sends you for editable codes, with EndureQR Pro, both billed yearly in US dollars. Or pay $79 once and never renew.",
    switchSteps: [
      ["Keep your printed codes", "QR Code Monkey's static codes encode your link directly, so they keep working wherever they're printed. There's nothing to move."],
      ["Make new codes for free", "Use the free EndureQR generator with your logo and colours, no account needed. Download PNG, SVG, JPEG or a 300 dpi PDF."],
      ["Go dynamic when you need to", "Upgrade to Pro for codes you can edit and track after printing. They keep redirecting even if you cancel."],
    ],
    faq: [
      {
        q: "Is EndureQR affiliated with QR Code Monkey?",
        a: "No. EndureQR is an independent product. QR Code Monkey and QR Code Generator PRO (\u201cQRCG by Bitly\u201d) are trademarks of their owners. We compare them using their public pages, checked 21 Nov 2026.",
      },
      {
        q: "Do QR Code Monkey codes expire?",
        a: "No. QR Code Monkey's site says its codes are static and \u201cdo not expire and will work forever\u201d. EndureQR's free codes work the same way: both encode your link directly, so they don't depend on either company staying in business.",
      },
      {
        q: "When do I need a QR Code Monkey alternative?",
        a: "When you want to change where a printed code points, or count how many people scanned it. Static codes can't do either. QR Code Monkey sends you to QR Code Generator PRO for that, whose dynamic codes stop redirecting when the trial ends, or 30 days after you cancel. EndureQR Pro's codes keep redirecting after you cancel.",
      },
      {
        q: "Does the PDF download keep my logo?",
        a: "On EndureQR, yes: the PDF is a 300 dpi print file of the full design, logo and colours included. QR Code Monkey's site says its .pdf and .eps formats \u201conly support classic QR codes without the design and logo options\u201d; its SVG keeps them.",
      },
    ],
    sources: [
      { label: "Generator and FAQ", url: "https://www.qrcode-monkey.com/" },
      { label: "Pricing", by: "QR Code Generator PRO", url: "https://www.qr-code-generator.com/pricing/" },
      { label: "Help: trial ends", by: "QR Code Generator PRO", url: "https://support.qr-code-generator.com/hc/en-us/articles/7665046137613-What-happens-to-my-account-and-QR-Codes-when-the-trial-expires" },
      { label: "Help: cancelling", by: "QR Code Generator PRO", url: "https://support.qr-code-generator.com/hc/en-us/articles/7665399659277-How-do-I-cancel-my-QRCG-by-Bitly-subscription" },
    ],
  },
];

export const ENDUREQR_ROW = {
  name: "EndureQR",
  plan: "Pro",
  pricePerYear: 29,
  price: "$29, or $79 once",
  codes: "Unlimited codes",
  scans: "Unlimited",
  edit: "Unlimited",
  cancel: "Keep working after you cancel",
};

/** Competitors in the home comparison table (paid plans only). */
export const COMPARE_TABLE = COMPETITORS.filter((c) => c.homeTable !== false);

export const competitorBySlug = (slug: string) => COMPETITORS.find((c) => c.slug === slug);
