import { test } from "node:test";
import assert from "node:assert/strict";
import { prefilter } from "./prefilter";
import type { Candidate } from "./types";

function make(partial: Partial<Candidate> & { id: string }): Candidate {
  return {
    source: "reddit",
    content: "This is a reasonably long post about looking for a lead-gen tool.",
    ...partial,
  };
}

test("keeps a normal, substantive post", () => {
  const { kept, dropped } = prefilter([make({ id: "1" })]);
  assert.equal(kept.length, 1);
  assert.equal(dropped.length, 0);
});

test("drops posts under the minimum length", () => {
  const { kept, dropped } = prefilter([make({ id: "1", content: "too short" })]);
  assert.equal(kept.length, 0);
  assert.equal(dropped[0].reason, "too_short");
});

test("drops deleted/removed content", () => {
  const { dropped } = prefilter([
    make({ id: "1", content: "[deleted]" }),
    make({ id: "2", content: "[removed]" }),
  ]);
  assert.equal(dropped.length, 2);
  assert.ok(dropped.every((d) => d.reason === "deleted"));
});

test("drops known bot/spam authors regardless of prefix", () => {
  const bots = new Set(["spammer"]);
  const { kept, dropped } = prefilter(
    [
      make({ id: "1", author: "u/spammer" }),
      make({ id: "2", author: "@spammer" }),
      make({ id: "3", author: "realuser" }),
    ],
    { botAuthors: bots },
  );
  assert.equal(kept.length, 1);
  assert.equal(kept[0].id, "3");
  assert.equal(dropped.length, 2);
  assert.ok(dropped.every((d) => d.reason === "bot_or_spam"));
});

test("drops near-duplicate content (whitespace/case-insensitive)", () => {
  const { kept, dropped } = prefilter([
    make({ id: "1", content: "Looking for an alternative to Linkeddit please" }),
    make({ id: "2", content: "looking   for an ALTERNATIVE to Linkeddit please" }),
  ]);
  assert.equal(kept.length, 1);
  assert.equal(dropped[0].reason, "duplicate");
});

test("respects a custom minLength", () => {
  const post = make({ id: "1", content: "short-ish content here" }); // 22 chars
  assert.equal(prefilter([post]).kept.length, 0); // dropped by the default 40
  assert.equal(prefilter([post], { minLength: 5 }).kept.length, 1); // kept at 5
  assert.equal(prefilter([post], { minLength: 500 }).kept.length, 0); // dropped at 500
});
