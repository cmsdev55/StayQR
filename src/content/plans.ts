/** EndureQR plans and limits (enforced in src/lib/server: 500-row bulk create, 12-month scan retention on Pro). */
export type Billing = "monthly" | "yearly";

export const PRO = {
  monthly: 3.99,
  yearly: 29,
  /** yearly price expressed per month, for the toggle */
  yearlyPerMonth: 29 / 12,
};
export const LIFETIME = 79;
/** Dynamic codes a free account may create and edit, with every Pro feature except folders and bulk. */
export const FREE_DYNAMIC_CODES = 1;
export const YEARLY_SAVING = Math.round((1 - PRO.yearly / (PRO.monthly * 12)) * 100); // 39%

export const PLAN_FEATURES = {
  free: ["Unlimited static QR codes, 17 types", "1 dynamic code: edit it after printing, see its scans", "Your logo and a call-to-action frame", "PNG, SVG, JPEG and PDF up to 4096 px", "No watermark, no sign-up for static codes"],
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
    "Everything in Pro, with no renewals",
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
      { label: "Dynamic QR codes", free: "1", pro: "Unlimited", lifetime: "Unlimited" },
      { label: "Scans per month", free: "Unlimited", pro: "Unlimited", lifetime: "Unlimited" },
      { label: "Edit destination after printing", free: true, pro: true, lifetime: true },
      { label: "Codes keep working after you cancel", free: true, pro: true, lifetime: true },
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
      { label: "Scan analytics", free: "12 months", pro: "12 months", lifetime: "No time limit" },
      { label: "iOS / Android split", free: true, pro: true, lifetime: true },
      { label: "Bulk create from CSV", free: false, pro: "500 rows", lifetime: "500 rows" },
      { label: "Folders and search", free: false, pro: true, lifetime: true },
      { label: "Pause a code with a friendly page", free: true, pro: true, lifetime: true },
    ],
  },
];
