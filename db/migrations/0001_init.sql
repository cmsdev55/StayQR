-- StayQR core schema: accounts and sessions, billing, dynamic codes and scans. Plain Postgres 14+ (Railway, local).
-- The app is the only client: it connects over DATABASE_URL and scopes every query by user id.

-- ── Accounts ─────────────────────────────────────────────────────────────
create table public.profiles (
  id                 uuid primary key default gen_random_uuid(),
  email              text not null,
  name               text,
  timezone           text not null default 'UTC',
  password_hash      text,                                     -- scrypt; null for Google-only accounts
  email_verified_at  timestamptz,
  google_sub         text unique,
  created_at         timestamptz not null default now()
);
create unique index profiles_email_idx on public.profiles (lower(email));

-- Session cookies hold a random token; only its SHA-256 is stored, so a database leak can't be replayed as logins.
create table public.sessions (
  id            text primary key,                              -- sha256(token), hex
  user_id       uuid not null references public.profiles (id) on delete cascade,
  created_at    timestamptz not null default now(),
  expires_at    timestamptz not null,
  last_seen_at  timestamptz not null default now(),
  user_agent    text
);
create index sessions_user_idx on public.sessions (user_id);

-- One-time links: email verification and password reset (also stored hashed).
create table public.auth_tokens (
  id          text primary key,                                -- sha256(token), hex
  user_id     uuid not null references public.profiles (id) on delete cascade,
  kind        text not null check (kind in ('verify', 'reset')),
  expires_at  timestamptz not null,
  used_at     timestamptz,
  created_at  timestamptz not null default now()
);

-- Throttling for login, sign-up and reset requests (rows older than a day are deleted by the retention cron).
create table public.auth_attempts (
  id     bigint generated always as identity primary key,
  key    text not null,                                        -- e.g. "login:email:a@b.com", "signup:ip:1.2.3.4"
  at     timestamptz not null default now()
);
create index auth_attempts_key_idx on public.auth_attempts (key, at desc);

-- ── Billing (mirrors Lemon Squeezy, written only by the webhook) ─────────
create table public.subscriptions (
  id                  text primary key,                       -- Lemon Squeezy subscription id
  user_id             uuid not null references public.profiles (id) on delete cascade,
  customer_id         text not null,
  variant_id          text not null,
  plan                text not null check (plan in ('pro-monthly', 'pro-yearly')),
  status              text not null,                          -- on_trial | active | paused | past_due | unpaid | cancelled | expired
  renews_at           timestamptz,
  ends_at             timestamptz,
  card_brand          text,
  card_last_four      text,
  portal_url          text,
  update_payment_url  text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index subscriptions_user_idx on public.subscriptions (user_id);

create table public.orders (
  id           text primary key,                              -- Lemon Squeezy order id
  user_id      uuid not null references public.profiles (id) on delete cascade,
  variant_id   text not null,
  plan         text not null check (plan in ('lifetime', 'pro-monthly', 'pro-yearly')),
  status       text not null,                                 -- paid | refunded | pending | failed
  total_cents  integer not null,
  currency     text not null,
  receipt_url  text,
  created_at   timestamptz not null default now()
);
create index orders_user_idx on public.orders (user_id);

create table public.invoices (
  id               text primary key,                          -- Lemon Squeezy subscription-invoice or order id
  user_id          uuid not null references public.profiles (id) on delete cascade,
  description      text not null,
  total_cents      integer not null,
  currency         text not null,
  status           text not null,
  invoice_url      text,
  created_at       timestamptz not null
);
create index invoices_user_idx on public.invoices (user_id, created_at desc);

create table public.webhook_events (
  id           text primary key,                              -- sha256 of the raw body: replays are ignored
  event_name   text not null,
  payload      jsonb not null,
  received_at  timestamptz not null default now(),
  processed_at timestamptz,
  error        text
);

-- ── Codes ────────────────────────────────────────────────────────────────
create table public.folders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  name        text not null check (length(name) between 1 and 60),
  created_at  timestamptz not null default now(),
  unique (user_id, name)
);

create table public.codes (
  id              uuid primary key default gen_random_uuid(),
  -- set null, not cascade: a deleted account's codes keep redirecting (Terms §6, Privacy "retention")
  user_id         uuid references public.profiles (id) on delete set null,
  slug            text not null unique check (slug ~ '^[a-z0-9]{4,12}$'),
  name            text not null default '' check (length(name) <= 120),
  destination     text not null check (length(destination) <= 2048),
  ios_url         text check (length(ios_url) <= 2048),
  android_url     text check (length(android_url) <= 2048),
  folder_id       uuid references public.folders (id) on delete set null,
  design          jsonb not null default '{}'::jsonb,
  paused          boolean not null default false,
  pause_message   text check (length(pause_message) <= 160),
  pause_until     date,
  -- set by StayQR staff for phishing/abuse (Terms §4); the redirect shows a warning page instead
  disabled_at     timestamptz,
  disabled_reason text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index codes_user_idx on public.codes (user_id, created_at desc);

-- ── Scans (no IP addresses: city/country come from the edge's geo headers) ──
create table public.scans (
  id          bigint generated always as identity primary key,
  code_id     uuid not null references public.codes (id) on delete cascade,
  scanned_at  timestamptz not null default now(),
  country     text,
  city        text,
  device      text not null default 'other',                  -- mobile | tablet | desktop | other
  os          text not null default 'other',                  -- ios | android | windows | macos | linux | other
  browser     text
);
create index scans_code_time_idx on public.scans (code_id, scanned_at desc);
create index scans_time_idx on public.scans (scanned_at);

-- ── Entitlement: one place decides what a user may do ───────────────────
create or replace function public.plan_of(uid uuid)
returns table (tier text, plan text, status text, renews_at timestamptz, ends_at timestamptz, subscription_id text)
language sql stable as $$
  select * from (
    select 'lifetime'::text as tier, 'lifetime'::text as plan, 'active'::text as status,
           null::timestamptz as renews_at, null::timestamptz as ends_at, null::text as subscription_id
      from public.orders o where o.user_id = uid and o.plan = 'lifetime' and o.status = 'paid'
    union all
    select 'pro', s.plan, s.status, s.renews_at, s.ends_at, s.id
      from public.subscriptions s
     where s.user_id = uid
       and (s.status in ('on_trial', 'active', 'past_due')
            or (s.status = 'cancelled' and s.ends_at > now()))
  ) p
  order by case when p.tier = 'lifetime' then 0 else 1 end
  limit 1
$$;
