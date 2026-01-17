-- RLS hardening for Web E-Commerce (Techmart)
-- Apply AFTER supabase/schema.sql.
-- Goal: strong defaults. Deny direct DB access to anon/authenticated; all app reads/writes go through Next.js server routes using SUPABASE_SERVICE_ROLE_KEY.

-- 1) Enable RLS
alter table if exists public.users enable row level security;
alter table if exists public.products enable row level security;
alter table if exists public.orders enable row level security;
alter table if exists public.carts enable row level security;
alter table if exists public.notification_events enable row level security;

-- 2) Remove direct privileges for anon/authenticated (defense in depth)
revoke all on table public.users from anon, authenticated;
revoke all on table public.products from anon, authenticated;
revoke all on table public.orders from anon, authenticated;
revoke all on table public.carts from anon, authenticated;
revoke all on table public.notification_events from anon, authenticated;

-- If you want public read access to products (not recommended when you already have /api/products), you can opt-in:
-- grant select on table public.products to anon, authenticated;
-- create policy "Public can read products" on public.products for select using (true);

-- If you want the `match_products` RPC callable from anon (not recommended for locked-down mode), opt-in:
-- grant execute on function public.match_products(vector(768), float, int) to anon, authenticated;

-- 3) No policies are created by default for users/orders/carts.
-- With RLS enabled and no policies, PostgREST requests from anon/authenticated are denied.
-- Service role (SUPABASE_SERVICE_ROLE_KEY) bypasses RLS for server-side operations.
