-- Eavesdrop — subscription tracking (paywall gate).
-- Adds Stripe subscription fields to public.users. Idempotent (safe to re-run).

alter table public.users
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status    text;

-- Access is granted when subscription_status in ('active','trialing').
-- Written server-side by the Stripe webhook / return handler (service role).
comment on column public.users.subscription_status is
  'Stripe subscription status: active | trialing | past_due | canceled | null';
