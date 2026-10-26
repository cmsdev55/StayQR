# Going live: Railway (Postgres) + Vercel (app) + Lemon Squeezy + Resend

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

## 3. Lemon Squeezy (payments, tax, invoices)

1. Create a store and complete identity verification. Before launch, confirm under Settings → Payouts that a payout
   method is available for your country and add it.
2. Product **EndureQR Pro** with two subscription variants: **Monthly $3.99** and **Yearly $29**. Product **EndureQR Lifetime**:
   single payment **$79**. Copy each **variant id**.
3. Settings → Webhooks → `https://endureqr.com/api/webhooks/lemonsqueezy`, a long random signing secret, and these events:
   `order_created`, `order_refunded`, `subscription_created`, `subscription_updated`, `subscription_cancelled`,
   `subscription_resumed`, `subscription_expired`, `subscription_paused`, `subscription_unpaused`,
   `subscription_payment_success`, `subscription_payment_failed`, `subscription_payment_recovered`, `subscription_payment_refunded`.
4. Settings → API → create a key. Test everything in **Test mode** (card `4242 4242 4242 4242`) before switching live.

## 4. Google sign-in (optional)

Google Cloud Console → APIs & Services → OAuth consent screen (External, app name EndureQR) → Credentials → OAuth client
ID (Web). Authorised redirect URI: `https://endureqr.com/auth/google/callback`. Copy the client id and secret.

## 5. Vercel (app)

Done: project **stayqr** (team "Hamza Akram's projects"; rename in Vercel → Settings → General if you like), live at **https://endureqr.vercel.app** (the old stayqr-six.vercel.app address redirects there with a 301), connected to
`github.com/cmsdev55/StayQR` (pushes to `main` deploy automatically). Set: `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`,
`CRON_SECRET`, `EMAIL_FROM`. Still to add: Resend, Lemon Squeezy and (optionally) Google keys, then the domain.
When `endureqr.com` is connected, change `NEXT_PUBLIC_SITE_URL` to it and redeploy.


1. Import `github.com/cmsdev55/StayQR`, framework Next.js.
2. Environment variables (Production): everything in `.env.example`. `NEXT_PUBLIC_SITE_URL=https://endureqr.com`,
   `DATABASE_URL` = Railway's public URL, `CRON_SECRET` = a long random string.
3. Domains → add `endureqr.com` (and `www` redirecting to it).
4. Deploy. `vercel.json` schedules the daily retention job and pins the region.

## 6. Smoke test on production

- [ ] Sign up → the confirmation email arrives → the link confirms the address.
- [ ] Forgot password → email → new password → signed in.
- [ ] Choose Pro yearly → Lemon Squeezy test checkout → back on Billing showing "Pro · yearly".
- [ ] Create a code, scan it with an iPhone and an Android phone: both open the destination; scans appear in
      Analytics with a city.
- [ ] Change the destination, scan again: the new page opens. Pause it: the paused page shows.
- [ ] Cancel the plan: Billing shows the end date and the code still redirects.
- [ ] `select event_name, error from public.webhook_events order by received_at desc limit 20;` shows no errors.

## Operations

- **Harmful code reported** (abuse@endureqr.com): disable it; scanners then see a warning page.
  `update public.codes set disabled_at = now(), disabled_reason = 'phishing report <date>' where slug = 'abc123';`
- **Failed webhooks:** `select * from public.webhook_events where error is not null order by received_at desc;`
  Lemon Squeezy retries automatically and can resend from its dashboard.
- **Refunds:** issue them in Lemon Squeezy; the refund webhook updates EndureQR.
- **Connections:** each Vercel function instance opens at most 3 connections. If Railway reports "too many
  connections" under heavy load, add a PgBouncer service on Railway and point `DATABASE_URL` at it.
- **Local development:** `scripts/db-local.sh start`, `node scripts/db-seed.mjs`, `npm run dev -- -p 3100`, log in as
  `demo@endureqr.local` / `demo-password`.
