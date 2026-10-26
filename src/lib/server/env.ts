import "server-only";

/** Server configuration. Each integration switches on when its variables are present. */
export const env = {
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100").replace(/\/$/, ""),
  databaseUrl: process.env.DATABASE_URL,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
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

/**
 * Auth mode: Supabase when configured. Otherwise a local-only dev login, so the product can be run and
 * tested end to end on a laptop; it is refused for any host that isn't localhost (see auth.ts).
 */
export const authMode: "supabase" | "dev" | "off" =
  env.supabaseUrl && env.supabaseAnonKey ? "supabase" : process.env.NODE_ENV !== "production" || process.env.ALLOW_DEV_AUTH === "1" ? "dev" : "off";

export const billingMode: "lemonsqueezy" | "dev" | "off" =
  env.lemon.apiKey && env.lemon.storeId && env.lemon.webhookSecret ? "lemonsqueezy" : authMode === "dev" ? "dev" : "off";

/** "stayqr.com/r/k3xb9" style host for short links. */
export const shortHost = () => env.siteUrl.replace(/^https?:\/\//, "");
