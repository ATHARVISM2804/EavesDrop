// A source-agnostic mention, normalized before it's written to raw_mentions.

import type { Source } from "@/lib/scoring/types";

export interface NormalizedMention {
  source: Source;
  /** Stable per-source id (e.g. "reddit_abc123", "hn_39482013"). Deduped on this. */
  sourcePostId: string;
  url: string | null;
  author: string | null;
  content: string;
  /** ISO 8601, or null if unknown. */
  postedAt: string | null;
  engagement: Record<string, number>;
}

/** Raised by a fetcher when its source isn't configured (e.g. no Reddit creds),
 * so the orchestrator can skip that source instead of failing the whole run. */
export class SourceNotConfiguredError extends Error {
  constructor(public source: Source, message: string) {
    super(message);
    this.name = "SourceNotConfiguredError";
  }
}

/** De-duplicate a term list: trimmed, non-empty, case-insensitive unique, capped. */
export function buildSearchTerms(
  keywords: string[],
  competitors: string[],
  max = 5,
): string[] {
  const seen = new Set<string>();
  const terms: string[] = [];
  for (const raw of [...keywords, ...competitors]) {
    const t = raw.trim();
    if (!t) continue;
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    terms.push(t);
    if (terms.length >= max) break;
  }
  return terms;
}
