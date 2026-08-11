-- Drift schema: products mirrored in app catalog; auth users; orders; licenses
-- Project nickname: drift (super chill)

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  email text not null,
  product_slug text not null,
  interval text not null check (interval in ('monthly', 'lifetime')),
  amount_cents integer not null,
  currency text not null default 'usd',
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'refunded')),
  payment_provider text not null default 'mock',
  payment_ref text,
  created_at timestamptz not null default now()
);

create table if not exists public.licenses (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  email text not null,
  product_slug text not null,
  license_key text not null unique,
  interval text not null,
  status text not null default 'active'
    check (status in ('active', 'revoked', 'expired')),
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create index if not exists licenses_email_idx on public.licenses (email);
create index if not exists licenses_key_idx on public.licenses (license_key);
create index if not exists orders_email_idx on public.orders (email);

alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.licenses enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "orders_select_own"
  on public.orders for select
  using (auth.uid() = user_id or email = auth.jwt()->>'email');

create policy "licenses_select_own"
  on public.licenses for select
  using (auth.uid() = user_id or email = auth.jwt()->>'email');

-- service role inserts orders/licenses from API routes

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
