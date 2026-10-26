import "server-only";

/** Server configuration. Each integration switches on when its variables are present. */
export const env = {
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100").replace(/\/$/, ""),
  databaseUrl: process.env.DATABASE_URL,
  resendKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM ?? "StayQR <hello@stayqr.com>",
  google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET },
  lemon: {
    apiKey: process.env.LEMONSQUEEZY_API_KEY,
    storeId: process.env.LEMONSQUEEZY_STORE_ID,
    webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET,
    variants: {
      "pro-monthly": process.env.LEMONSQUEEZY_VARIANT_PRO_MONTHLY,
      "pro-yearly": process.env.LEMONSQUEEZY_VARIANT_PRO_YEARLY,
      lifetime: process.env.LEMONSQUEEZY_VARIANT_LIFETIME,
    },
  },
  cronSecret: process.env.CRON_SECRET,
  safeBrowsingKey: process.env.GOOGLE_SAFE_BROWSING_KEY,
};

/** Google sign-in shows up once both OAuth keys are set. */
export const googleEnabled = () => !!(env.google.clientId && env.google.clientSecret);

/** Real billing with Lemon Squeezy keys; simulated checkout only in development without them. */
export const billingMode: "lemonsqueezy" | "dev" | "off" =
  env.lemon.apiKey && env.lemon.storeId && env.lemon.webhookSecret
    ? "lemonsqueezy"
    : process.env.NODE_ENV !== "production" || process.env.ALLOW_SIMULATED_BILLING === "1"
      ? "dev"
      : "off";

/** "stayqr.com/r/k3xb9" style host for short links. */
export const shortHost = () => env.siteUrl.replace(/^https?:\/\//, "");
