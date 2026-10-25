/** StayQR plans. Prices are the brief's; limits are placeholders until the product team confirms them. */
export type Billing = "monthly" | "yearly";

export const PRO = {
  monthly: 3.99,
  yearly: 29,
  /** yearly price expressed per month, for the toggle */
  yearlyPerMonth: 29 / 12,
};
export const LIFETIME = 79;
export const YEARLY_SAVING = Math.round((1 - PRO.yearly / (PRO.monthly * 12)) * 100); // 39%

export const PLAN_FEATURES = {
  free: ["Unlimited static QR codes, 17 types", "Your logo and a call-to-action frame", "PNG, SVG, JPEG and PDF up to 4096 px", "No sign-up, no watermark"],
  pro: [
    "Unlimited dynamic QR codes",
    "Unlimited scans, no caps",
    "Edit the destination after printing",
    "Analytics: devices, cities, time of day",
    "iOS / Android smart redirects",
    "Bulk create from CSV",
    "Codes keep working if you cancel",
  ],
  lifetime: [
    "Everything in Pro, forever",
    "One payment, no renewals",
    "All future features included",
    "Priority support",
  ],
};

/** The full feature matrix used on /pricing. */
export const MATRIX: { group: string; rows: { label: string; free: string | boolean; pro: string | boolean; lifetime: string | boolean }[] }[] = [
  {
    group: "Codes",
    rows: [
      { label: "Static QR codes", free: "Unlimited", pro: "Unlimited", lifetime: "Unlimited" },
      { label: "Dynamic QR codes", free: false, pro: "Unlimited", lifetime: "Unlimited" },
      { label: "Scans per month", free: "Unlimited", pro: "Unlimited", lifetime: "Unlimited" },
      { label: "Edit destination after printing", free: false, pro: true, lifetime: true },
      { label: "Codes keep working after you cancel", free: "n/a", pro: true, lifetime: true },
    ],
  },
  {
    group: "Design",
    rows: [
      { label: "Colours, dots and corner styles", free: true, pro: true, lifetime: true },
      { label: "Logo in the centre", free: true, pro: true, lifetime: true },
      { label: "Frames with a call to action", free: true, pro: true, lifetime: true },
      { label: "PNG, SVG, JPEG and print-ready PDF", free: true, pro: true, lifetime: true },
    ],
  },
  {
    group: "Insight and control",
    rows: [
      { label: "Scan analytics", free: false, pro: "12 months", lifetime: "Forever" },
      { label: "iOS / Android split", free: false, pro: true, lifetime: true },
      { label: "Bulk create from CSV", free: false, pro: "500 rows", lifetime: "500 rows" },
      { label: "Folders and search", free: false, pro: true, lifetime: true },
      { label: "Pause a code with a friendly page", free: false, pro: true, lifetime: true },
    ],
  },
];
