# Eavesdrop

> We listen where your buyers talk.

Multi-source buyer-intent lead generation with a self-improving AI scoring
engine. Eavesdrop finds the people across Reddit and Hacker News (X and review
sites planned) who are actively expressing buying intent for a product like
yours — scores each one 0–100, triages the noise, and pings you the moment a
high-intent lead lands. Every thumbs up/down sharpens the scoring for your
account.

---

## Status

The marketing site **and** the core product are built and typecheck/build
clean: Supabase auth, the ingest → score pipeline, the two-pass Claude scoring
engine, Slack alerts, Stripe subscription billing, and a gated dashboard.

**Not yet production-ready.** Known launch blockers before taking real money:

1. **Multi-tenant dedup bug** — `raw_mentions` is `unique (source, source_post_id)`
   *globally*, so a post can only belong to one customer's query. Needs to be
   scoped by `tracked_query_id` (migration `0004`).
2. **Paywall is UI-only** — enforced in the dashboard layout, but the mutating
   server actions (`refreshLeads`, `createQuery`) don't check subscription
   status. Add a subscription guard to each.
3. **No cost ceiling** — the cron pipeline runs all active queries with no
   global spend cap or per-plan query limits.

See the design-review notes in your issue tracker for the full roadmap.

---

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 3.4** — design tokens in `tailwind.config.ts`
- **Supabase** — Postgres + Auth + RLS (+ pgvector, reserved for future embeddings)
- **Claude API** (`@anthropic-ai/sdk`) — Haiku first-pass, Sonnet escalation
- **Stripe** — embedded subscription checkout + webhooks
- **Font:** Inter throughout, via `next/font`
- **Sources:** Reddit (OAuth), Hacker News (Algolia). X and review sites planned.

---

## Getting started

```bash
npm install
cp .env.example .env.local      # then fill in the values below
npm run dev                     # http://localhost:3001
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on port 3001 |
| `npm run build` | Production build (runs the typecheck) |
| `npm run start` | Serve the production build |
| `npm run lint` | Next.js ESLint |
| `npm test` | Node test runner over `lib/**/*.test.ts` |

> **Note:** don't run `npm run build` while `npm run dev` is running — they
> share `.next` and will corrupt each other's chunks (symptom:
> `Cannot find module './NNN.js'`). Fix is `rm -rf .next` and restart.

### Environment

Copy `.env.example` and fill it in. Full setup walkthroughs live in
[`docs/SETUP.md`](docs/SETUP.md) and [`docs/SETUP-STRIPE.md`](docs/SETUP-STRIPE.md).

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client Supabase (RLS-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** — ingestion/scoring jobs (bypasses RLS) |
| `ANTHROPIC_API_KEY` | Scoring engine. Absent + `DEMO_MODE=true` → free heuristic scorer |
| `ANTHROPIC_MODEL_FIRST_PASS`, `ANTHROPIC_MODEL_ESCALATION` | Haiku / Sonnet model IDs |
| `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, `REDDIT_USER_AGENT` | Reddit script-app creds |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRICE_ID` | Billing |
| `CRON_SECRET` | Bearer token guarding `POST /api/pipeline` |
| `DEMO_MODE` | `true` bypasses the paywall + uses the free scorer. **Never in production.** |
| `NEXT_PUBLIC_SITE_URL` | Absolute base URL (Stripe return, OG) |

---

## How it works

```
tracked_query
    │  buildSearchTerms(keywords, competitors)
    ▼
INGEST      Reddit (OAuth) + Hacker News → normalize → dedupe → raw_mentions
    │
    ▼
PREFILTER   drop bots, dupes, deleted, too-short   (LLM-free, tested)
    │
    ▼
SCORE       pass 1 · Haiku   → every candidate 0–100
            pass 2 · Sonnet  → re-scores only the borderline 40–70 band
    │
    ▼
scored_leads  (+ user_feedback_weights fed back into future prompts)
    │
    ▼
ALERT       Slack webhook for leads over the user's score threshold
```

The pipeline is triggered by `POST /api/pipeline` (guarded by `CRON_SECRET`),
scheduled every 5 minutes via `vercel.json`, or run per-user from the dashboard
Refresh button.

---

## Project structure

```
app/
  (dashboard)/        gated app — leads feed, queries, settings, billing
  api/                pipeline trigger, Stripe webhook/return
  auth/               Supabase auth actions + callback
  <marketing>/        home, pricing, features, blog, case-studies, /vs, etc.
components/
  home/               ProductShowcase (animated hero mock) + section blocks
  dashboard/          LeadCard, QueryForm, Paywall, RefreshButton, …
  marketing/          ProductPage, CompareTable, Marquee
  Nav · Hero · Footer · Logo   (bespoke, hand-themed)
lib/
  ingestion/          reddit, hackernews, ingest orchestrator
  scoring/            prefilter (+ test), two-pass score engine, prompts
  pipeline/           run (ingest → score) + score step
  notify/             Slack dispatch
  stripe/  supabase/  clients + typed helpers
supabase/migrations/  versioned SQL (schema, subscriptions, notifications)
tailwind.config.ts    design tokens
```

---

## Design system — "Altitude"

Swiss-editorial, near-monochrome. Hairline borders carry the structure;
elevation is reserved for the two things that genuinely float (the nav pill and
the hero product shot). One restrained vermillion accent, used only for
**signal** — scores, live states, the logo mark — never for primary buttons,
which are ink black.

| Role | Token | Hex |
|---|---|---|
| Ink (text / dark / primary buttons) | `ink` | `#0A0B0D` |
| Paper (background) | `paper` | `#FFFFFF` |
| Sunken (alternating sections) | `sunken` | `#F6F7F9` |
| Signal (accent — signal only) | `signal` | `#D14E2B` |
| Static (secondary text) | `static` | `#6B7280` |
| Success (low-noise / live) | `success` | `#3F8F6B` |
| Divider (hairline borders) | `divider` | `#E7E9EC` |

Reusable classes live in `app/globals.css`: `.btn-signal` / `.btn-ink` /
`.btn-ghost`, `.card`, `.eyebrow`, `.display-1/2/3`, `.section`, `.atmosphere`,
`.container-content`. Motion honours `prefers-reduced-motion` throughout.

---

## Testing

```bash
npm test
```

Covers the LLM-free prefilter (`lib/scoring/prefilter.test.ts`) — bot/spam
rejection, dedup, min-length, deleted-content handling.

---

## Notes

- Ingestion and scoring run server-side with the **service-role key**, which
  bypasses RLS by design. Never import those modules into client components —
  they are marked `server-only`.
- Legal pages (`/privacy`, `/terms`) are draft templates; replace before launch.
- Not affiliated with Reddit, X, or Hacker News.
