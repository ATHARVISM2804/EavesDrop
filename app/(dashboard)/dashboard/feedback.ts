"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { LeadFeedback } from "@/lib/scoring/types";

// Applied per thumbs up/down. Small so a few reactions nudge without one click
// dominating; accumulated weights are clamped to keep the prompt signal sane.
const NUDGE = 0.5;
const WEIGHT_CLAMP = 3;

function clamp(n: number, max: number) {
  return Math.max(-max, Math.min(max, n));
}

/**
 * Records a thumbs up/down on a scored lead and folds it into the user's
 * feedback weights (the personalization moat). Weights are keyed on a
 * human-readable pattern that lib/scoring/prompt.ts injects into future prompts.
 */
export async function submitFeedback(
  leadId: string,
  feedback: LeadFeedback,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  // Authoritatively load the lead (RLS ensures it's the user's own) and the
  // category/source we derive the weight pattern from.
  const { data: lead, error: loadError } = await supabase
    .from("scored_leads")
    .select("id, intent_category, raw_mention:raw_mentions(source)")
    .eq("id", leadId)
    .single();

  if (loadError || !lead) {
    return { ok: false, error: "Lead not found." };
  }

  const { error: updateError } = await supabase
    .from("scored_leads")
    .update({ user_feedback: feedback, feedback_at: new Date().toISOString() })
    .eq("id", leadId);

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  // raw_mention comes back as an object (to-one), but supabase-js types it as an
  // array in some versions — normalize.
  const mention = Array.isArray(lead.raw_mention)
    ? lead.raw_mention[0]
    : lead.raw_mention;
  const source = mention?.source ?? "unknown";
  const pattern = `${lead.intent_category} posts from ${source}`;
  const direction = feedback === "thumbs_up" ? NUDGE : -NUDGE;

  const { data: existing } = await supabase
    .from("user_feedback_weights")
    .select("id, weight_adjustment, sample_count")
    .eq("user_id", user.id)
    .eq("keyword_or_pattern", pattern)
    .maybeSingle();

  const nextWeight = clamp(
    (existing?.weight_adjustment ?? 0) + direction,
    WEIGHT_CLAMP,
  );

  const { error: weightError } = await supabase
    .from("user_feedback_weights")
    .upsert(
      {
        user_id: user.id,
        keyword_or_pattern: pattern,
        weight_adjustment: nextWeight,
        sample_count: (existing?.sample_count ?? 0) + 1,
      },
      { onConflict: "user_id,keyword_or_pattern" },
    );

  if (weightError) {
    // The feedback itself is saved; a weight write failure shouldn't block the UI.
    console.error("feedback weight upsert failed:", weightError.message);
  }

  revalidatePath("/dashboard");
  return { ok: true };
}
