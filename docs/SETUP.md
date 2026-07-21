# Eavesdrop — Setup Checklist (Phases 1–2)

Everything you need to take the app from "placeholder backend" to "real, running product."
No code changes required from you — just create accounts, grab keys, and paste them into
`.env.local`. When you're done, tell Claude and it will wire + verify everything.

---

## 🏗️ How the complete system works (end-to-end)

```
 YOU set up a query
 "I sell X · keywords: [...] · competitors: [...] · sources: Reddit, HN"
              │
              ▼
 ┌─ SCHEDULED JOB (every ~30 min, Phase 3) ─────────────────┐
 │                                                          │
 │  1. INGEST   → search Reddit + HN for your keywords      │
 │               → normalize + dedupe → write raw_mentions  │
 │                                                          │
 │  2. PREFILTER (free, no AI) → drop 40–60% obvious noise  │
 │     (off-topic, ancient threads, keyword coincidences)   │
 │                                                          │
 │  3. SCORE (two-pass AI)                                  │
 │     → Haiku scores 0–100 on everything (cheap)           │
 │     → borderline (40–70) escalate to Sonnet (careful)    │
 │     → write scored_leads: score, category, reply angle   │
 └──────────────────────────────────────────────────────────┘
              │
              ▼
 DASHBOARD → ranked feed of real buyers (highest intent first)
              │
              ▼
 YOU react 👍/👎  →  updates your personalization weights
              │
              └──► injected into every future scoring call
                   (week 4 sharper than week 1 = the moat)
```

**Already built:** the DB schema, the two-pass scoring engine (`lib/scoring/`), the dashboard,
and the feedback loop. **The missing link is Step 1 (ingestion) + wiring Step 3 to run** —
that's Phase 2, which Claude builds once your keys are in.

---

## 💸 Cost summary (MVP)

| Service | Needed for | Cost to start |
|---|---|---|
| **Supabase** | Database + auth | **Free** tier is plenty (500 MB DB, 50k monthly users) |
| **Anthropic (Claude)** | Scoring engine | **Pay-as-you-go** — add ~**$5–20** credit to start |
| **Reddit API** | Lead source | **Free** (low-volume / non-commercial) |
| **Hacker News** | Lead source | **Free**, no key needed |
| **Vercel** | Deploy (optional now) | **Free** hobby tier |
| **X / Twitter API** | Extra source | **~$200/mo** — ⚠️ **SKIP for MVP** |
| **Stripe** | Billing (Phase 5) | Free to set up — **not needed yet** |

**Total to run the MVP: ~$5–20** (just Anthropic credit).

---

## ✅ Order of operations

1. Supabase project → keys + apply migration + auth config
2. Anthropic key
3. Reddit app credentials
4. Paste everything into `.env.local`
5. Tell Claude → it wires Phase 2 (ingestion + scoring) and verifies

---

## 1. Supabase (database + auth)

1. Go to **https://supabase.com** → sign in → **New project**.
   - Name: `eavesdrop`, pick a region near you, set a strong DB password (save it).
2. Once created, go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`  ⚠️ **server-only, never share/commit**
3. **Apply the database schema:**
   - Open **SQL Editor → New query**
   - Paste the entire contents of `supabase/migrations/0001_initial_schema.sql`
   - Click **Run**. This creates all 5 tables (users, tracked_queries, raw_mentions,
     scored_leads, user_feedback_weights), enums, indexes, RLS policies, and the trigger
     that auto-creates a `public.users` row on signup.
4. **Configure auth redirect URLs** (so email confirmation + sign-in work):
   - Go to **Authentication → URL Configuration**
   - **Site URL:** `http://localhost:3001` (your dev port; update to your domain in prod)
   - **Redirect URLs:** add `http://localhost:3001/auth/callback`
     (and later `https://yourdomain.com/auth/callback`)
   - Under **Authentication → Providers → Email**: keep **Email** enabled. For faster local
     testing you may temporarily turn **off** "Confirm email" (turn it back on for launch).

**Gotchas:**
- The `service_role` key bypasses row-level security — it's only used by the server-side
  ingestion/scoring jobs. Never put it in any `NEXT_PUBLIC_*` var.
- `NEXT_PUBLIC_SUPABASE_URL` + anon key are safe in the browser (RLS protects data).

---

## 2. Anthropic / Claude (scoring engine)

1. Go to **https://console.anthropic.com** → sign in.
2. **Billing → add credit** (~$5–20 is plenty to start).
3. **API Keys → Create Key** → copy it → `ANTHROPIC_API_KEY`.
4. Leave the model vars as-is (already set in `.env.example`):
   - `ANTHROPIC_MODEL_FIRST_PASS=claude-haiku-4-5-20251001` (cheap first pass)
   - `ANTHROPIC_MODEL_ESCALATION=claude-sonnet-5` (only for borderline 40–70 scores)

**Gotchas / cost control:**
- The two-pass design + prefilter (drops 40–60% of noise **before** any AI call) keeps costs
  low — most mentions only ever hit cheap Haiku. Rough ballpark: fractions of a cent per
  scored mention. Watch the first few runs in the Anthropic console to confirm.
- Set a **monthly spend limit** in the Anthropic console for peace of mind.

---

## 3. Reddit API (lead source)

1. Log in to Reddit → go to **https://www.reddit.com/prefs/apps**.
2. Click **"Create another app…"** at the bottom.
   - **Type:** choose **script**
   - **name:** `eavesdrop`
   - **redirect uri:** `http://localhost:3001` (required field; not used for script apps)
3. After creating, copy:
   - The string **under the app name** (the client ID) → `REDDIT_CLIENT_ID`
   - The **secret** → `REDDIT_CLIENT_SECRET`
4. Set `REDDIT_USER_AGENT` to something descriptive and unique, e.g.
   `eavesdrop/0.1 by u/your_reddit_username`

**Gotchas:**
- Reddit **blocks generic/duplicate user agents** — make it specific (include your username).
- Rate limit is ~**100 requests/min** with OAuth; fine for MVP polling.
- Reddit's API is free for **low-volume, non-commercial** use. Higher volume / commercial use
  may require agreeing to their API terms — worth reviewing before you scale.

### Will my Reddit API get blocked?

**Short answer: no — not if it's done right.** Reddit blocks bad actors, not polite readers.
Because Eavesdrop only *reads* public search results at a modest cadence, it sits inside
Reddit's **free tier** (intended for exactly this kind of low-volume use). Here's every common
cause of a block and how the ingestion layer avoids it:

| Cause of blocks | How we prevent it |
|---|---|
| **Generic/duplicate User-Agent** (the #1 cause) | Unique UA: `eavesdrop/0.1 by u/you` (set in `REDDIT_USER_AGENT`) |
| **No OAuth / unauthenticated scraping** | Proper OAuth `client_credentials` flow (that's what the app creds are for) |
| **Exceeding rate limits** (~100 req/min) | Read Reddit's `X-Ratelimit-Remaining` headers, throttle, exponential backoff on 429 |
| **Hammering constantly** | Poll every ~30 min + **incremental fetch** (only since last poll) = very few calls |
| **Automating posts / spam** | We only *read* public search. You reply **as yourself, manually** — never automated |

**When it becomes a real concern (later, not MVP):**
- **High commercial volume** — Reddit charges for heavy use (~$0.24 per 1,000 calls on the
  enterprise tier). At scale you'd register for their commercial terms.
- **Policy changes** — Reddit shifted its API terms in 2023 and could again. **This is exactly
  why Eavesdrop is multi-source:** if Reddit ever tightens, HN keeps working and you're not dead
  in the water. That resilience *is* the moat.

**Bottom line for the MVP/beta:** with proper OAuth + a good User-Agent + rate-limit handling
(all built into the ingestion layer), you will **not** get blocked. HN (Algolia) carries no such
risk at all.

---

## 4. Hacker News (lead source)

Nothing to do — HN search uses the **Algolia HN API**, which is **free and keyless**.

---

## 5. ⚠️ Skip for the MVP

- **X / Twitter API** — the usable tier is ~$200/mo with tight limits. Launch on
  **Reddit + Hacker News** (both strong signal), and add X later only if the ROI is clear.
  Leave `X_BEARER_TOKEN` blank for now.
- **Stripe** — billing is Phase 5. Leave `STRIPE_*` vars blank until then.

---

## 6. Final `.env.local`

Copy `.env.example` → `.env.local` and fill in the values you gathered:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...            # server only

# Claude
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL_FIRST_PASS=claude-haiku-4-5-20251001
ANTHROPIC_MODEL_ESCALATION=claude-sonnet-5

# Reddit
REDDIT_CLIENT_ID=...
REDDIT_CLIENT_SECRET=...
REDDIT_USER_AGENT=eavesdrop/0.1 by u/your_username

# X / Stripe — leave blank for MVP

# App (note: dev server runs on 3001 on this machine)
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

`.env.local` is gitignored — safe for secrets.

---

## 7. Verify (Claude will do this, but here's the checklist)

- [ ] `npm run dev` starts clean on port 3001
- [ ] Sign up a test account → row appears in Supabase `auth.users` **and** `public.users`
- [ ] Sign in → `/dashboard` loads (no redirect loop)
- [ ] Unauthed visit to `/dashboard` → redirects to `/sign-in`
- [ ] Create a tracked query in the dashboard → row appears in `tracked_queries`

---

## Phase 2 preview (what Claude builds once the above is set)

No new accounts needed beyond Reddit + Anthropic. Claude will build:

1. **Source fetchers** — Reddit search + HN Algolia → normalize → write `raw_mentions` (deduped)
2. **Scoring job** — read new mentions → `prefilter` → two-pass `score.ts` → write `scored_leads`
3. **Manual trigger** first (a protected route/script) to confirm real leads appear in the
   dashboard, then Phase 3 puts it on a schedule (Vercel Cron — free).

Once Phase 2 runs, Eavesdrop does what the marketing site promises. 🦊

---

## 🔔 Alerts & scheduling (the speed layer)

Threads go cold in ~an hour, so speed is the core value. This layer is built —
here's how to turn it on.

**1. Apply the alerts migration**
Supabase → SQL Editor → run `supabase/migrations/0003_notifications.sql`
(adds per-user alert settings + a `notified_at` marker so leads never double-ping).

**2. Turn on Slack alerts (in-app)**
Sign in → **Dashboard → Alerts**:
- Create a **Slack Incoming Webhook** (Slack → Apps → *Incoming Webhooks* → add to a
  channel → copy the `https://hooks.slack.com/services/…` URL)
- Paste it, set the **threshold** (min intent score, default 80), enable, **Save**
- Hit **Send test alert** to confirm it lands in Slack

Now, every pipeline run pings you the moment a **new** lead clears your threshold —
with the thread link + suggested reply angle.

**3. Automated polling (so it runs itself)**
- **Deployed on Vercel:** `vercel.json` already schedules `/api/pipeline` every 5 min.
  Vercel auto-sends `Authorization: Bearer $CRON_SECRET` (so set `CRON_SECRET` in
  Vercel too). ⚠️ Sub-daily crons need **Vercel Pro**; Hobby is daily-only.
- **Any plan / before deploy:** point an external scheduler (e.g. cron-job.org,
  GitHub Actions, Upstash QStash) at `POST https://yourdomain/api/pipeline` every
  few minutes with header `Authorization: Bearer <CRON_SECRET>`.
- **Locally:** just hit the **↻ Refresh** button, or curl the route with the secret.

**Honest expectation:** no source API pushes in real time — realistic latency is
**a few minutes** from post → Slack ping, not "the instant." Frame it as *"within
minutes,"* never *"instant."*
