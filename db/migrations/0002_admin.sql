-- Admin panel: account suspension and a trail of what staff did. Additive only; no existing rows change.

-- A suspended account can't sign in and its sessions are ended. Its codes keep redirecting (Terms §6);
-- a harmful code is switched off separately with codes.disabled_at.
alter table public.profiles
  add column if not exists suspended_at     timestamptz,
  add column if not exists suspended_reason text check (length(suspended_reason) <= 300);

-- Every admin action, newest first. No foreign key: the record outlives a deleted account.
create table if not exists public.admin_actions (
  id            bigserial primary key,
  admin_email   text not null,
  action        text not null,
  target_user   uuid,
  target_email  text,
  details       jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);
create index if not exists admin_actions_time_idx on public.admin_actions (created_at desc);
create index if not exists admin_actions_user_idx on public.admin_actions (target_user, created_at desc);
