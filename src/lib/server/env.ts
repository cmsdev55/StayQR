import "server-only";

/** Server configuration. Each integration switches on when its variables are present. */
export const env = {
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100").replace(/\/$/, ""),
  databaseUrl: process.env.DATABASE_URL,
  resendKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM ?? "EndureQR <hello@endureqr.com>",
  google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET },
  polar: {
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    webhookSecret: process.env.POLAR_WEBHOOK_SECRET,
    // sandbox tokens only work against Polar's sandbox API
    apiBase: process.env.POLAR_SERVER === "sandbox" ? "https://sandbox-api.polar.sh/v1" : "https://api.polar.sh/v1",
    products: {
      "pro-monthly": process.env.POLAR_PRODUCT_PRO_MONTHLY,
      "pro-yearly": process.env.POLAR_PRODUCT_PRO_YEARLY,
      lifetime: process.env.POLAR_PRODUCT_LIFETIME,
    },
  },
  cronSecret: process.env.CRON_SECRET,
  /** Who may open /admin: comma-separated, matched case-insensitively against a confirmed account email. */
  adminEmails: (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean),
  safeBrowsingKey: process.env.GOOGLE_SAFE_BROWSING_KEY,
};

/** Google sign-in shows up once both OAuth keys are set. */
export const googleEnabled = () => !!(env.google.clientId && env.google.clientSecret);

/** Real billing with Polar keys; simulated checkout only in development without them. */
export const billingMode: "polar" | "dev" | "off" =
  env.polar.accessToken && env.polar.webhookSecret
    ? "polar"
    : process.env.NODE_ENV !== "production" || process.env.ALLOW_SIMULATED_BILLING === "1"
      ? "dev"
      : "off";

/** "endureqr.com/r/k3xb9" style host for short links. */
export const shortHost = () => env.siteUrl.replace(/^https?:\/\//, "");
