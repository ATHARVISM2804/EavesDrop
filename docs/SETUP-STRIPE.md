# Eavesdrop — Stripe paywall setup ($49/mo)

The paywall + embedded checkout is fully built. It activates the moment these
keys are in `.env.local`. Until then, the dashboard shows the paywall card with a
"payments not set up yet" placeholder (by design).

---

## 1. Apply the DB migration

Supabase → SQL Editor → run `supabase/migrations/0002_subscriptions.sql`
(adds `subscription_status` + `stripe_subscription_id` to `public.users`).
It's idempotent — safe to run once.

## 2. Create the product + price

Stripe Dashboard (**test mode** while developing) → **Products** → **Add product**:
- Name: `Eavesdrop`
- Price: **$49.00**, **Recurring**, **Monthly**
- Save → copy the **Price ID** (`price_…`) → `STRIPE_PRICE_ID`

## 3. Grab API keys

Stripe → **Developers → API keys**:
- **Publishable key** (`pk_test_…`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Secret key** (`sk_test_…`) → `STRIPE_SECRET_KEY`

## 4. Webhook secret

**Local dev** — install the Stripe CLI, then:
```
stripe listen --forward-to localhost:3001/api/stripe/webhook
```
It prints a `whsec_…` → `STRIPE_WEBHOOK_SECRET`. (Locally, the return handler
also unlocks access even without the webhook — the webhook is the durable path.)

**Production** — Stripe → Developers → Webhooks → add endpoint
`https://yourdomain.com/api/stripe/webhook`, subscribe to
`customer.subscription.*` and `checkout.session.completed`, copy the signing secret.

## 5. `.env.local`

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
Restart `npm run dev` after editing.

## 6. Test the flow

- Sign in → the paywall shows the embedded card.
- Pay with Stripe's test card **4242 4242 4242 4242**, any future expiry, any CVC.
- On success you're returned to the dashboard, now unlocked.

---

## Preview the dashboard WITHOUT paying (dev only)

After applying migration 0002, unlock your own account in the SQL Editor:
```sql
update public.users set subscription_status = 'active' where email = 'you@example.com';
```
Set it back to `null` to see the paywall again.

## Heads-up: marketing copy

The public site still says *"free tier · no credit card."* With a hard $49 paywall
that's contradictory — update the hero/pricing/CTA copy before launch (Claude can
do this in one pass).
