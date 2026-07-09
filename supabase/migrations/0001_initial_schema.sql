-- Eavesdrop — initial schema (Phase 1b)
-- Mirrors the data model in the product brief (Section 4), hardened for prod:
-- uuid PKs, enums, FK cascades, dedup constraint, indexes, RLS, updated_at.

-- Extensions -----------------------------------------------------------------
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "vector";      -- pgvector, for future embeddings

-- Enums ----------------------------------------------------------------------
create type source_kind as enum ('reddit', 'x', 'hn', 'g2', 'capterra');

create type intent_category as enum (
  'buying_signal',
  'switching_signal',
  'complaint',
  'curious',
  'noise'
);

create type lead_feedback as enum ('thumbs_up', 'thumbs_down');

create type plan_kind as enum ('free', 'starter', 'growth', 'pro');

-- updated_at trigger helper --------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- users ----------------------------------------------------------------------
-- Mirrors auth.users (1:1). id references the Supabase auth user.
create table public.users (
  id                 uuid primary key references auth.users (id) on delete cascade,
  email              text not null,
  plan               plan_kind not null default 'free',
  stripe_customer_id text unique,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create trigger users_set_updated_at
  before update on public.users
  for each row execute function set_updated_at();

-- tracked_queries ------------------------------------------------------------
create table public.tracked_queries (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.users (id) on delete cascade,
  product_description text not null,
  keywords            text[] not null default '{}',
  competitors         text[] not null default '{}',
  sources             source_kind[] not null default '{reddit}',
  is_active           boolean not null default true,
  last_fetched_at     timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index tracked_queries_user_id_idx on public.tracked_queries (user_id);
create index tracked_queries_active_idx on public.tracked_queries (is_active) where is_active;

create trigger tracked_queries_set_updated_at
  before update on public.tracked_queries
  for each row execute function set_updated_at();

-- raw_mentions ---------------------------------------------------------------
-- Separated from scored_leads so mentions can be re-scored as the model
-- improves, without re-fetching from source APIs. Unique on (source, post id)
-- for cross-query dedup.
create table public.raw_mentions (
  id               uuid primary key default gen_random_uuid(),
  tracked_query_id uuid not null references public.tracked_queries (id) on delete cascade,
  source           source_kind not null,
  source_post_id   text not null,
  url              text,
  author           text,
  content          text not null,
  posted_at        timestamptz,
  fetched_at       timestamptz not null default now(),
  raw_engagement   jsonb not null default '{}',  -- {upvotes, likes, comments, ...}
  constraint raw_mentions_source_post_uniq unique (source, source_post_id)
);

create index raw_mentions_query_idx on public.raw_mentions (tracked_query_id);
create index raw_mentions_fetched_idx on public.raw_mentions (fetched_at desc);

-- scored_leads ---------------------------------------------------------------
create table public.scored_leads (
  id                   uuid primary key default gen_random_uuid(),
  raw_mention_id       uuid not null references public.raw_mentions (id) on delete cascade,
  intent_score         smallint not null check (intent_score between 0 and 100),
  intent_category      intent_category not null,
  reasoning            text,
  suggested_reply_angle text,
  scored_model         text,          -- 'haiku' | 'sonnet' — which pass produced this
  user_feedback        lead_feedback, -- null until the user reacts
  feedback_at          timestamptz,
  created_at           timestamptz not null default now(),
  -- one score row per mention (re-scoring replaces via upsert)
  constraint scored_leads_mention_uniq unique (raw_mention_id)
);

create index scored_leads_score_idx on public.scored_leads (intent_score desc);
create index scored_leads_category_idx on public.scored_leads (intent_category);
create index scored_leads_feedback_idx on public.scored_leads (user_feedback)
  where user_feedback is not null;

-- user_feedback_weights ------------------------------------------------------
-- The personalization moat: every thumbs up/down updates a weight that is
-- injected into future scoring prompts for that user.
create table public.user_feedback_weights (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.users (id) on delete cascade,
  keyword_or_pattern text not null,
  weight_adjustment  real not null default 0,  -- signed; + rewards, - penalizes
  sample_count       integer not null default 1,
  updated_at         timestamptz not null default now(),
  constraint user_feedback_weights_uniq unique (user_id, keyword_or_pattern)
);

create index user_feedback_weights_user_idx on public.user_feedback_weights (user_id);

create trigger user_feedback_weights_set_updated_at
  before update on public.user_feedback_weights
  for each row execute function set_updated_at();

-- Row Level Security ---------------------------------------------------------
-- Each user only ever sees their own rows. Ingestion/scoring runs server-side
-- with the service-role key, which bypasses RLS.
alter table public.users                enable row level security;
alter table public.tracked_queries      enable row level security;
alter table public.raw_mentions         enable row level security;
alter table public.scored_leads         enable row level security;
alter table public.user_feedback_weights enable row level security;

create policy "users read own row"
  on public.users for select using (auth.uid() = id);
create policy "users update own row"
  on public.users for update using (auth.uid() = id);

create policy "own tracked_queries"
  on public.tracked_queries for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- raw_mentions & scored_leads are reached through a tracked_query the user owns
create policy "own raw_mentions"
  on public.raw_mentions for select
  using (exists (
    select 1 from public.tracked_queries q
    where q.id = raw_mentions.tracked_query_id and q.user_id = auth.uid()
  ));

create policy "own scored_leads"
  on public.scored_leads for select
  using (exists (
    select 1
    from public.raw_mentions m
    join public.tracked_queries q on q.id = m.tracked_query_id
    where m.id = scored_leads.raw_mention_id and q.user_id = auth.uid()
  ));

-- users update feedback on their own leads
create policy "update own scored_leads feedback"
  on public.scored_leads for update
  using (exists (
    select 1
    from public.raw_mentions m
    join public.tracked_queries q on q.id = m.tracked_query_id
    where m.id = scored_leads.raw_mention_id and q.user_id = auth.uid()
  ));

create policy "own feedback_weights"
  on public.user_feedback_weights for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-provision a public.users row when an auth user is created ---------------
create or replace function handle_new_auth_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_auth_user();
