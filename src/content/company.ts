/**
 * Who runs StayQR and which providers it relies on. Terms, Privacy, About and Contact all read from here,
 * so a change (a registered company, a new provider) is made once.
 */
export const COMPANY = {
  name: "StayQR",
  site: "stayqr.com",
  /** Courts and law named in the Terms. */
  jurisdiction: "Pakistan",
  email: {
    hello: "hello@stayqr.com",
    privacy: "privacy@stayqr.com",
    abuse: "abuse@stayqr.com",
  },
  /** Reply-time promise used on Contact and in Privacy. */
  replyWithin: "one business day",
};

/** Sub-processors named in the Privacy Policy. */
export const PROVIDERS = [
  { name: "Vercel", role: "website hosting and delivery" },
  { name: "Railway", role: "database hosting" },
  { name: "Resend", role: "account emails (confirmation and password reset)" },
  { name: "Lemon Squeezy", role: "checkout, payments, tax and invoices (merchant of record)" },
  { name: "Google", role: "optional sign-in with a Google account, and AdSense advertising on the free generator and guide pages" },
];

export const LEGAL_EFFECTIVE = "26 October 2026";
