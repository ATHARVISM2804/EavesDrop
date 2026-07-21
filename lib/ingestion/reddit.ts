// Reddit source — read-only OAuth (client_credentials) search.
// Anti-block practices baked in: unique User-Agent, OAuth auth, token caching,
// rate-limit header awareness, and modest request volume. See docs/SETUP.md.

import "server-only";
import type { NormalizedMention } from "./types";
import { SourceNotConfiguredError } from "./types";

const TOKEN_URL = "https://www.reddit.com/api/v1/access_token";
const SEARCH_URL = "https://oauth.reddit.com/search";

function creds() {
  const id = process.env.REDDIT_CLIENT_ID;
  const secret = process.env.REDDIT_CLIENT_SECRET;
  const ua = process.env.REDDIT_USER_AGENT;
  if (!id || !secret || !ua) {
    throw new SourceNotConfiguredError(
      "reddit",
      "Reddit not configured — set REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET / REDDIT_USER_AGENT.",
    );
  }
  return { id, secret, ua };
}

// Cache the app-only token across calls (expires in ~1h); refresh a minute early.
let tokenCache: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  const { id, secret, ua } = creds();
  if (tokenCache && Date.now() < tokenCache.expiresAt) return tokenCache.token;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": ua,
    },
    body: "grant_type=client_credentials",
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    throw new Error(`Reddit auth failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { access_token: string; expires_in: number };
  tokenCache = {
    token: json.access_token,
    expiresAt: Date.now() + (json.expires_in - 60) * 1000,
  };
  return json.access_token;
}

interface RedditChild {
  data: {
    id: string;
    permalink: string;
    author: string;
    title: string;
    selftext: string;
    created_utc: number;
    ups: number;
    num_comments: number;
  };
}

async function searchTerm(
  term: string,
  limit: number,
): Promise<NormalizedMention[]> {
  const { ua } = creds();
  const token = await getToken();
  const params = new URLSearchParams({
    q: term,
    sort: "new",
    limit: String(limit),
    type: "link",
    raw_json: "1",
  });
  const res = await fetch(`${SEARCH_URL}?${params}`, {
    headers: { Authorization: `Bearer ${token}`, "User-Agent": ua },
    signal: AbortSignal.timeout(15_000),
  });

  // Respect rate limits — Reddit tells us how much headroom is left.
  const remaining = Number(res.headers.get("x-ratelimit-remaining") ?? "1");
  if (res.status === 429 || remaining <= 1) {
    console.warn(`[reddit] rate-limit hit/near for "${term}" — backing off`);
    if (res.status === 429) return [];
  }
  if (!res.ok) throw new Error(`Reddit search ${res.status} for "${term}"`);

  const json = (await res.json()) as { data: { children: RedditChild[] } };
  return json.data.children
    .map((c): NormalizedMention | null => {
      const d = c.data;
      const content = `${d.title}\n\n${d.selftext ?? ""}`.trim();
      if (!content) return null;
      return {
        source: "reddit",
        sourcePostId: `reddit_${d.id}`,
        url: `https://www.reddit.com${d.permalink}`,
        author: d.author ? `u/${d.author}` : null,
        content,
        postedAt: new Date(d.created_utc * 1000).toISOString(),
        engagement: { upvotes: d.ups ?? 0, comments: d.num_comments ?? 0 },
      };
    })
    .filter((m): m is NormalizedMention => m !== null);
}

/** Fetch recent Reddit posts matching any term. Throws SourceNotConfiguredError
 * if creds are missing (orchestrator skips the source). */
export async function fetchReddit(
  terms: string[],
  opts: { limitPerTerm?: number } = {},
): Promise<NormalizedMention[]> {
  creds(); // fail fast if unconfigured
  const limit = opts.limitPerTerm ?? 20;
  const byId = new Map<string, NormalizedMention>();

  for (const term of terms) {
    try {
      for (const m of await searchTerm(term, limit)) {
        byId.set(m.sourcePostId, m);
      }
    } catch (err) {
      if (err instanceof SourceNotConfiguredError) throw err;
      console.warn(`[reddit] term "${term}" failed:`, err);
    }
  }

  return [...byId.values()];
}
