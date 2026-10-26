# Going live: Supabase, Lemon Squeezy, Vercel

Everything below is configuration; the code is done. Allow about an hour. Do the steps in order.

## 1. Supabase (accounts + database)

1. Create a project at supabase.com. Pick the region closest to most of your scanners (e.g. Frankfurt for Europe).
2. **Run the schema.** Project Settings → Database → Connection string → **Session pooler** (port 5432). Then on your machine:
   ```bash
   DATABASE_URL="postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres" node scripts/db-migrate.mjs
   ```
3. **Auth settings** (Authentication → URL Configuration):
   - Site URL: `https://stayqr.com`
   - Redirect URLs: `https://stayqr.com/auth/callback`, plus `http://localhost:3100/auth/callback` for testing
4. **Email** (Authentication → Emails): keep "Confirm email" on. Supabase's built-in sender is rate-limited, so before launch
   add your own SMTP (Resend, Postmark or similar) under Authentication → Emails → SMTP Settings, sending from `hello@stayqr.com`.
5. **Google sign-in (optional):** Authentication → Providers → Google, paste a Google OAuth client id/secret, then set
   `NEXT_PUBLIC_AUTH_GOOGLE=1`.
6. Copy for Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API),
   and the **Transaction pooler** connection string (port 6543) as `DATABASE_URL`.

## 2. Lemon Squeezy (payments, tax, invoices)

1. Create a store and complete identity verification (Settings → General). Before launch, confirm under Settings → Payouts
   that a payout method is available for your country and add it.
2. Create one product **StayQR Pro** with two subscription variants: **Monthly $3.99** and **Yearly $29**. Create a second
   product **StayQR Lifetime**, a single payment of **$79**. Copy each **variant id**.
3. Settings → Webhooks → add `https://stayqr.com/api/webhooks/lemonsqueezy` with a long random signing secret, and tick:
   `order_created`, `order_refunded`, `subscription_created`, `subscription_updated`, `subscription_cancelled`,
   `subscription_resumed`, `subscription_expired`, `subscription_paused`, `subscription_unpaused`,
   `subscription_payment_success`, `subscription_payment_failed`, `subscription_payment_recovered`, `subscription_payment_refunded`.
4. Settings → API → create a key.
5. Test the whole flow in **Test mode** first (test card `4242 4242 4242 4242`), then switch the store live and replace the
   key and variant ids with the live ones.

## 3. Vercel (hosting)

1. Import the repo, framework Next.js. Add every variable from `.env.example` (Production and Preview).
2. Add the domain `stayqr.com` and set `NEXT_PUBLIC_SITE_URL=https://stayqr.com`.
3. Set `CRON_SECRET` to a long random string. `vercel.json` already schedules the daily retention job.
4. Deploy, then run the smoke test below on the live site.

## 4. Smoke test on production

- [ ] Sign up with a real email, confirm it, land on the dashboard.
- [ ] Choose Pro yearly → Lemon Squeezy checkout (test mode) → back on Billing with "Pro · yearly".
- [ ] Create a code, print or display it, scan with an iPhone and an Android phone: both open the destination,
      and two scans appear in Analytics with a city.
- [ ] Change the destination, scan again: the new page opens.
- [ ] Pause the code: the scan shows the paused page. Unpause.
- [ ] Cancel the plan: Billing shows the end date. The code still redirects.
- [ ] In Supabase → Table editor → `webhook_events`, every row has `processed_at` set and no `error`.

## Operations

- **Harmful code reported** (abuse@stayqr.com): find it by slug and disable it. The redirect then shows a warning page.
  ```sql
  update public.codes set disabled_at = now(), disabled_reason = 'phishing report <date>' where slug = 'abc123';
  ```
- **Failed webhooks:** `select * from public.webhook_events where error is not null order by received_at desc;`
  Lemon Squeezy retries failed deliveries automatically; you can also resend from its dashboard.
- **Refund:** issue it in Lemon Squeezy. The `order_refunded` / `subscription_payment_refunded` webhook updates StayQR.
- **Local development:** `scripts/db-local.sh start`, `node scripts/db-seed.mjs`, `npm run dev -- -p 3100`, then sign
  in as `demo@stayqr.local` (dev login, localhost only).
