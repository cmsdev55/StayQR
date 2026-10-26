-- Local Postgres only: the slice of Supabase's auth schema that StayQR's migrations reference.
-- Never run this against Supabase (auth.users is managed there).
create schema if not exists auth;
create table if not exists auth.users (
  id         uuid primary key default gen_random_uuid(),
  email      text unique,
  created_at timestamptz not null default now()
);
