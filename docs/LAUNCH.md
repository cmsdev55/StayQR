# Going live: Railway (Postgres) + Vercel (app) + Lemon Squeezy + Resend

The whole Next.js app (pages, API, redirects, webhooks) runs on Vercel. Railway runs only Postgres.
Keep both in the same part of the world: `vercel.json` pins functions to **iad1** (Washington DC), so create the
Railway database in **US East (Virginia)**. If most scanners are in Europe, use Railway **EU West (Amsterdam)** and
change `regions` in `vercel.json` to `["fra1"]`.

## 1. Railway (database)

1. New project → **Deploy PostgreSQL**. Region as above.
2. Postgres service → Variables: copy **DATABASE_PUBLIC_URL** (host like `*.proxy.rlwy.net`). Vercel is outside
   Railway's private network, so it must use the public URL.
3. Create the tables (from your machine):
   ```bash
   DATABASE_URL="<DATABASE_PUBLIC_URL>" node scripts/db-migrate.mjs
   ```
4. Turn on backups: Postgres service → Backups (daily).

## 2. Resend (account emails)

1. resend.com → Domains → add `stayqr.com` and the DNS records it shows (SPF/DKIM). Wait for "Verified".
2. API Keys → create a key with sending access. `EMAIL_FROM=StayQR <hello@stayqr.com>`.

## 3. Lemon Squeezy (payments, tax, invoices)

1. Create a store and complete identity verification. Before launch, confirm under Settings → Payouts that a payout
   method is available for your country and add it.
2. Product **StayQR Pro** with two subscription variants: **Monthly $3.99** and **Yearly $29**. Product **StayQR Lifetime**:
   single payment **$79**. Copy each **variant id**.
3. Settings → Webhooks → `https://stayqr.com/api/webhooks/lemonsqueezy`, a long random signing secret, and these events:
   `order_created`, `order_refunded`, `subscription_created`, `subscription_updated`, `subscription_cancelled`,
   `subscription_resumed`, `subscription_expired`, `subscription_paused`, `subscription_unpaused`,
   `subscription_payment_success`, `subscription_payment_failed`, `subscription_payment_recovered`, `subscription_payment_refunded`.
4. Settings → API → create a key. Test everything in **Test mode** (card `4242 4242 4242 4242`) before switching live.

## 4. Google sign-in (optional)

Google Cloud Console → APIs & Services → OAuth consent screen (External, app name StayQR) → Credentials → OAuth client
ID (Web). Authorised redirect URI: `https://stayqr.com/auth/google/callback`. Copy the client id and secret.

## 5. Vercel (app)

1. Import `github.com/cmsdev55/StayQR`, framework Next.js.
2. Environment variables (Production): everything in `.env.example`. `NEXT_PUBLIC_SITE_URL=https://stayqr.com`,
   `DATABASE_URL` = Railway's public URL, `CRON_SECRET` = a long random string.
3. Domains → add `stayqr.com` (and `www` redirecting to it).
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

- **Harmful code reported** (abuse@stayqr.com): disable it; scanners then see a warning page.
  `update public.codes set disabled_at = now(), disabled_reason = 'phishing report <date>' where slug = 'abc123';`
- **Failed webhooks:** `select * from public.webhook_events where error is not null order by received_at desc;`
  Lemon Squeezy retries automatically and can resend from its dashboard.
- **Refunds:** issue them in Lemon Squeezy; the refund webhook updates StayQR.
- **Connections:** each Vercel function instance opens at most 3 connections. If Railway reports "too many
  connections" under heavy load, add a PgBouncer service on Railway and point `DATABASE_URL` at it.
- **Local development:** `scripts/db-local.sh start`, `node scripts/db-seed.mjs`, `npm run dev -- -p 3100`, log in as
  `demo@stayqr.local` / `demo-password`.
