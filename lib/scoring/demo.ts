// Free, LLM-free demo scorer. Produces plausible intent scores + categories +
// reply angles from real Reddit/HN posts using deterministic heuristics — so the
// whole pipeline works end-to-end at $0 for demos. Swap to the real two-pass
// engine (score.ts) simply by setting ANTHROPIC_API_KEY.

import type { Candidate, ScoringContext, ScoreResult, IntentCategory } from "./types";
import type { BatchScore } from "./score";

const SWITCHING =
  /\b(alternative to|switch(ing)? (from|away)|moving (away )?from|instead of|replace|migrat(e|ing) (from|off)|fed up with|frustrated with|ditch(ing)?)\b/;
const BUYING =
  /\b(looking for|recommend( a| any| me)?|any (recommendations|suggestions)|best (tool|app|software|platform|service) for|anyone (use|using|tried|know of)|need a (tool|way|solution)|what (do|are) (you|people) us(e|ing)|is there (a|any)|suggest( a| any)?)\b/;
const PRICING = /(\$\s?\d|\/mo\b|\/month\b|per month|pricing|too expensive|cheaper|priced?)/;
const COMPLAINT =
  /\b(hate|terrible|awful|broken|so slow|buggy|disappointed|worst|sucks|annoying|nightmare|clunky)\b/;
const QUESTION = /(\?|how do (i|you)|anyone else|has anyone)/;
const EVALUATION =
  /\b(vs\.?|versus|compare|comparison|reviews?|alternatives?|which (one|tool|is)|worth it|any good)\b/;

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

const REASON: Record<IntentCategory, string> = {
  buying_signal: "Actively asking for a tool/recommendation in this space.",
  switching_signal: "Signalling they want to move off their current option.",
  complaint: "Venting about a pain point a tool like this could solve.",
  curious: "Exploring the topic — not yet in-market, but warm.",
  noise: "Keyword match with no clear buying intent.",
};

const REPLY: Record<Exclude<IntentCategory, "noise">, string> = {
  buying_signal: "Answer their question helpfully first, then mention how you solve it.",
  switching_signal: "Lead with the specific gap they're frustrated by, not a pitch.",
  complaint: "Empathize with the pain, share how you'd approach it, no hard sell.",
  curious: "Add genuine insight to the thread; plant a soft mention if it fits.",
};

function scoreOne(c: Candidate, ctx: ScoringContext): ScoreResult {
  const text = c.content.toLowerCase();
  let score = 20;
  let category: IntentCategory = "noise";

  if (SWITCHING.test(text)) {
    score = 88;
    category = "switching_signal";
  } else if (BUYING.test(text)) {
    score = 82;
    category = "buying_signal";
  } else if (COMPLAINT.test(text)) {
    score = 62;
    category = "complaint";
  } else if (QUESTION.test(text)) {
    score = 50;
    category = "curious";
  } else if (EVALUATION.test(text)) {
    score = 52;
    category = "curious";
  }

  if (PRICING.test(text) && score >= 50) score += 6;

  // Mentioning a tracked competitor sharpens the signal.
  const hitsCompetitor = ctx.competitors.some(
    (comp) => comp.trim() && text.includes(comp.toLowerCase()),
  );
  if (hitsCompetitor && category !== "noise") {
    score += 6;
    if (category === "complaint") category = "switching_signal";
  }

  // Tiny deterministic spread so scores don't all tie.
  score += (c.content.length % 5) - 2;
  score = clamp(score);

  return {
    intentScore: score,
    category,
    reasoning: REASON[category],
    suggestedReplyAngle: category === "noise" ? null : REPLY[category],
    model: "demo",
  };
}

export function demoScoreBatch(
  candidates: Candidate[],
  ctx: ScoringContext,
): BatchScore[] {
  return candidates.map((c) => ({ candidateId: c.id, result: scoreOne(c, ctx) }));
}
