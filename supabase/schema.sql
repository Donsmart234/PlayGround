-- Aurum Wallet — shared users table (Google direct + Privy), Supabase Postgres.
-- Run in Supabase Dashboard → SQL Editor. Safe to run twice (idempotent).
-- Migrates the old Privy-only table (privy_did PK) to the shared model.

-- 0. Extensions
create extension if not exists "pgcrypto";

-- 1. If this is a fresh project, create the new-model table directly.
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  login_method text not null default 'privy' check (login_method in ('google', 'privy')),
  google_sub text unique,
  google_email text,
  email_verified boolean not null default false,
  display_name text,
  avatar_url text,
  privy_did text unique,
  embedded_wallet text,
  external_wallet text,
  verification_status text not null default 'unverified',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. If the table already exists in the OLD model (privy_did PK), migrate it.
do $$
begin
  if exists (
    select 1 from information_schema.table_constraints
    where table_schema = 'public' and table_name = 'users'
      and constraint_type = 'PRIMARY KEY'
      and constraint_name = 'users_pkey'
  ) and exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users' and column_name = 'privy_did'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users' and column_name = 'id'
  ) then
    alter table public.users add column id uuid default gen_random_uuid();
    alter table public.users add column login_method text not null default 'privy';
    alter table public.users add column google_sub text;
    alter table public.users add column email_verified boolean not null default false;
    alter table public.users add column avatar_url text;
    update public.users set id = gen_random_uuid() where id is null;
    alter table public.users drop constraint users_pkey;
    alter table public.users add primary key (id);
    alter table public.users add constraint users_privy_did_unique unique (privy_did);
    alter table public.users add constraint users_login_method_check
      check (login_method in ('google', 'privy'));
  end if;
end $$;

-- 3. Cover the case where id exists but google columns don't (partial migration).
alter table public.users add column if not exists login_method text not null default 'privy';
alter table public.users add column if not exists google_sub text;
alter table public.users add column if not exists email_verified boolean not null default false;
alter table public.users add column if not exists avatar_url text;
alter table public.users add column if not exists privy_did text;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'users_google_sub_unique') then
    alter table public.users add constraint users_google_sub_unique unique (google_sub);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'users_privy_did_unique') then
    alter table public.users add constraint users_privy_did_unique unique (privy_did);
  end if;
end $$;

create index if not exists users_google_email_idx on public.users (google_email);
create index if not exists users_external_wallet_idx on public.users (external_wallet);

-- 4. updated_at trigger
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
