-- Users table
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  email_verified boolean default false,
  phone text unique,
  phone_verified boolean default false,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ( 'admin', 'user')),
  is_active boolean default true,
  last_sign_in_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- OAuth providers table
create table if not exists public.oauth_providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  provider text not null check (provider in ('google', 'github', 'facebook', 'apple')),
  provider_user_id text not null,
  provider_email text,
  provider_data jsonb,
  access_token text,
  refresh_token text,
  token_expires_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(provider, provider_user_id)
);

-- User sessions table
create table if not exists public.user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  session_token text unique not null,
  ip_address inet,
  user_agent text,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

-- Indexes for better performance
create index if not exists idx_users_email on public.users(email);
create index if not exists idx_oauth_providers_user_id on public.oauth_providers(user_id);
create index if not exists idx_oauth_providers_provider on public.oauth_providers(provider, provider_user_id);
create index if not exists idx_user_sessions_token on public.user_sessions(session_token);
create index if not exists idx_user_sessions_user_id on public.user_sessions(user_id);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.oauth_providers enable row level security;
alter table public.user_sessions enable row level security;

-- RLS Policies for users table
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- RLS Policies for oauth_providers table
create policy "Users can view own oauth connections"
  on public.oauth_providers for select
  using (auth.uid() = user_id);

-- RLS Policies for user_sessions table
create policy "Users can view own sessions"
  on public.user_sessions for select
  using (auth.uid() = user_id);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply triggers
drop trigger if exists update_users_updated_at on public.users;
create trigger update_users_updated_at 
  before update on public.users
  for each row execute function update_updated_at_column();

drop trigger if exists update_oauth_providers_updated_at on public.oauth_providers;
create trigger update_oauth_providers_updated_at 
  before update on public.oauth_providers
  for each row execute function update_updated_at_column();

-- Allow service role to INSERT users
CREATE POLICY "Service role can insert users"
  ON public.users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow service role to SELECT users
CREATE POLICY "Service role can select users"
  ON public.users
  FOR SELECT
  TO service_role
  USING (true);

-- Allow service role to UPDATE users
CREATE POLICY "Service role can update users"
  ON public.users
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow service role to DELETE users
CREATE POLICY "Service role can delete users"
  ON public.users
  FOR DELETE
  TO service_role
  USING (true);