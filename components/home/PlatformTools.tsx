"use client";

import Link from "next/link";
import { useState } from "react";

type Tool = {
  key: string;
  label: string;
  href: string;
  title: string;
  body: string;
  points: string[];
  stat: string;
  statLabel: string;
};

const tools: Tool[] = [
  {
    key: "lead-gen",
    label: "Lead Gen",
    href: "/lead-gen",
    title: "Find buyers who need your product",
    body: "AI-powered lead discovery across every source. Describe your ideal customer; work a ranked feed of people already in market.",
    points: ["Describe your ICP in plain language", "Scored by buying intent & engagement", "Export lists or work them in-app"],
    stat: "10×",
    statLabel: "higher conversion vs. cold email",
  },
  {
    key: "monitors",
    label: "Monitors",
    href: "/monitors",
    title: "Always-on keyword & competitor tracking",
    body: "Scheduled monitors watch your keywords and competitors 24/7, deduped into one intent-ranked feed with full context.",
    points: ["Keyword & competitor monitors", "24/7 polling, no manual refresh", "Email / Slack digests"],
    stat: "24/7",
    statLabel: "listening, no refresh caps",
  },
  {
    key: "compete",
    label: "Compete",
    href: "/compete",
    title: "Competitor intel & switch-ready buyers",
    body: "Track competitor complaints and demand shifts, and catch buyers the moment frustration turns into a search for alternatives.",
    points: ["Switching-signal detection", "Competitor complaint tracking", "Graded, prioritized view"],
    stat: "94",
    statLabel: "avg. intent on switch signals",
  },
  {
    key: "content",
    label: "Content",
    href: "/content",
    title: "Turn signal into conversations",
    body: "Draft on-topic, non-spammy replies grounded in the full thread and your product context — engage authentically, fast.",
    points: ["Context-aware reply drafts", "Per-source tone & formatting", "You edit before you post"],
    stat: "<1m",
    statLabel: "from signal to sent",
  },
  {
    key: "mcp",
    label: "MCP",
    href: "/mcp",
    title: "Use Eavesdrop inside Claude",
    body: "Add Eavesdrop as a remote MCP connector and give Claude buyer-intent tools — search, score, and pull leads conversationally.",
    points: ["Search & score from Claude", "Pull high-intent leads on demand", "No API keys to wrangle"],
    stat: "8",
    statLabel: "tools Claude gets",
  },
];

export function PlatformTools() {
  const [active, setActive] = useState(0);
  const tool = tools[active];

  return (
    <section className="scroll-mt-20 border-y border-divider bg-sunken/40 py-24">
      <div className="container-content">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow-center justify-center">The platform</span>
          <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Everything you need for{" "}
            <span className="italic text-signal">buyer demand</span>.
          </h2>
          <p className="mt-4 text-lg text-static">
            Five tools across the full workflow — from surfacing intent to drafting
            the reply that wins it.
          </p>
        </div>

        {/* Tab bar */}
        <div className="mt-12 flex flex-wrap justify-center gap-1 border-b border-divider">
          {tools.map((t, i) => {
            const on = i === active;
            return (
              <button
                key={t.key}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                  on ? "text-ink" : "text-static hover:text-ink"
                }`}
              >
                {t.label}
                <span
                  className={`absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-signal transition-transform duration-200 ${
                    on ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div
          key={tool.key}
          className="mt-10 grid animate-fade-up items-center gap-10 md:grid-cols-2"
        >
          <div>
            <h3 className="font-serif text-3xl font-semibold leading-tight tracking-tight">
              {tool.title}
            </h3>
            <ul className="mt-6 space-y-3">
              {tool.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-ink">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="mt-0.5 shrink-0">
                    <path d="M13.5 4.5 6.5 11.5 3 8" stroke="#D97B3F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {p}
                </li>
              ))}
            </ul>
            <Link href={tool.href} className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-signal hover:underline">
              Explore {tool.label} <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="relative">
            <div aria-hidden className="absolute -inset-4 -z-10 rounded-2xl bg-dot-grid opacity-60 [mask-image:radial-gradient(70%_70%_at_50%_40%,#000,transparent)]" />
            <div className="rounded-2xl border border-divider bg-surface p-8 shadow-lg">
              <p className="text-sm leading-relaxed text-static">{tool.body}</p>
              <div className="mt-6 flex items-baseline gap-3 border-t border-hairline pt-6">
                <span className="font-serif text-4xl font-semibold tracking-tight text-signal-dark">
                  {tool.stat}
                </span>
                <span className="text-sm text-static">{tool.statLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
