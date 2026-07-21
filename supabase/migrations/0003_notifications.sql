-- Eavesdrop — instant alerts (the "speed layer").
-- Per-user alert settings + a notified_at marker so we never double-ping.
-- Idempotent (safe to re-run).

alter table public.users
  add column if not exists notify_enabled       boolean  not null default false,
  add column if not exists notify_slack_webhook text,
  add column if not exists notify_min_score     smallint not null default 80;

alter table public.scored_leads
  add column if not exists notified_at timestamptz;

-- Fast lookup of un-notified high-intent leads.
create index if not exists scored_leads_unnotified_idx
  on public.scored_leads (intent_score desc)
  where notified_at is null;

comment on column public.users.notify_min_score is
  'Minimum intent score (0-100) that triggers an instant alert.';
