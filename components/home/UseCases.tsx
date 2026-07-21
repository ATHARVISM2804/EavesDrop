"use client";

import Link from "next/link";
import { useState } from "react";

type UseCase = {
  key: string;
  title: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
  signals: { label: string; pct: number }[];
};

const icon = (d: string) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {d.split("|").map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
);

const cases: UseCase[] = [
  {
    key: "sales",
    title: "Lead Generation & Sales",
    desc: "Surface buying-intent threads as they happen, scored and in context, so sales talks to people already in market.",
    href: "/lead-gen",
    icon: icon("M12 2v4|M12 18v4|m4.9 4.9 2.8 2.8|m16.3 16.3 2.8 2.8|M2 12h4|M18 12h4|M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"),
    signals: [
      { label: "Buying-intent posts", pct: 100 },
      { label: "Alternative requests", pct: 78 },
      { label: "Pricing questions", pct: 54 },
    ],
  },
  {
    key: "recruitment",
    title: "Talent & Recruitment",
    desc: "Spot people frustrated with their tools or openly looking to switch roles — warm signals for outbound recruiting.",
    href: "/monitors",
    icon: icon("M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2|M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z|M22 21v-2a4 4 0 0 0-3-3.9"),
    signals: [
      { label: "“looking to switch”", pct: 82 },
      { label: "Tool frustration", pct: 66 },
      { label: "Hiring mentions", pct: 41 },
    ],
  },
  {
    key: "research",
    title: "Market Research",
    desc: "Read unfiltered demand across sources — the questions, gaps, and complaints that tell you where the market is heading.",
    href: "/compete",
    icon: icon("M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z|m21 21-4.3-4.3"),
    signals: [
      { label: "Recurring questions", pct: 88 },
      { label: "Unmet needs", pct: 71 },
      { label: "Feature requests", pct: 59 },
    ],
  },
  {
    key: "learning",
    title: "Learning & Development",
    desc: "Track what practitioners are actually struggling with to shape content, courses, and docs that land.",
    href: "/content",
    icon: icon("M12 2 2 7l10 5 10-5-10-5Z|M2 17l10 5 10-5|M2 12l10 5 10-5"),
    signals: [
      { label: "“how do I…” posts", pct: 76 },
      { label: "Confusion signals", pct: 63 },
      { label: "Tutorial requests", pct: 48 },
    ],
  },
  {
    key: "bizdev",
    title: "Business Development",
    desc: "Find partnership and integration openings by watching who's asking to connect the tools you already work with.",
    href: "/monitors",
    icon: icon("M20 7h-9|M14 17H5|M9 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z|M21 17a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"),
    signals: [
      { label: "Integration asks", pct: 69 },
      { label: "“works with…”", pct: 52 },
      { label: "Partnership intent", pct: 37 },
    ],
  },
  {
    key: "marketing",
    title: "Content & Marketing",
    desc: "Mine real language and objections from your buyers to write copy, campaigns, and replies that sound like them.",
    href: "/content",
    icon: icon("M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1Z|M4 22v-7"),
    signals: [
      { label: "Objection language", pct: 74 },
      { label: "Voice-of-customer", pct: 61 },
      { label: "Trending topics", pct: 45 },
    ],
  },
];

function Panel({ c }: { c: UseCase }) {
  return (
    <div className="flex h-full min-w-[15rem] flex-col justify-between p-7">
      <div>
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-paper">
          {c.icon}
        </span>
        <h3 className="mt-6 font-serif text-2xl font-semibold leading-snug tracking-tight text-ink">
          {c.title}
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-static">{c.desc}</p>
      </div>

      <div>
        <div className="rounded-xl border border-hairline bg-paper/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-static">
              Demand signals
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-success">
              <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-success" /> live
            </span>
          </div>
          <div className="mt-3 space-y-2.5">
            {c.signals.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink">{s.label}</span>
                  <span className="font-semibold tabular-nums text-static">{s.pct}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-divider">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-signal/70 to-signal transition-[width] duration-700 ease-out"
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <Link href={c.href} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-signal hover:underline">
          Explore {c.title.split(" & ")[0]} <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}

export function UseCases() {
  const [active, setActive] = useState(0);

  return (
    <section className="scroll-mt-20 py-24">
      <div className="container-content">
        <div className="max-w-2xl">
          <span className="eyebrow">Use cases</span>
          <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            What can you do with{" "}
            <span className="italic text-signal">buyer intelligence</span>?
          </h2>
          <p className="mt-4 text-lg text-static">
            The same multi-source signal feed powers very different goals. Hover a
            panel to see how teams put it to work.
          </p>
        </div>

        {/* Desktop: hover-expand accordion */}
        <div className="mt-12 hidden h-[30rem] gap-3 md:flex">
          {cases.map((c, i) => {
            const on = i === active;
            return (
              <div
                key={c.key}
                onMouseEnter={() => setActive(i)}
                className={`relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  on
                    ? "flex-[5] border-signal/30 bg-surface shadow-lg"
                    : "flex-[1] border-divider bg-surface/50 hover:bg-surface"
                }`}
              >
                {/* Expanded */}
                <div className={`h-full transition-opacity duration-300 ${on ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0"}`}>
                  <Panel c={c} />
                </div>
                {/* Collapsed spine */}
                <div className={`absolute inset-0 flex flex-col items-center justify-between p-5 transition-opacity duration-300 ${on ? "pointer-events-none opacity-0" : "opacity-100"}`}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink/90 text-paper">
                    {c.icon}
                  </span>
                  <span
                    className="text-sm font-semibold tracking-tight text-static"
                    style={{ writingMode: "vertical-rl" }}
                  >
                    {c.title}
                  </span>
                  <span className="text-xs text-static/50">0{cases.indexOf(c) + 1}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: stacked cards */}
        <div className="mt-10 grid gap-4 md:hidden">
          {cases.map((c) => (
            <div key={c.key} className="rounded-2xl border border-divider bg-surface shadow-sm">
              <Panel c={c} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
