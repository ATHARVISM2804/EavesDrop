"use client";

import { useState } from "react";

type Tab = {
  key: string;
  label: string;
  blurb: string;
  title: string;
  body: string;
  points: string[];
  feed: { author: string; source: string; snippet: string; badge: string; badgeClass: string; score: number }[];
};

const tabs: Tab[] = [
  {
    key: "buyer-intent",
    label: "Buyer intent",
    blurb: "People asking for a tool like yours",
    title: "Buyer-intent feed",
    body: "Posts from people asking for tools, alternatives, and recommendations — scored by buying intent so you act on the ones that matter.",
    points: ["AI buying-intent detection", "Engagement & relevance signals", "Full thread context, not just alerts"],
    feed: [
      { author: "u/growthgal", source: "r/SaaS · 4h", snippet: "looking for an alternative to [tool] that isn't $99/mo", badge: "Switching", badgeClass: "bg-alert/12 text-alert", score: 94 },
      { author: "throwaway_ceo", source: "Ask HN · 6h", snippet: "what do you all use for finding buyer intent these days?", badge: "Buying", badgeClass: "bg-signal/12 text-signal", score: 88 },
      { author: "@indiehacker", source: "X · 9h", snippet: "recommend a tool for finding early customers?", badge: "Curious", badgeClass: "bg-success/15 text-success", score: 61 },
    ],
  },
  {
    key: "competitor-complaints",
    label: "Competitor complaints",
    blurb: "Frustration that signals a switch",
    title: "Competitor complaints",
    body: "When someone vents about a competitor or hits a pricing wall, that's your opening. Eavesdrop surfaces those switch-ready moments, scored and in context.",
    points: ["Complaint & switching detection", "Scored by urgency", "Catch buyers before renewal"],
    feed: [
      { author: "u/opslead", source: "r/SaaS · 2h", snippet: "our current tool jacked up pricing again, need a simpler option", badge: "Switching", badgeClass: "bg-alert/12 text-alert", score: 96 },
      { author: "verified_buyer", source: "G2 · 5h", snippet: "support has gone downhill since the acquisition…", badge: "Complaint", badgeClass: "bg-static/12 text-static", score: 79 },
      { author: "@saas_sarah", source: "X · 8h", snippet: "anyone else fed up with [competitor]'s API limits?", badge: "Complaint", badgeClass: "bg-static/12 text-static", score: 72 },
    ],
  },
  {
    key: "reply-drafts",
    label: "AI reply drafts",
    blurb: "Open the conversation, fast",
    title: "AI reply drafts",
    body: "Every lead comes with a suggested reply angle grounded in the full thread — so you engage authentically while the intent is hot, not a day too late.",
    points: ["Context-aware reply angle", "Per-source tone", "You edit & post as yourself"],
    feed: [
      { author: "Reply angle", source: "for u/growthgal", snippet: "Lead with the price gap — mention your usage-based tier, no hard caps.", badge: "Draft", badgeClass: "bg-signal/12 text-signal", score: 92 },
      { author: "Reply angle", source: "for throwaway_ceo", snippet: "Share the two-pass scoring approach; it answers their exact question.", badge: "Draft", badgeClass: "bg-signal/12 text-signal", score: 88 },
    ],
  },
  {
    key: "emerging-demand",
    label: "Emerging demand",
    blurb: "New needs before they're crowded",
    title: "Emerging demand",
    body: "Spot recurring questions and unmet needs across sources before your market names them — so you're first with an answer, and first in the thread.",
    points: ["Trend & theme detection", "Cross-source aggregation", "Early-mover advantage"],
    feed: [
      { author: "Theme spike", source: "12 posts this week", snippet: "“alternative to spreadsheets for tracking Reddit leads”", badge: "Trending", badgeClass: "bg-success/15 text-success", score: 84 },
      { author: "Theme spike", source: "8 posts this week", snippet: "“is there an MCP for social listening?”", badge: "Trending", badgeClass: "bg-success/15 text-success", score: 77 },
    ],
  },
];

export function BeyondLeadGen() {
  const [active, setActive] = useState(0);
  const tab = tabs[active];

  return (
    <section className="scroll-mt-20 py-24">
      <div className="container-content">
        <div className="max-w-2xl">
          <span className="eyebrow">Beyond lead gen</span>
          <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Your whole market, in one feed.
          </h2>
          <p className="mt-4 text-lg text-static">
            Buyer intent, competitor complaints, reply drafts, and emerging demand —
            scored across Reddit, X, and Hacker News. One dashboard.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr]">
          {/* Vertical tabs */}
          <div className="flex flex-col gap-2" role="tablist" aria-orientation="vertical">
            {tabs.map((t, i) => {
              const on = i === active;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={on}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`group rounded-xl border px-5 py-4 text-left transition-all duration-200 ${
                    on
                      ? "border-signal/40 bg-signal/[0.05] shadow-sm"
                      : "border-transparent hover:border-divider hover:bg-surface"
                  }`}
                >
                  <span
                    className={`block text-sm font-semibold ${on ? "text-signal-dark" : "text-ink"}`}
                  >
                    {t.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-static">{t.blurb}</span>
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div key={tab.key} className="animate-fade-up rounded-2xl border border-divider bg-surface p-6 shadow-md md:p-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="font-serif text-2xl font-semibold tracking-tight">{tab.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-static">{tab.body}</p>
                <ul className="mt-6 space-y-3">
                  {tab.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-sm text-ink">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal/12">
                        <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Feed mock */}
              <div className="overflow-hidden rounded-xl border border-hairline bg-paper/60">
                <div className="flex items-center gap-2 border-b border-hairline px-4 py-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-live-pulse rounded-full bg-success" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                  </span>
                  <span className="text-xs font-semibold text-ink">Live · {tab.label}</span>
                </div>
                <ul className="divide-y divide-hairline">
                  {tab.feed.map((f, i) => (
                    <li key={i} className="px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-xs text-static">
                          <span className="font-semibold text-ink">{f.author}</span> · {f.source}
                        </span>
                        <span className={`shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-medium ${f.badgeClass}`}>
                          {f.badge}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm text-ink">{f.snippet}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1 w-16 overflow-hidden rounded-full bg-divider">
                          <div className="h-full rounded-full bg-gradient-to-r from-signal/70 to-signal" style={{ width: `${f.score}%` }} />
                        </div>
                        <span className="text-[10px] font-semibold tabular-nums text-static">{f.score}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
