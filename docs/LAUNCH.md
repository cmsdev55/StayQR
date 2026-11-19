# Going live: Railway (Postgres) + Vercel (app) + Polar + Resend

The whole Next.js app (pages, API, redirects, webhooks) runs on Vercel. Railway runs only Postgres.
Keep both in the same part of the world. The Railway database runs in **US West (California)**, so `vercel.json` pins
functions to **sfo1** (San Francisco). If you ever move the database, change `regions` to match (e.g. `iad1` for
US East, `fra1` for EU West).

## 1. Railway (database)

1. Done: project **stayqr** (workspace "My Projects"; rename it to EndureQR in Railway → Settings if you like) with a **Postgres** service, a public TCP proxy and the schema applied.
2. Postgres service → Variables: copy **DATABASE_PUBLIC_URL** (host `*.proxy.rlwy.net`, `?sslmode=require`). Vercel is
   outside Railway's private network, so it must use the public URL.
3. Create the tables (from your machine):
   ```bash
   DATABASE_URL="<DATABASE_PUBLIC_URL>" node scripts/db-migrate.mjs
   ```
4. Turn on backups: Postgres service → Backups (daily).

## 2. Resend (account emails)

1. resend.com → Domains → add `endureqr.com` and the DNS records it shows (SPF/DKIM). Wait for "Verified".
2. API Keys → create a key with sending access. `EMAIL_FROM=EndureQR <hello@endureqr.com>`.

## 3. Polar (payments, tax, invoices)

Lemon Squeezy stopped taking new sellers and closes on 31 March 2027; Stripe and PayPal don't serve sellers in
Pakistan, and Creem rejected the identity check (19 Nov 2026). EndureQR uses **Polar** (Polar Software, Inc.) as
merchant of record: Pakistan is on its payout list, and payouts go through Stripe Connect Express to a local bank
account. Fees: about 4–5% + 40–50¢ per sale, plus payout fees.

1. polar.sh → Sign in with Google → organisation **EndureQR** (slug `endureqr`, individual). Finance → Account:
   verify identity (photo ID, through Stripe), connect the payout account, support email, social links, then
   **Submit for review**. The live site must already name Polar in the Terms before submitting.
2. Products: **EndureQR Pro (monthly)** $3.99 every month, **EndureQR Pro (yearly)** $29 every year, **EndureQR
   Lifetime** $79 one-time. Copy each product id (a UUID) into `POLAR_PRODUCT_*`.
3. Settings → Webhooks → `https://endureqr.com/api/webhooks/polar`, format Raw; copy the secret. The app uses
   `subscription.*`, `order.paid` and `order.refunded`.
4. Settings → Developers → organisation access token (scopes: checkouts, subscriptions, customer sessions, orders,
   products read) → `POLAR_ACCESS_TOKEN`. For a sandbox token (sandbox.polar.sh) also set `POLAR_SERVER=sandbox`.
   Test the flow with a 100% discount code before the first real sale.

## 4. Google sign-in (optional)

Google Cloud Console → APIs & Services → OAuth consent screen (External, app name EndureQR) → Credentials → OAuth client
ID (Web). Authorised redirect URI: `https://endureqr.com/auth/google/callback`. Copy the client id and secret.

## 5. Vercel (app)

Done: project **endureqr** (team "Hamza Akram's projects"), live at **https://endureqr.com** (bought through Vercel,
renews yearly, DNS on Vercel). `www.endureqr.com`, `endureqr.vercel.app` and `stayqr-six.vercel.app` all redirect
(308) to the same path on endureqr.com, so short links printed on the older hosts keep working. Connected to
`github.com/cmsdev55/StayQR` (pushes to `main` deploy automatically). Set: `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`,
`CRON_SECRET`, `EMAIL_FROM`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`. Polar: `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET` and the three
`POLAR_PRODUCT_*` ids.


1. Import `github.com/cmsdev55/StayQR`, framework Next.js.
2. Environment variables (Production): everything in `.env.example`. `NEXT_PUBLIC_SITE_URL=https://endureqr.com`,
   `DATABASE_URL` = Railway's public URL, `CRON_SECRET` = a long random string.
3. Domains → add `endureqr.com` (and `www` redirecting to it).
4. Deploy. `vercel.json` schedules the daily retention job and pins the region.

## 6. Smoke test on production

- [ ] Sign up → the confirmation email arrives → the link confirms the address.
- [ ] Forgot password → email → new password → signed in.
- [ ] Choose Pro yearly → Polar checkout (100% discount code) → back on Billing showing "Pro · yearly".
- [ ] Create a code, scan it with an iPhone and an Android phone: both open the destination; scans appear in
      Analytics with a city.
- [ ] Change the destination, scan again: the new page opens. Pause it: the paused page shows.
- [ ] Cancel the plan: Billing shows the end date and the code still redirects.
- [ ] `select event_name, error from public.webhook_events order by received_at desc limit 20;` shows no errors.

## Operations

- **Harmful code reported** (abuse@endureqr.com): disable it; scanners then see a warning page.
  `update public.codes set disabled_at = now(), disabled_reason = 'phishing report <date>' where slug = 'abc123';`
- **Failed webhooks:** `select * from public.webhook_events where error is not null order by received_at desc;`
  Polar retries up to 10 times and can redeliver from Settings → Webhooks. After 10 straight failures it disables the
  endpoint and emails you; re-enable it there.
- **Refunds:** issue them in Polar (Sales → order → Refund); the `order.refunded` webhook marks the invoice refunded
  in EndureQR (a full Lifetime refund removes Lifetime).
- **Connections:** each Vercel function instance opens at most 3 connections. If Railway reports "too many
  connections" under heavy load, add a PgBouncer service on Railway and point `DATABASE_URL` at it.
- **Local development:** `scripts/db-local.sh start`, `node scripts/db-seed.mjs`, `npm run dev -- -p 3100`, log in as
  `demo@endureqr.local` / `demo-password`.
