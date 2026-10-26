-- StayQR core schema: accounts, billing, dynamic codes and scans.
-- Runs on Supabase (auth.users exists) and on local Postgres (db/local/auth-stub.sql creates it).
-- The app connects as the database owner over DATABASE_URL and scopes every query by user id.
-- RLS is enabled with no policies, so the public API roles (anon, authenticated) can't read these tables.

create extension if not exists pgcrypto;

-- ── Accounts ─────────────────────────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  name        text,
  timezone    text not null default 'UTC',
  created_at  timestamptz not null default now()
);

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

-- ── Lock the tables away from Supabase's public API roles ───────────────
alter table public.profiles       enable row level security;
alter table public.subscriptions  enable row level security;
alter table public.orders         enable row level security;
alter table public.invoices       enable row level security;
alter table public.webhook_events enable row level security;
alter table public.folders        enable row level security;
alter table public.codes          enable row level security;
alter table public.scans          enable row level security;
