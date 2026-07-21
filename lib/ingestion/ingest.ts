// Ingestion orchestrator: for one tracked query, fetch its selected sources,
// normalize + dedupe, and write NEW mentions to raw_mentions.

import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TrackedQueryRow } from "@/lib/supabase/database.types";
import type { Source } from "@/lib/scoring/types";
import { fetchHackerNews } from "./hackernews";
import { fetchReddit } from "./reddit";
import { buildSearchTerms, SourceNotConfiguredError } from "./types";
import type { NormalizedMention } from "./types";

export interface IngestResult {
  queryId: string;
  terms: string[];
  fetched: number; // total normalized mentions seen (pre-dedup vs DB)
  inserted: number; // new rows actually written
  bySource: Partial<Record<Source, number>>;
  skipped: { source: Source; reason: string }[];
}

/** Sources we currently have fetchers for. */
const SUPPORTED: Source[] = ["reddit", "hn"];

export async function ingestForQuery(
  supabase: SupabaseClient,
  query: TrackedQueryRow,
): Promise<IngestResult> {
  const terms = buildSearchTerms(query.keywords, query.competitors);
  const result: IngestResult = {
    queryId: query.id,
    terms,
    fetched: 0,
    inserted: 0,
    bySource: {},
    skipped: [],
  };

  if (terms.length === 0) {
    result.skipped.push({ source: "reddit", reason: "no keywords/competitors to search" });
    return result;
  }

  const all: NormalizedMention[] = [];
  for (const source of query.sources) {
    if (!SUPPORTED.includes(source)) {
      result.skipped.push({ source, reason: "source not yet supported" });
      continue;
    }
    try {
      const mentions =
        source === "reddit"
          ? await fetchReddit(terms)
          : await fetchHackerNews(terms);
      result.bySource[source] = mentions.length;
      all.push(...mentions);
    } catch (err) {
      if (err instanceof SourceNotConfiguredError) {
        result.skipped.push({ source, reason: err.message });
      } else {
        result.skipped.push({
          source,
          reason: err instanceof Error ? err.message : String(err),
        });
      }
    }
  }

  result.fetched = all.length;
  if (all.length === 0) {
    await touchLastFetched(supabase, query.id);
    return result;
  }

  // De-dupe within this batch on the global unique key (source, source_post_id).
  const uniq = new Map<string, NormalizedMention>();
  for (const m of all) uniq.set(`${m.source}:${m.sourcePostId}`, m);

  const rows = [...uniq.values()].map((m) => ({
    tracked_query_id: query.id,
    source: m.source,
    source_post_id: m.sourcePostId,
    url: m.url,
    author: m.author,
    content: m.content,
    posted_at: m.postedAt,
    raw_engagement: m.engagement,
  }));

  // ignoreDuplicates → mentions already stored (this or another query) are
  // skipped; .select() returns only the newly inserted rows.
  const { data: inserted, error } = await supabase
    .from("raw_mentions")
    .upsert(rows, { onConflict: "source,source_post_id", ignoreDuplicates: true })
    .select("id");

  if (error) throw new Error(`raw_mentions insert failed: ${error.message}`);
  result.inserted = inserted?.length ?? 0;

  await touchLastFetched(supabase, query.id);
  return result;
}

async function touchLastFetched(supabase: SupabaseClient, queryId: string) {
  await supabase
    .from("tracked_queries")
    .update({ last_fetched_at: new Date().toISOString() })
    .eq("id", queryId);
}
