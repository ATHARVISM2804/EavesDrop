import type { CompareRow } from "@/components/marketing/CompareTable";

export type Competitor = {
  slug: string;
  name: string;
  // Short descriptor used in headings / meta.
  descriptor: string;
  metaTitle: string;
  metaDescription: string;
  // Hero
  heading: string;
  intro: string;
  // The honest "where they're good" — credibility matters on comparison pages.
  theyreGoodAt: string;
  // The core argument for switching.
  whyEavesdrop: string[];
  // Rows for the head-to-head table (Eavesdrop column is added in the page).
  rows: CompareRow[];
};

// Feature rows shared across competitor pages — keeps the story consistent.
function rows(competitorValues: Record<string, boolean | "partial" | string>): CompareRow[] {
  const labels = [
    "Sources covered",
    "Buyer-intent scoring (0–100)",
    "Category triage (buying vs. noise)",
    "Suggested reply angle",
    "Learns from your feedback",
    "Noise filtered before AI cost",
    "Free tier, no credit card",
  ];
  const eavesdrop: Record<string, boolean | "partial" | string> = {
    "Sources covered": "Reddit · X · HN (+more)",
    "Buyer-intent scoring (0–100)": true,
    "Category triage (buying vs. noise)": true,
    "Suggested reply angle": true,
    "Learns from your feedback": true,
    "Noise filtered before AI cost": true,
    "Free tier, no credit card": true,
  };
  return labels.map((label) => ({
    label,
    values: {
      eavesdrop: eavesdrop[label],
      competitor: competitorValues[label],
    },
  }));
}

export const competitors: Competitor[] = [
  {
    slug: "linkeddit",
    name: "Linkeddit",
    descriptor: "a Reddit-only lead-gen tool",
    metaTitle: "Eavesdrop vs. Linkeddit — Multi-source buyer intent",
    metaDescription:
      "Linkeddit watches Reddit. Eavesdrop scores buyer intent across Reddit, X, and Hacker News — and learns from your feedback. See the head-to-head.",
    heading: "Eavesdrop vs. Linkeddit",
    intro:
      "Linkeddit is a solid way to catch mentions on Reddit. But your buyers don't only talk on Reddit — and a tool tied to one platform's API is one policy change away from going dark.",
    theyreGoodAt:
      "Linkeddit does one thing cleanly: surface Reddit threads that match your keywords. If Reddit is the only place you care about, it's a reasonable pick.",
    whyEavesdrop: [
      "Multi-source from day one — Reddit, X, and Hacker News, with review sites on the way. No single API can switch you off.",
      "Every mention is scored 0–100 for real buying intent and triaged into buying, switching, complaint, curious, or noise — so you work a ranked list instead of a keyword firehose.",
      "The scoring learns from your thumbs up/down and tunes to your account. Week four is sharper than week one.",
    ],
    rows: rows({
      "Sources covered": "Reddit only",
      "Buyer-intent scoring (0–100)": false,
      "Category triage (buying vs. noise)": false,
      "Suggested reply angle": false,
      "Learns from your feedback": false,
      "Noise filtered before AI cost": "partial",
      "Free tier, no credit card": true,
    }),
  },
  {
    slug: "f5bot",
    name: "F5Bot",
    descriptor: "a free keyword-alert service",
    metaTitle: "Eavesdrop vs. F5Bot — Intent scoring beyond keyword alerts",
    metaDescription:
      "F5Bot emails you keyword matches from Reddit and HN. Eavesdrop scores buyer intent, triages the noise, and learns from you. Compare them side by side.",
    heading: "Eavesdrop vs. F5Bot",
    intro:
      "F5Bot is a beloved free tool that emails you when your keywords show up on Reddit and Hacker News. It's great for hobby monitoring — but it tells you a word appeared, not whether someone is ready to buy.",
    theyreGoodAt:
      "F5Bot is free, simple, and reliable for raw keyword alerts. If you just want a ping when a term is mentioned, it does that well.",
    whyEavesdrop: [
      "Intent, not just keywords — every match is scored 0–100 and sorted, so you stop triaging a noisy inbox by hand.",
      "Adds X on top of Reddit and HN, and buckets each mention by category with a suggested reply angle.",
      "Gets smarter the more you use it — your feedback retrains the scoring to your definition of a good lead.",
    ],
    rows: rows({
      "Sources covered": "Reddit · HN",
      "Buyer-intent scoring (0–100)": false,
      "Category triage (buying vs. noise)": false,
      "Suggested reply angle": false,
      "Learns from your feedback": false,
      "Noise filtered before AI cost": false,
      "Free tier, no credit card": true,
    }),
  },
];

export function getCompetitor(slug: string): Competitor | undefined {
  return competitors.find((c) => c.slug === slug);
}
