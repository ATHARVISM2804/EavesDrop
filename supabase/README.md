# Supabase — Eavesdrop backend

Schema, auth, and Postgres for Phase 1b. This directory holds versioned SQL
migrations. Nothing here is wired into the app yet — it's the foundation.

## Migrations

| File | What it does |
|---|---|
| `migrations/0001_initial_schema.sql` | All five core tables, enums, indexes, RLS policies, and the auth-user → `public.users` provisioning trigger. |

The schema matches the product brief (Section 4), hardened for production:

- **`users`** — 1:1 with `auth.users`; auto-provisioned by a trigger on signup.
- **`tracked_queries`** — a user's monitored market (description, keywords,
  competitors, sources).
- **`raw_mentions`** — fetched posts, deduped by `unique (source, source_post_id)`.
  Kept separate from scoring so mentions can be re-scored as the model improves.
- **`scored_leads`** — one score row per mention (`intent_score`, category,
  reasoning, suggested reply, feedback).
- **`user_feedback_weights`** — the personalization moat; thumbs up/down here
  feeds future scoring prompts.

**RLS:** every table is user-scoped via `auth.uid()`. Ingestion and scoring
jobs run server-side with the **service-role key**, which bypasses RLS.

## Applying the schema

Once you've created a Supabase project, either:

**A. Supabase CLI (recommended)**
```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push          # applies migrations/
```

**B. SQL editor**
Paste `migrations/0001_initial_schema.sql` into the Supabase dashboard SQL
editor and run it.

## Next steps (not yet built)

1. `lib/supabase/{client,server}.ts` — browser + server clients (`@supabase/ssr`).
2. Wire `/sign-in` and `/sign-up` forms to Supabase Auth.
3. Generated TypeScript types: `npx supabase gen types typescript`.
4. Ingestion Edge Functions + the Haiku→Sonnet scoring pipeline.
