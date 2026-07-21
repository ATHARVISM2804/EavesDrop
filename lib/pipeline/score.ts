// Scoring step: find raw_mentions for a query that have no scored_leads row yet,
// prefilter the obvious noise, run the two-pass engine, and write the results.

import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TrackedQueryRow } from "@/lib/supabase/database.types";
import type { Candidate, ScoringContext, FeedbackWeight } from "@/lib/scoring/types";
import { prefilter } from "@/lib/scoring/prefilter";
import { scoreBatch } from "@/lib/scoring/score";
import { demoScoreBatch } from "@/lib/scoring/demo";
import { dispatchAlerts, type NotifySettings } from "@/lib/notify/dispatch";
import type { LeadAlert } from "@/lib/notify/types";

export interface ScoreResultSummary {
  queryId: string;
  candidates: number; // unscored mentions found
  prefiltered: number; // dropped by the cheap prefilter
  scored: number; // written to scored_leads
  failed: number; // scoring errors
  alertsSent: number; // instant alerts pinged
  skipped?: string; // set if scoring couldn't run at all
}

/** Bound per-run work so a synchronous trigger stays fast + cheap. */
const MAX_PER_RUN = 25;

export async function scoreForQuery(
  supabase: SupabaseClient,
  query: TrackedQueryRow,
): Promise<ScoreResultSummary> {
  const summary: ScoreResultSummary = {
    queryId: query.id,
    candidates: 0,
    prefiltered: 0,
    scored: 0,
    failed: 0,
    alertsSent: 0,
  };

  // Real two-pass AI scoring whenever a key exists; free heuristic demo scoring
  // when DEMO_MODE=true; otherwise skip (ingestion still ran).
  const useDemo = !process.env.ANTHROPIC_API_KEY;
  if (useDemo && process.env.DEMO_MODE !== "true") {
    summary.skipped =
      "No ANTHROPIC_API_KEY — scoring skipped. Set DEMO_MODE=true for free heuristic scoring.";
    return summary;
  }

  // Mentions for this query that don't yet have a score (left-join the 1:1 table).
  const { data, error } = await supabase
    .from("raw_mentions")
    .select("id, source, author, content, url, posted_at, raw_engagement, scored_leads(id)")
    .eq("tracked_query_id", query.id)
    .order("fetched_at", { ascending: false })
    .limit(200);

  if (error) throw new Error(`load raw_mentions failed: ${error.message}`);

  const unscored = (data ?? []).filter(
    (m: { scored_leads?: unknown[] }) => !m.scored_leads || m.scored_leads.length === 0,
  );
  summary.candidates = unscored.length;
  if (unscored.length === 0) return summary;

  const candidates: Candidate[] = unscored.slice(0, MAX_PER_RUN).map((m) => ({
    id: m.id as string,
    source: m.source,
    author: m.author,
    content: m.content as string,
    url: m.url,
    postedAt: m.posted_at,
    engagement: (m.raw_engagement ?? {}) as Record<string, number>,
  }));

  // Cheap, LLM-free prefilter first.
  const { kept, dropped } = prefilter(candidates);
  summary.prefiltered = dropped.length;
  if (kept.length === 0) return summary;

  const ctx = await buildContext(supabase, query);
  const results = useDemo ? demoScoreBatch(kept, ctx) : await scoreBatch(kept, ctx);

  const rows = results
    .filter((r) => r.result !== null)
    .map((r) => ({
      raw_mention_id: r.candidateId,
      intent_score: r.result!.intentScore,
      intent_category: r.result!.category,
      reasoning: r.result!.reasoning,
      suggested_reply_angle: r.result!.suggestedReplyAngle,
      scored_model: r.result!.model,
    }));
  summary.failed = results.filter((r) => r.result === null).length;

  if (rows.length > 0) {
    const { error: upErr } = await supabase
      .from("scored_leads")
      .upsert(rows, { onConflict: "raw_mention_id" });
    if (upErr) throw new Error(`scored_leads upsert failed: ${upErr.message}`);
    summary.scored = rows.length;

    // Instant alerts — ping high-intent new leads while the thread is still warm.
    const settings = await loadNotifySettings(supabase, query.user_id);
    if (settings.enabled) {
      const byId = new Map(kept.map((c) => [c.id, c]));
      const alerts: LeadAlert[] = results
        .filter((r) => r.result !== null && byId.has(r.candidateId))
        .map((r) => {
          const c = byId.get(r.candidateId)!;
          return {
            rawMentionId: r.candidateId,
            source: c.source,
            score: r.result!.intentScore,
            category: r.result!.category,
            content: c.content,
            url: c.url ?? null,
            replyAngle: r.result!.suggestedReplyAngle,
          };
        });

      const dispatch = await dispatchAlerts(settings, alerts);
      summary.alertsSent = dispatch.sent;
      if (dispatch.notifiedIds.length > 0) {
        await supabase
          .from("scored_leads")
          .update({ notified_at: new Date().toISOString() })
          .in("raw_mention_id", dispatch.notifiedIds);
      }
    }
  }

  return summary;
}

async function loadNotifySettings(
  supabase: SupabaseClient,
  userId: string,
): Promise<NotifySettings> {
  const { data } = await supabase
    .from("users")
    .select("notify_enabled, notify_slack_webhook, notify_min_score")
    .eq("id", userId)
    .single();
  return {
    enabled: Boolean(data?.notify_enabled),
    slackWebhook: (data?.notify_slack_webhook as string | null) ?? null,
    minScore: (data?.notify_min_score as number | null) ?? 80,
  };
}

/** Assemble the per-user scoring context, including learned feedback weights. */
async function buildContext(
  supabase: SupabaseClient,
  query: TrackedQueryRow,
): Promise<ScoringContext> {
  const { data: weights } = await supabase
    .from("user_feedback_weights")
    .select("keyword_or_pattern, weight_adjustment")
    .eq("user_id", query.user_id);

  const feedbackWeights: FeedbackWeight[] = (weights ?? []).map(
    (w: { keyword_or_pattern: string; weight_adjustment: number }) => ({
      pattern: w.keyword_or_pattern,
      weightAdjustment: w.weight_adjustment,
    }),
  );

  return {
    productDescription: query.product_description,
    keywords: query.keywords,
    competitors: query.competitors,
    feedbackWeights,
  };
}
