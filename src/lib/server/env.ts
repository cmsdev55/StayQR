import "server-only";

/** Server configuration. Each integration switches on when its variables are present. */
export const env = {
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100").replace(/\/$/, ""),
  databaseUrl: process.env.DATABASE_URL,
  resendKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM ?? "EndureQR <hello@endureqr.com>",
  google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET },
  creem: {
    apiKey: process.env.CREEM_API_KEY,
    webhookSecret: process.env.CREEM_WEBHOOK_SECRET,
    // test keys only work against Creem's test API
    apiBase: process.env.CREEM_API_KEY?.startsWith("creem_test_") ? "https://test-api.creem.io/v1" : "https://api.creem.io/v1",
    products: {
      "pro-monthly": process.env.CREEM_PRODUCT_PRO_MONTHLY,
      "pro-yearly": process.env.CREEM_PRODUCT_PRO_YEARLY,
      lifetime: process.env.CREEM_PRODUCT_LIFETIME,
    },
  },
  cronSecret: process.env.CRON_SECRET,
  safeBrowsingKey: process.env.GOOGLE_SAFE_BROWSING_KEY,
};

/** Google sign-in shows up once both OAuth keys are set. */
export const googleEnabled = () => !!(env.google.clientId && env.google.clientSecret);

/** Real billing with Creem keys; simulated checkout only in development without them. */
export const billingMode: "creem" | "dev" | "off" =
  env.creem.apiKey && env.creem.webhookSecret
    ? "creem"
    : process.env.NODE_ENV !== "production" || process.env.ALLOW_SIMULATED_BILLING === "1"
      ? "dev"
      : "off";

/** "endureqr.com/r/k3xb9" style host for short links. */
export const shortHost = () => env.siteUrl.replace(/^https?:\/\//, "");
