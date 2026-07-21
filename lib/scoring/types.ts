// Shared types for the buyer-intent scoring engine.

export type Source = "reddit" | "x" | "hn" | "g2" | "capterra";

export type IntentCategory =
  | "buying_signal"
  | "switching_signal"
  | "complaint"
  | "curious"
  | "noise";

export type LeadFeedback = "thumbs_up" | "thumbs_down";

/** A raw mention pulled from a source, before scoring. */
export interface Candidate {
  id: string;
  source: Source;
  author?: string | null;
  content: string;
  url?: string | null;
  postedAt?: string | null;
  /** upvotes/likes/comments etc. — shape varies by source. */
  engagement?: Record<string, number>;
}

/** The tracked query the candidate is being scored against. */
export interface ScoringContext {
  productDescription: string;
  keywords: string[];
  competitors: string[];
  /**
   * Learned per-user patterns injected as few-shot hints. Positive weight =
   * the user tends to like posts like this; negative = tends to reject.
   */
  feedbackWeights?: FeedbackWeight[];
}

export interface FeedbackWeight {
  pattern: string;
  weightAdjustment: number; // signed
}

/** The model's judgment for a single candidate. */
export interface ScoreResult {
  intentScore: number; // 0–100
  category: IntentCategory;
  reasoning: string;
  suggestedReplyAngle: string | null;
  /** which pass produced this score. */
  model: "haiku" | "sonnet" | "demo";
}

export interface ScoredCandidate extends ScoreResult {
  candidateId: string;
}

/** Reason a candidate was dropped before ever reaching the LLM. */
export type PrefilterReason =
  | "too_short"
  | "deleted"
  | "bot_or_spam"
  | "duplicate";

export interface PrefilterResult {
  kept: Candidate[];
  dropped: { candidate: Candidate; reason: PrefilterReason }[];
}
