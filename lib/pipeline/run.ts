// The Phase 2 pipeline: ingest → score. Runs for all active tracked queries,
// a single query, or all of one user's queries. Uses the service-role client
// (server jobs bypass RLS).

import "server-only";
import { createServiceClient } from "@/lib/supabase/service";
import type { TrackedQueryRow } from "@/lib/supabase/database.types";
import { ingestForQuery, type IngestResult } from "@/lib/ingestion/ingest";
import { scoreForQuery, type ScoreResultSummary } from "./score";

export interface QueryRunReport {
  query: { id: string; product_description: string };
  ingest: IngestResult;
  score: ScoreResultSummary;
  error?: string;
}

export interface PipelineReport {
  queriesRun: number;
  totalInserted: number;
  totalScored: number;
  perQuery: QueryRunReport[];
}

export interface RunOptions {
  queryId?: string; // just this query
  userId?: string; // all active queries for one user
}

export async function runPipeline(opts: RunOptions = {}): Promise<PipelineReport> {
  const supabase = createServiceClient();

  let q = supabase
    .from("tracked_queries")
    .select("*")
    .eq("is_active", true);
  if (opts.queryId) q = q.eq("id", opts.queryId);
  if (opts.userId) q = q.eq("user_id", opts.userId);

  const { data: queries, error } = await q;
  if (error) throw new Error(`load tracked_queries failed: ${error.message}`);

  const report: PipelineReport = {
    queriesRun: 0,
    totalInserted: 0,
    totalScored: 0,
    perQuery: [],
  };

  for (const query of (queries ?? []) as TrackedQueryRow[]) {
    const entry: QueryRunReport = {
      query: { id: query.id, product_description: query.product_description },
      ingest: {
        queryId: query.id,
        terms: [],
        fetched: 0,
        inserted: 0,
        bySource: {},
        skipped: [],
      },
      score: {
        queryId: query.id,
        candidates: 0,
        prefiltered: 0,
        scored: 0,
        failed: 0,
        alertsSent: 0,
      },
    };

    try {
      entry.ingest = await ingestForQuery(supabase, query);
      entry.score = await scoreForQuery(supabase, query);
      report.totalInserted += entry.ingest.inserted;
      report.totalScored += entry.score.scored;
    } catch (err) {
      entry.error = err instanceof Error ? err.message : String(err);
    }

    report.perQuery.push(entry);
    report.queriesRun++;
  }

  return report;
}
