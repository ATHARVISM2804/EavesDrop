// Hacker News source — via the free, keyless Algolia HN Search API.
// Docs: https://hn.algolia.com/api

import "server-only";
import type { NormalizedMention } from "./types";

const ALGOLIA = "https://hn.algolia.com/api/v1/search_by_date";

interface AlgoliaHit {
  objectID: string;
  author: string | null;
  title: string | null;
  story_text: string | null;
  comment_text: string | null;
  url: string | null;
  points: number | null;
  num_comments: number | null;
  created_at: string; // ISO
}

async function searchTerm(
  term: string,
  hitsPerPage: number,
): Promise<NormalizedMention[]> {
  const params = new URLSearchParams({
    query: term,
    tags: "(story,ask_hn)",
    hitsPerPage: String(hitsPerPage),
  });
  const res = await fetch(`${ALGOLIA}?${params}`, {
    headers: { "User-Agent": "eavesdrop/0.1" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    throw new Error(`HN Algolia ${res.status} for "${term}"`);
  }
  const json = (await res.json()) as { hits: AlgoliaHit[] };

  return json.hits
    .map((h): NormalizedMention | null => {
      const content = (h.title ?? h.story_text ?? h.comment_text ?? "").trim();
      if (!content) return null;
      return {
        source: "hn",
        sourcePostId: `hn_${h.objectID}`,
        url: `https://news.ycombinator.com/item?id=${h.objectID}`,
        author: h.author,
        content,
        postedAt: h.created_at,
        engagement: {
          points: h.points ?? 0,
          comments: h.num_comments ?? 0,
        },
      };
    })
    .filter((m): m is NormalizedMention => m !== null);
}

/** Fetch recent HN stories/Ask-HN posts matching any of the terms. */
export async function fetchHackerNews(
  terms: string[],
  opts: { hitsPerTerm?: number } = {},
): Promise<NormalizedMention[]> {
  const hitsPerPage = opts.hitsPerTerm ?? 20;
  const byId = new Map<string, NormalizedMention>();

  for (const term of terms) {
    try {
      for (const m of await searchTerm(term, hitsPerPage)) {
        byId.set(m.sourcePostId, m); // de-dupe across terms
      }
    } catch (err) {
      // One bad term shouldn't sink the whole source.
      console.warn(`[hn] term "${term}" failed:`, err);
    }
  }

  return [...byId.values()];
}
