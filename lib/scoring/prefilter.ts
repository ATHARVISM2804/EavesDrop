// Cheap, LLM-free pre-filter. Discards obvious noise before any scoring call,
// which the brief estimates catches 40–60% of candidates. Pure and
// deterministic — safe to unit-test without network or API keys.

import type { Candidate, PrefilterReason, PrefilterResult } from "./types";

export interface PrefilterOptions {
  /** Minimum content length (chars) to be worth scoring. */
  minLength?: number;
  /** Author handles known to be bots/spam (lowercased, without prefix). */
  botAuthors?: Set<string>;
}

const DELETED_MARKERS = ["[deleted]", "[removed]", "<deleted>"];

/** Normalize text for near-duplicate detection: lowercase, collapse whitespace. */
function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

/** Strip a leading source prefix like "u/", "@", "/u/" from an author handle. */
function normalizeAuthor(author: string): string {
  return author.replace(/^\/?u\/|^@/i, "").toLowerCase().trim();
}

export function prefilter(
  candidates: Candidate[],
  options: PrefilterOptions = {},
): PrefilterResult {
  const minLength = options.minLength ?? 40;
  const botAuthors = options.botAuthors ?? new Set<string>();

  const kept: Candidate[] = [];
  const dropped: { candidate: Candidate; reason: PrefilterReason }[] = [];
  const seen = new Set<string>();

  for (const candidate of candidates) {
    const reason = reject(candidate, { minLength, botAuthors, seen });
    if (reason) {
      dropped.push({ candidate, reason });
    } else {
      seen.add(normalize(candidate.content));
      kept.push(candidate);
    }
  }

  return { kept, dropped };
}

function reject(
  candidate: Candidate,
  ctx: { minLength: number; botAuthors: Set<string>; seen: Set<string> },
): PrefilterReason | null {
  const content = (candidate.content ?? "").trim();

  // Deleted / removed content
  const lowered = content.toLowerCase();
  if (!content || DELETED_MARKERS.some((m) => lowered === m)) {
    return "deleted";
  }

  // Too short to carry a real signal
  if (content.length < ctx.minLength) {
    return "too_short";
  }

  // Known bot / spam account
  if (candidate.author) {
    const handle = normalizeAuthor(candidate.author);
    if (handle && ctx.botAuthors.has(handle)) {
      return "bot_or_spam";
    }
  }

  // Near-identical to something already kept this batch
  if (ctx.seen.has(normalize(content))) {
    return "duplicate";
  }

  return null;
}
