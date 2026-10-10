-- Aurum Wallet — Google login backend schema (Supabase Postgres, free tier).
-- Run this once in Supabase Dashboard → SQL Editor → New query → Paste → Run.

create table if not exists public.users (
  privy_did text primary key,
  google_email text,
  display_name text,
  embedded_wallet text,
  external_wallet text,
  verification_status text not null default 'unverified',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh on every write.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_touch_updated_at on public.users;
create trigger users_touch_updated_at
  before update on public.users
  for each row execute function public.touch_updated_at();

-- MVP: backend uses the service-role key (bypasses RLS), so no policies needed.
-- If you later read this table with the anon key, add:
--   alter table public.users enable row level security;
-- plus a per-user policy on privy_did.
