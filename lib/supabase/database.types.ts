// Hand-authored row types mirroring supabase/migrations/0001_initial_schema.sql.
// Replace with `supabase gen types typescript` output once the project exists.

import type {
  IntentCategory,
  LeadFeedback,
  Source,
} from "@/lib/scoring/types";

export type PlanKind = "free" | "starter" | "growth" | "pro";

export interface UserRow {
  id: string;
  email: string;
  plan: PlanKind;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null; // active | trialing | past_due | canceled | null
  notify_enabled: boolean;
  notify_slack_webhook: string | null;
  notify_min_score: number;
  created_at: string;
  updated_at: string;
}

export interface TrackedQueryRow {
  id: string;
  user_id: string;
  product_description: string;
  keywords: string[];
  competitors: string[];
  sources: Source[];
  is_active: boolean;
  last_fetched_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface RawMentionRow {
  id: string;
  tracked_query_id: string;
  source: Source;
  source_post_id: string;
  url: string | null;
  author: string | null;
  content: string;
  posted_at: string | null;
  fetched_at: string;
  raw_engagement: Record<string, number>;
}

export interface ScoredLeadRow {
  id: string;
  raw_mention_id: string;
  intent_score: number;
  intent_category: IntentCategory;
  reasoning: string | null;
  suggested_reply_angle: string | null;
  scored_model: string | null;
  user_feedback: LeadFeedback | null;
  feedback_at: string | null;
  notified_at: string | null;
  created_at: string;
}

export interface UserFeedbackWeightRow {
  id: string;
  user_id: string;
  keyword_or_pattern: string;
  weight_adjustment: number;
  sample_count: number;
  updated_at: string;
}

/** A scored lead joined to its source mention and owning query — the shape the
 * dashboard feed renders. Built from a nested Supabase select. */
export interface LeadWithMention extends ScoredLeadRow {
  raw_mention: Pick<
    RawMentionRow,
    | "id"
    | "source"
    | "url"
    | "author"
    | "content"
    | "posted_at"
    | "raw_engagement"
    | "tracked_query_id"
  >;
}
