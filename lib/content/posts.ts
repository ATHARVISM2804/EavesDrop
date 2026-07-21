// Blog content. Swap this for a CMS/MDX source later — the page template reads
// from here so the index and detail pages stay in sync.

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "ul"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string; // display string
  readingTime: string;
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "single-source-social-listening-is-a-dead-end",
    title: "Why single-source social listening is a dead end",
    excerpt:
      "Reddit-only tools live and die by one platform's API policy. Here's why coverage is a moat.",
    tag: "Positioning",
    date: "Jul 2026",
    readingTime: "4 min read",
    body: [
      {
        type: "p",
        text: "Every few months, a platform quietly changes its API terms and an entire category of tools breaks overnight. If your lead-gen engine reads from exactly one source, you've built your pipeline on someone else's permission.",
      },
      { type: "h2", text: "Your buyers don't live on one platform" },
      {
        type: "p",
        text: "A founder asking for a recommendation might post on Reddit. A frustrated user venting about your competitor might do it on X. Someone comparing options might start an Ask HN thread. If you're only watching one of those, you're missing most of the conversation — and the highest-intent moments often happen where you're not looking.",
      },
      { type: "h2", text: "Single-source is a single point of failure" },
      {
        type: "p",
        text: "It isn't just about coverage. A tool tied to one API inherits all of that platform's risk: rate limits, pricing changes, policy shifts, outages. Diversifying sources isn't a nice-to-have — it's what keeps the lights on.",
      },
      { type: "quote", text: "Coverage isn't a feature. It's the moat." },
      { type: "h2", text: "What multi-source actually buys you" },
      {
        type: "ul",
        items: [
          "Resilience — no single policy change can take you offline.",
          "More signal — you catch intent wherever it's expressed.",
          "Better scoring — more context per buyer across platforms.",
        ],
      },
      {
        type: "p",
        text: "That's the bet Eavesdrop is built on: watch Reddit, X, and Hacker News from day one, and add sources over time. The goal isn't to monitor one place perfectly — it's to never miss a buyer because they happened to post somewhere else.",
      },
    ],
  },
  {
    slug: "scoring-buyer-intent-without-lighting-money-on-fire",
    title: "Scoring buyer intent without lighting money on fire",
    excerpt:
      "A two-pass approach: cheap first-pass on everything, careful escalation only on the close calls.",
    tag: "Engineering",
    date: "Jul 2026",
    readingTime: "5 min read",
    body: [
      {
        type: "p",
        text: "Scoring every social mention with a large model is a great way to run up a bill and learn nothing. Most mentions are obviously noise or obviously hot — you don't need your most expensive reasoning to tell them apart. The money is in the middle.",
      },
      { type: "h2", text: "Filter before you spend" },
      {
        type: "p",
        text: "Before anything hits a model, a cheap, deterministic prefilter throws out the obvious junk — off-topic threads, ancient bumped posts, keyword coincidences. In practice this removes 40–60% of volume before it costs a cent.",
      },
      { type: "h2", text: "Two passes, not one" },
      {
        type: "p",
        text: "What survives gets a fast first-pass score from a small model. Anything it's confident about — clearly high or clearly low intent — is done. Only the genuine close calls, the 40–70 band where the answer actually matters, get escalated to a more careful model.",
      },
      { type: "quote", text: "Spend your compute where it changes the decision — nowhere else." },
      { type: "h2", text: "Why this works" },
      {
        type: "ul",
        items: [
          "Cheap first pass handles the easy majority.",
          "Expensive second pass only touches the ambiguous few.",
          "Prompt caching keeps the shared context nearly free.",
          "You get a 0–100 score on everything, at a fraction of naive cost.",
        ],
      },
      {
        type: "p",
        text: "The result is scoring that's both careful and affordable — which is what makes a generous free tier possible in the first place.",
      },
    ],
  },
  {
    slug: "the-feedback-loop-that-makes-scoring-feel-personal",
    title: "The feedback loop that makes scoring feel personal",
    excerpt:
      "How a thumbs up or down quietly retrains the model to think like your best SDR.",
    tag: "Product",
    date: "Jul 2026",
    readingTime: "4 min read",
    body: [
      {
        type: "p",
        text: "A good lead for you isn't a good lead for everyone. Your ideal buyer, your deal size, the phrasing that signals real intent in your market — all of it is specific to you. A one-size-fits-all score can only get you so far.",
      },
      { type: "h2", text: "Every reaction is a training signal" },
      {
        type: "p",
        text: "When you thumbs up or down a lead, Eavesdrop doesn't just hide it. It extracts the pattern — this category, from this source, phrased this way — and nudges a weight for your account. Those weights get injected into every future scoring call.",
      },
      { type: "h2", text: "Compounding, quietly" },
      {
        type: "p",
        text: "None of this asks you to configure anything. You just work your feed and react. Over a week or two, the scoring tilts toward the leads you actually want and away from the ones you don't — no settings, no retraining runs, no prompt engineering.",
      },
      { type: "quote", text: "Week four is sharper than week one. A competitor starting today is always behind." },
      { type: "h2", text: "Why it's a moat" },
      {
        type: "p",
        text: "Anyone can wrap a search API in a generic prompt. What they can't copy is the model of your taste — accumulated one reaction at a time. The longer you use it, the more it's yours, and the harder it is for anyone to catch up.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
