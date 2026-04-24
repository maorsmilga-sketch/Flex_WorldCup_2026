-- Flex World Cup 2026 — initial schema
-- Run in Supabase SQL Editor or via CLI

create extension if not exists "uuid-ossp";

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text not null,
  department text not null default '',
  site text not null check (site in ('migdal', 'ofakim', 'modiin')),
  total_score integer not null default 0,
  tiebreak_registered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_site_idx on public.profiles (site);
create index if not exists profiles_department_idx on public.profiles (department);
create index if not exists profiles_total_score_idx on public.profiles (total_score desc);

-- Phase 1 predictions (group stage + bonuses)
create table if not exists public.phase1_predictions (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  match_picks jsonb not null default '{}'::jsonb,
  top_scorer text,
  highest_scoring_team_id text,
  least_conceding_team_id text,
  tournament_winner_team_id text,
  underdog_match_keys text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- Phase 2 (knockout + final + stats)
create table if not exists public.phase2_predictions (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  bracket jsonb not null default '{"r16":[],"qf":[],"sf":[],"final":null}'::jsonb,
  final_home_goals integer,
  final_away_goals integer,
  stats_top_scorer text,
  stats_highest_scoring_team_id text,
  updated_at timestamptz not null default now()
);

-- Colleague follows (star / friends)
create table if not exists public.user_follows (
  follower_id uuid not null references public.profiles (id) on delete cascade,
  following_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

create index if not exists user_follows_follower_idx on public.user_follows (follower_id);

-- Fixtures (sync from API-Football or manual seed)
create table if not exists public.fixtures (
  id uuid primary key default gen_random_uuid(),
  match_key text unique not null,
  phase text not null default 'group',
  home_name text not null,
  away_name text not null,
  kickoff_at timestamptz,
  status text not null default 'NS',
  home_goals integer,
  away_goals integer,
  api_fixture_id integer,
  home_odds numeric,
  draw_odds numeric,
  away_odds numeric,
  underdog_side text check (underdog_side in ('home', 'away', 'none')),
  updated_at timestamptz not null default now()
);

create index if not exists fixtures_phase_idx on public.fixtures (phase);

-- Scoring job log (optional)
create table if not exists public.scoring_runs (
  id uuid primary key default gen_random_uuid(),
  ran_at timestamptz not null default now(),
  note text
);

-- Auto profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, department, site)
  values (
    new.id,
    new.email,
    coalesce(nullif(trim(new.raw_user_meta_data->>'full_name'), ''), 'משתמש'),
    coalesce(nullif(trim(new.raw_user_meta_data->>'department'), ''), ''),
    coalesce(nullif(trim(new.raw_user_meta_data->>'site'), ''), 'migdal')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.phase1_predictions enable row level security;
alter table public.phase2_predictions enable row level security;
alter table public.user_follows enable row level security;
alter table public.fixtures enable row level security;

-- Profiles policies
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Phase1: own row
create policy "phase1_select_own"
  on public.phase1_predictions for select
  to authenticated
  using (auth.uid() = user_id);

create policy "phase1_upsert_own"
  on public.phase1_predictions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "phase1_update_own"
  on public.phase1_predictions for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Phase2: own row
create policy "phase2_select_own"
  on public.phase2_predictions for select
  to authenticated
  using (auth.uid() = user_id);

create policy "phase2_upsert_own"
  on public.phase2_predictions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "phase2_update_own"
  on public.phase2_predictions for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Follows
create policy "follows_select_own"
  on public.user_follows for select
  to authenticated
  using (auth.uid() = follower_id);

create policy "follows_insert_own"
  on public.user_follows for insert
  to authenticated
  with check (auth.uid() = follower_id);

create policy "follows_delete_own"
  on public.user_follows for delete
  to authenticated
  using (auth.uid() = follower_id);

-- Fixtures: readable by all authenticated
create policy "fixtures_select_authenticated"
  on public.fixtures for select
  to authenticated
  using (true);

-- Service role can manage fixtures (use service key server-side; no RLS bypass needed if inserts done from dashboard with service role)

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.phase1_predictions to authenticated;
grant select, insert, update, delete on public.phase2_predictions to authenticated;
grant select, insert, update, delete on public.user_follows to authenticated;
grant select on public.fixtures to authenticated;
