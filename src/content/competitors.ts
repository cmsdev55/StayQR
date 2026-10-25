/**
 * Competitor facts for the comparison section and /alternatives pages.
 * Checked 25 Oct 2026 against each vendor's own pricing page and help centre (sources below).
 * We compare the cheapest paid plan that includes dynamic (editable) codes, billed annually.
 * Re-check before launch: prices change, and these are claims about other companies.
 */
export const CHECKED = "October 2026";

export type AfterCancel = "stops" | "partial" | "keeps-locked";

export type Competitor = {
  slug: string;
  name: string;
  plan: string;
  pricePerYear: number;
  codesIncluded: string;
  afterCancel: AfterCancel;
  afterCancelShort: string;
  afterCancelLong: string;
  scanLimit: string;
  scanLimitOk: boolean;
  editAfterPrint: string;
  sources: { label: string; url: string }[];
};

export const COMPETITORS: Competitor[] = [
  {
    slug: "qr-code-generator-pro",
    name: "QR Code Generator Pro",
    plan: "Starter",
    pricePerYear: 60,
    codesIncluded: "2 dynamic codes",
    afterCancel: "stops",
    afterCancelShort: "Stop 30 days after the plan ends",
    afterCancelLong:
      "Dynamic codes keep redirecting until the paid period ends, plus 30 days. After that they send scanners to a service page instead of your destination.",
    scanLimit: "10,000 scans",
    scanLimitOk: false,
    editAfterPrint: "While subscribed",
    sources: [
      { label: "Pricing", url: "https://www.qr-code-generator.com/pricing/" },
      {
        label: "Cancellation help article",
        url: "https://support.qr-code-generator.com/hc/en-us/articles/7665399659277-How-do-I-cancel-my-QRCG-by-Bitly-subscription",
      },
    ],
  },
  {
    slug: "bitly",
    name: "Bitly",
    plan: "Core",
    pricePerYear: 120,
    codesIncluded: "5 codes a month",
    afterCancel: "partial",
    afterCancelShort: "Custom-domain codes can break",
    afterCancelLong:
      "Codes on bit.ly keep working after a downgrade. Codes on a complimentary domain stop when that domain's registration lapses, and custom domains lose SSL renewal.",
    scanLimit: "Unlimited",
    scanLimitOk: true,
    editAfterPrint: "Paid plans",
    sources: [
      { label: "Pricing", url: "https://bitly.com/pages/pricing" },
      {
        label: "Downgrade help article",
        url: "https://support.bitly.com/hc/en-us/articles/360029870551-What-happens-when-I-downgrade-to-a-lower-subscription-plan",
      },
    ],
  },
  {
    slug: "flowcode",
    name: "Flowcode",
    plan: "Pro Plus",
    pricePerYear: 300,
    codesIncluded: "50 codes",
    afterCancel: "keeps-locked",
    afterCancelShort: "Keep scanning, editing locked",
    afterCancelLong:
      "Flowcodes keep scanning after a plan lapses, but you lose the ability to edit their destination or design until you upgrade again.",
    scanLimit: "Analytics stop at 6,000",
    scanLimitOk: false,
    editAfterPrint: "While subscribed",
    sources: [
      { label: "Pricing", url: "https://www.flowcode.com/pricing" },
      { label: "Help centre", url: "https://intercom.help/flowcode/en/articles/7061611" },
    ],
  },
];

export const STAYQR_ROW = {
  name: "StayQR",
  plan: "Pro",
  pricePerYear: 29,
  codesIncluded: "Unlimited codes",
  afterCancelShort: "Keep working, forever",
  scanLimit: "Unlimited",
  editAfterPrint: "Always",
};

export const competitorBySlug = (slug: string) => COMPETITORS.find((c) => c.slug === slug);
