/**
 * Who runs EndureQR and which providers it relies on. Terms, Privacy, About and Contact all read from here,
 * so a change (a registered company, a new provider) is made once.
 */
import { SITE_HOST } from "@/lib/site";

const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL || undefined;

export const COMPANY = {
  name: "EndureQR",
  site: SITE_HOST,
  /** Courts and law named in the Terms. */
  jurisdiction: "Pakistan",
  /**
   * Public addresses. Set NEXT_PUBLIC_CONTACT_EMAIL to a mailbox you control and it is used for all three
   * (support, privacy, abuse) until separate mailboxes exist on your own domain.
   */
  email: {
    hello: CONTACT ?? "hello@endureqr.com",
    privacy: CONTACT ?? "privacy@endureqr.com",
    abuse: CONTACT ?? "abuse@endureqr.com",
  },
  /** Reply-time promise used on Contact and in Privacy. */
  replyWithin: "one business day",
};

/** The person who runs EndureQR: named on About, as the author of the guides, and in the Terms and Privacy Policy. */
export const FOUNDER = {
  name: "Armaghan Abdul Qayyum",
  role: "Founder",
  city: "Lahore",
  country: "Pakistan",
  countryCode: "PK",
  bio: [
    "Armaghan Abdul Qayyum founded EndureQR in Lahore, Pakistan, to make QR codes that people can print once and trust for years.",
    "Armaghan builds the product and writes the guides on this site, checking each fact against its primary source, such as the QR code standard, phone makers' documentation or the pricing pages of the services compared.",
  ],
};

/** EndureQR's own public profiles: linked in the footer and listed as `sameAs` on the Organization. Live profiles only. */
export const SOCIAL: { name: string; handle?: string; url: string }[] = [
  { name: "X", handle: "@endureqr_app", url: "https://x.com/endureqr_app" },
  { name: "Instagram", handle: "@getendureqr", url: "https://www.instagram.com/getendureqr/" },
  { name: "Facebook", url: "https://www.facebook.com/endureqr" },
  { name: "YouTube", handle: "@endureqr", url: "https://www.youtube.com/@endureqr" },
];

/**
 * Third-party listings of EndureQR (directories, review sites, company databases). Not shown in the footer; listed only as
 * `sameAs` on the Organization so search engines and AI assistants connect these profiles to this site. Live, public pages only.
 */
export const PROFILES: { name: string; url: string }[] = [
  { name: "Crunchbase", url: "https://www.crunchbase.com/organization/endureqr" },
  { name: "G2", url: "https://www.g2.com/products/endureqr" },
  { name: "Wellfound", url: "https://wellfound.com/company/endureqr" },
  { name: "Fazier", url: "https://fazier.com/launches/endureqr" },
  { name: "SaaSHub", url: "https://www.saashub.com/endureqr" },
];

/** Sub-processors named in the Privacy Policy. */
export const PROVIDERS = [
  { name: "Vercel", role: "website hosting and delivery" },
  { name: "Railway", role: "database hosting" },
  { name: "Resend", role: "account emails (confirmation and password reset)" },
  { name: "Polar", role: "checkout, payments, tax and invoices (merchant of record)" },
  { name: "Google", role: "optional sign-in with a Google account, and AdSense advertising on the free generator and guide pages" },
];

export const LEGAL_EFFECTIVE = "19 November 2026";
