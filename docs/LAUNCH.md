# Going live: Railway (Postgres) + Vercel (app) + Creem + Resend

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

## 3. Creem (payments, tax, invoices)

Lemon Squeezy stopped taking new sellers and closes on 31 March 2027, and its successor (Stripe Managed Payments) does
not support sellers in Pakistan, so EndureQR uses Creem as merchant of record. Creem pays out to a local bank account in
Pakistan (its bank partner may accept personal accounts only).

1. Store **EndureQR** (individual seller, Pakistan). Business details, identity verification, then **Balance → Payout
   Account** submits the store for review (1–2 working days). A rejected store is not reviewed again for 3 months, so
   the live site must already match the Terms (Creem named as reseller) before submitting.
2. Products, in test mode first and again in live mode: **EndureQR Pro monthly** $3.99 every month, **EndureQR Pro
   yearly** $29 every year, **EndureQR Lifetime** $79 one-time; tax category SaaS. Copy each **product id** (`prod_…`).
3. Developers → Webhooks → `https://endureqr.com/api/webhooks/creem`; copy the signing secret. All events can stay on;
   the app uses `checkout.completed`, `subscription.*` and `refund.created`.
4. Developers → API keys. A `creem_test_…` key talks to Creem's test API automatically. Test with card
   `4242 4242 4242 4242` before switching to the live key and live product ids.

## 4. Google sign-in (optional)

Google Cloud Console → APIs & Services → OAuth consent screen (External, app name EndureQR) → Credentials → OAuth client
ID (Web). Authorised redirect URI: `https://endureqr.com/auth/google/callback`. Copy the client id and secret.

## 5. Vercel (app)

Done: project **endureqr** (team "Hamza Akram's projects"), live at **https://endureqr.com** (bought through Vercel,
renews yearly, DNS on Vercel). `www.endureqr.com`, `endureqr.vercel.app` and `stayqr-six.vercel.app` all redirect
(308) to the same path on endureqr.com, so short links printed on the older hosts keep working. Connected to
`github.com/cmsdev55/StayQR` (pushes to `main` deploy automatically). Set: `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`,
`CRON_SECRET`, `EMAIL_FROM`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`. Creem: `CREEM_API_KEY`, `CREEM_WEBHOOK_SECRET` and the three
`CREEM_PRODUCT_*` ids.


1. Import `github.com/cmsdev55/StayQR`, framework Next.js.
2. Environment variables (Production): everything in `.env.example`. `NEXT_PUBLIC_SITE_URL=https://endureqr.com`,
   `DATABASE_URL` = Railway's public URL, `CRON_SECRET` = a long random string.
3. Domains → add `endureqr.com` (and `www` redirecting to it).
4. Deploy. `vercel.json` schedules the daily retention job and pins the region.

## 6. Smoke test on production

- [ ] Sign up → the confirmation email arrives → the link confirms the address.
- [ ] Forgot password → email → new password → signed in.
- [ ] Choose Pro yearly → Creem test checkout → back on Billing showing "Pro · yearly".
- [ ] Create a code, scan it with an iPhone and an Android phone: both open the destination; scans appear in
      Analytics with a city.
- [ ] Change the destination, scan again: the new page opens. Pause it: the paused page shows.
- [ ] Cancel the plan: Billing shows the end date and the code still redirects.
- [ ] `select event_name, error from public.webhook_events order by received_at desc limit 20;` shows no errors.

## Operations

- **Harmful code reported** (abuse@endureqr.com): disable it; scanners then see a warning page.
  `update public.codes set disabled_at = now(), disabled_reason = 'phishing report <date>' where slug = 'abc123';`
- **Failed webhooks:** `select * from public.webhook_events where error is not null order by received_at desc;`
  Creem retries up to five times and can resend from its dashboard.
- **Refunds:** issue them in Creem; the `refund.created` webhook marks the invoice refunded in EndureQR.
- **Connections:** each Vercel function instance opens at most 3 connections. If Railway reports "too many
  connections" under heavy load, add a PgBouncer service on Railway and point `DATABASE_URL` at it.
- **Local development:** `scripts/db-local.sh start`, `node scripts/db-seed.mjs`, `npm run dev -- -p 3100`, log in as
  `demo@endureqr.local` / `demo-password`.
