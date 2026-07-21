"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { runPipeline } from "@/lib/pipeline/run";

export type RefreshResult =
  | { ok: true; inserted: number; scored: number; note?: string }
  | { ok: false; error: string };

/** Run the ingest → score pipeline for the signed-in user's active queries. */
export async function refreshLeads(): Promise<RefreshResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  try {
    const report = await runPipeline({ userId: user.id });

    // Surface a helpful note if scoring was skipped for lack of a key.
    const skipped = report.perQuery
      .map((q) => q.score.skipped)
      .find((s): s is string => Boolean(s));

    revalidatePath("/dashboard");
    return {
      ok: true,
      inserted: report.totalInserted,
      scored: report.totalScored,
      note: skipped,
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
