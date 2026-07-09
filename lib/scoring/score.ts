// Two-pass scoring engine — the core moat.
// Pass 1: Haiku scores every pre-filtered candidate cheaply.
// Pass 2: Sonnet re-scores only borderline results (default 40–70) where
// higher-quality judgment matters most.
//
// Server-only: reads ANTHROPIC_API_KEY. Do not import from client components.

import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { Candidate, ScoringContext, ScoreResult } from "./types";
import { SCORING_SYSTEM_PROMPT, SCORING_SCHEMA, buildUserPrompt } from "./prompt";

const HAIKU = process.env.ANTHROPIC_MODEL_FIRST_PASS ?? "claude-haiku-4-5";
const SONNET = process.env.ANTHROPIC_MODEL_ESCALATION ?? "claude-sonnet-5";

/** Scores in this range are re-scored by Sonnet. */
const BORDERLINE_LOW = 40;
const BORDERLINE_HIGH = 70;

/** Cap concurrent API calls so a large batch doesn't blow past rate limits. */
const CONCURRENCY = 5;

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

function clampScore(n: unknown): number {
  const v = typeof n === "number" ? Math.round(n) : 0;
  return Math.max(0, Math.min(100, v));
}

/** One scoring call against a specific model. */
async function scoreWith(
  candidate: Candidate,
  ctx: ScoringContext,
  model: string,
  tag: "haiku" | "sonnet",
): Promise<ScoreResult> {
  const response = await getClient().messages.create({
    model,
    max_tokens: 512,
    system: [
      { type: "text", text: SCORING_SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
    ],
    output_config: { format: { type: "json_schema", schema: SCORING_SCHEMA } },
    messages: [{ role: "user", content: buildUserPrompt(candidate, ctx) }],
  });

  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") {
    throw new Error(`No text block returned from ${model} (stop: ${response.stop_reason})`);
  }

  const parsed = JSON.parse(text.text) as {
    intent_score: number;
    category: ScoreResult["category"];
    reasoning: string;
    suggested_reply_angle: string | null;
  };

  return {
    intentScore: clampScore(parsed.intent_score),
    category: parsed.category,
    reasoning: parsed.reasoning,
    suggestedReplyAngle: parsed.suggested_reply_angle,
    model: tag,
  };
}

/** Score a single candidate, escalating to Sonnet only when borderline. */
export async function scoreCandidate(
  candidate: Candidate,
  ctx: ScoringContext,
): Promise<ScoreResult> {
  const first = await scoreWith(candidate, ctx, HAIKU, "haiku");

  if (first.intentScore >= BORDERLINE_LOW && first.intentScore <= BORDERLINE_HIGH) {
    return scoreWith(candidate, ctx, SONNET, "sonnet");
  }
  return first;
}

export interface BatchScore {
  candidateId: string;
  result: ScoreResult | null;
  error?: string;
}

/** Score many candidates with bounded concurrency. Never re-score outside this
 * — callers should skip candidates that already have a stored score. */
export async function scoreBatch(
  candidates: Candidate[],
  ctx: ScoringContext,
): Promise<BatchScore[]> {
  const out: BatchScore[] = new Array(candidates.length);
  let next = 0;

  async function worker() {
    while (next < candidates.length) {
      const i = next++;
      const candidate = candidates[i];
      try {
        out[i] = { candidateId: candidate.id, result: await scoreCandidate(candidate, ctx) };
      } catch (err) {
        out[i] = {
          candidateId: candidate.id,
          result: null,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, candidates.length) }, worker),
  );
  return out;
}
