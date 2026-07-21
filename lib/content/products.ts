// Product/feature pages (the nav's product surface). One shared template
// (components/marketing/ProductPage.tsx) renders all of these from this data.

export type ProductFeature = {
  label: string; // small panel/tab label
  title: string;
  body: string;
  points: string[];
};

export type ProductStep = { n: string; title: string; body: string };

export type Product = {
  slug: string;
  nav: string; // nav label
  eyebrow: string;
  title: string;
  titleItalic?: string; // trailing italic-amber emphasis
  intro: string;
  metaTitle: string;
  metaDescription: string;
  features: ProductFeature[];
  // MCP-style extras (optional)
  steps?: ProductStep[];
  tools?: string[];
};

export const products: Product[] = [
  {
    slug: "lead-gen",
    nav: "Lead Gen",
    eyebrow: "Lead Gen",
    title: "Find the buyers who need",
    titleItalic: "your product",
    intro:
      "AI-powered lead discovery across Reddit, X, and Hacker News. Describe what you sell and Eavesdrop surfaces the people actively asking for it — scored by buying intent, ranked so you work the ones that matter first.",
    metaTitle: "Lead Gen — Multi-source buyer-intent leads | Eavesdrop",
    metaDescription:
      "Describe your ideal customer and let Eavesdrop find buyers across Reddit, X, and Hacker News — scored 0–100 by buying intent, with a suggested reply angle for each.",
    features: [
      {
        label: "Intent scoring",
        title: "Scored by real buying intent",
        body: "Every mention is scored 0–100 by a two-pass AI engine and sorted so the hottest buyers are always on top. Stop scrolling feeds — work a ranked list.",
        points: [
          "0–100 buyer-intent score on every mention",
          "Sorted by intent, not recency",
          "Buying / switching / complaint / curious triage",
        ],
      },
      {
        label: "Reply angle",
        title: "Open the conversation in seconds",
        body: "Each lead comes with a suggested reply angle and a direct link to the source thread, so you can jump in naturally while the intent is hot.",
        points: [
          "AI-suggested reply angle per lead",
          "Direct link to the source conversation",
          "Full thread context, not just an alert",
        ],
      },
      {
        label: "Export",
        title: "Take your pipeline anywhere",
        body: "Export curated, high-intent lead lists for outreach, or keep working them right inside Eavesdrop as the scoring sharpens to your taste.",
        points: [
          "Export curated lead lists",
          "Personalization that learns from your feedback",
          "No refresh throttling — always fresh",
        ],
      },
    ],
  },
  {
    slug: "monitors",
    nav: "Monitors",
    eyebrow: "Monitors",
    title: "Never miss a conversation that",
    titleItalic: "matters",
    intro:
      "Scheduled monitors watch your keywords, competitors, and subreddits across every source — then dedupe everything into one ranked feed with full thread context. Set it once; the buyers come to you.",
    metaTitle: "Monitors — Always-on multi-source listening | Eavesdrop",
    metaDescription:
      "Scheduled monitors track keywords and competitors across Reddit, X, and Hacker News, deduped into one intent-ranked feed. Set it once and never miss a buying signal.",
    features: [
      {
        label: "Keyword monitors",
        title: "Track the phrases buyers use",
        body: "Watch the keywords and questions that signal intent in your market. New matches are scored and dropped into your feed automatically, around the clock.",
        points: [
          "Keyword & phrase monitors across sources",
          "24/7 scheduled polling — no manual refresh",
          "Noise filtered before it reaches your feed",
        ],
      },
      {
        label: "Competitor monitors",
        title: "Watch your competitors' every move",
        body: "Track competitor mentions and complaints across sources so you catch switch-ready buyers the moment frustration turns into a search for alternatives.",
        points: [
          "Competitor mention & complaint tracking",
          "Catch switch-ready buyers early",
          "One deduped feed across every source",
        ],
      },
      {
        label: "Digests",
        title: "The signal, delivered",
        body: "Get the week's highest-intent signals summarized and sent to you — so even when you're heads-down, the buyers never slip by.",
        points: [
          "Email / Slack digests of top signals",
          "Ranked by intent, deduped, in context",
          "Configurable cadence",
        ],
      },
    ],
  },
  {
    slug: "compete",
    nav: "Compete",
    eyebrow: "Competitor intelligence",
    title: "See what competitors change. Find the buyers they",
    titleItalic: "lose",
    intro:
      "Eavesdrop reads competitor complaints and switching signals across Reddit, X, Hacker News, and review sites, then hands you a graded brief: what moved, why it matters to you, and the buyers ready to switch.",
    metaTitle: "Compete — Competitor intelligence & switch-ready buyers | Eavesdrop",
    metaDescription:
      "Track competitor moves and complaints across reviews, Reddit, X, and HN. Get a graded brief and a live feed of switch-ready buyers — scored by intent.",
    features: [
      {
        label: "Switch-ready leads",
        title: "Catch buyers at the moment of frustration",
        body: "When someone complains about a competitor or asks for an alternative, that's your opening. Eavesdrop surfaces those switching signals, scored and in context.",
        points: [
          "Switching-signal detection across sources",
          "Scored by intent and urgency",
          "Suggested reply angle to win the switch",
        ],
      },
      {
        label: "Competitor brief",
        title: "Every move, in one graded brief",
        body: "Track competitor complaints and demand shifts and get a clear read on what changed and why it matters to you — without drowning in raw mentions.",
        points: [
          "Competitor complaint tracking",
          "Emerging-demand signals",
          "One clear, prioritized view",
        ],
      },
    ],
  },
  {
    slug: "content",
    nav: "Content",
    eyebrow: "Content",
    title: "Turn signal into",
    titleItalic: "conversations",
    intro:
      "Finding the buyer is half the job. Eavesdrop helps you respond — drafting on-topic, non-spammy replies grounded in the full thread, so you can engage authentically and turn a mention into a conversation.",
    metaTitle: "Content — AI reply drafts grounded in context | Eavesdrop",
    metaDescription:
      "Draft on-topic, non-spammy replies grounded in the full thread. Eavesdrop helps you engage the buyers it finds — authentically, while the intent is hot.",
    features: [
      {
        label: "Reply drafts",
        title: "Drafts that sound like you, not a bot",
        body: "Generate reply drafts grounded in the full thread and your product context. Edit and post as yourself — helpful first, never spammy.",
        points: [
          "Context-aware reply drafts",
          "Grounded in the full conversation",
          "You stay in control — edit before you post",
        ],
      },
      {
        label: "Tone",
        title: "On-brand, on every platform",
        body: "Match the norms of each source — a Reddit comment reads differently than a reply on X. Eavesdrop tailors the draft to where the buyer is.",
        points: [
          "Per-source tone and formatting",
          "Helpful, authentic angles",
          "Faster from signal to sent",
        ],
      },
    ],
  },
  {
    slug: "mcp",
    nav: "MCP",
    eyebrow: "Claude connector",
    title: "Use Eavesdrop inside",
    titleItalic: "Claude",
    intro:
      "Add Eavesdrop as a remote MCP connector and give Claude a set of buyer-intent tools. Search sources, find high-intent leads, and analyze users without ever leaving your conversation.",
    metaTitle: "MCP — Use Eavesdrop inside Claude | Eavesdrop",
    metaDescription:
      "Add Eavesdrop as a remote MCP connector and give Claude buyer-intent tools: search sources, find high-intent leads, and analyze users right inside your chat.",
    features: [
      {
        label: "Buyer-intent tools",
        title: "Your listening engine, in the chat",
        body: "Give Claude direct access to Eavesdrop's search and scoring so you can research demand and pull leads conversationally — no context-switching.",
        points: [
          "Search & score across sources from Claude",
          "Pull high-intent leads on demand",
          "Analyze users and threads inline",
        ],
      },
    ],
    steps: [
      { n: "01", title: "Generate MCP credentials", body: "Open your Eavesdrop settings and create your MCP API key pair." },
      { n: "02", title: "Open Connectors in Claude", body: "In Claude, go to Settings → Connectors and click Add Connector." },
      { n: "03", title: "Paste the connector URL", body: "Add your Eavesdrop MCP endpoint and authorize once via OAuth." },
      { n: "04", title: "Ask Claude about your market", body: "“Find switch-ready buyers for [product] this week” — Claude answers inline." },
    ],
    tools: [
      "search_sources",
      "score_mention",
      "search_leads",
      "get_lead_insights",
      "fetch_thread",
      "get_user_profile",
      "get_user_posts",
      "suggest_reply",
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
