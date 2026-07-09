# Eavesdrop

> We listen where your buyers talk.

Multi-source buyer-intent lead generation with a self-improving AI scoring
engine. Finds people across Reddit, X, and Hacker News who are actively
expressing buying intent for a product like yours — and gets smarter the more
you use it.

## Status

**Phase 1a — Marketing website.** This repo currently contains the public
marketing site (Next.js App Router + Tailwind). The product dashboard, auth,
ingestion pipeline, and Claude scoring engine (Phase 1b) are not built yet.

## Stack

- **Next.js 15** (App Router) + **React 19**
- **Tailwind CSS 3.4** — design tokens in `tailwind.config.ts`
- **Fonts:** Fraunces (serif display) + Inter (body), via `next/font`

Planned for Phase 1b: Supabase (Postgres + Auth + pgvector), Claude API
(Haiku first-pass, Sonnet escalation), Stripe.

## Design system — "Signal on Static"

| Role | Token | Hex |
|---|---|---|
| Ink (text / dark sections) | `ink` | `#0E0E10` |
| Paper (background) | `paper` | `#FAF8F4` |
| Signal (accent) | `signal` | `#D97B3F` |
| Static (secondary) | `static` | `#5B6B7A` |
| Alert (high-intent) | `alert` | `#E8542E` |
| Success (low-noise) | `success` | `#7A9B76` |
| Border / divider | `divider` | `#E4DFD6` |

Reusable component classes live in `app/globals.css` (`.btn-signal`,
`.btn-ink`, `.btn-ghost`, `.card`, `.eyebrow`, `.container-content`).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000 (falls back to 3001 if busy)
npm run build    # production build + typecheck
```

## Routes

| Path | Page |
|---|---|
| `/` | Home — hero, features, how-it-works, moat, CTA |
| `/pricing` | Four-tier pricing |
| `/sign-up`, `/sign-in` | Auth shells (UI only — no backend yet) |
| `/blog`, `/case-studies` | Placeholder content pages |
| `/contact` | Contact form (UI only) |
| `/privacy`, `/terms` | Draft legal templates |

## Project structure

```
app/            route segments (App Router)
components/     Nav, Footer, Logo, Hero, LeadFeedMock, FeatureGrid,
                HowItWorks, Positioning, CTA, PageHeader
tailwind.config.ts   design tokens
```

## Notes

- Auth and all forms are UI-only placeholders; they post to routes that will
  be implemented in Phase 1b.
- Legal pages are drafts and must be replaced with reviewed copy before launch.
