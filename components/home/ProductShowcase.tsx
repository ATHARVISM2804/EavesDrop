"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero product showcase — a tabbed, self-running mock of the Eavesdrop app.
 *
 * Motion layers, outermost first:
 *  1. The tab strip auto-advances through product surfaces.
 *  2. Every pane re-enters on switch (keyed `animate-pane-in`) and staggers its
 *     children, so a swap reads as the app navigating rather than swapping.
 *  3. The Pipeline pane executes: nodes light in sequence, connectors fill, and
 *     a data packet travels the active edge.
 *  4. Numbers count up on entry; live counters tick while their pane is open.
 *
 * The pipeline steps mirror the real implementation in lib/pipeline/ — this is
 * the actual architecture, not invented choreography.
 *
 * Every loop halts under prefers-reduced-motion, and the tab cycle pauses on
 * hover/focus so a visitor reading a pane isn't yanked off it.
 */

/* ── data ──────────────────────────────────────────────────────────────── */

const TABS = ["Lead feed", "Sources", "Scoring", "Pipeline", "Alerts"] as const;
type Tab = (typeof TABS)[number];

const SIDEBAR: { label: string; icon: IconName; tab?: Tab }[] = [
  { label: "Leads", icon: "inbox", tab: "Lead feed" },
  { label: "Queries", icon: "search" },
  { label: "Sources", icon: "globe", tab: "Sources" },
  { label: "Scoring", icon: "spark", tab: "Scoring" },
  { label: "Pipeline", icon: "flow", tab: "Pipeline" },
  { label: "Alerts", icon: "bell", tab: "Alerts" },
  { label: "Settings", icon: "gear" },
];

const PIPELINE_STEPS = [
  { title: "New mentions on r/SaaS, r/startups", meta: "reddit.search.new", tag: "TRIGGER", out: "212 fetched" },
  { title: "Drop bots, dupes and deleted posts", meta: "prefilter.clean", tag: "FILTER", out: "− 128 noise" },
  { title: "Score buyer intent", meta: "claude-haiku-4-5 · pass 1", tag: "SCORE", out: "84 scored" },
  { title: "Escalate borderline 40–70", meta: "claude-sonnet-5 · pass 2", tag: "ESCALATE", out: "29 re-judged" },
  { title: "Ping #sales the moment it lands", meta: "notify.slack", tag: "ALERT", out: "6 alerts" },
];

const LEADS = [
  {
    src: "reddit",
    who: "u/marcusbuilds",
    score: 94,
    cat: "Buying signal",
    ago: "2m",
    text: "Our Notion setup has completely fallen over at 40 people. Budget approved, need something with real permissions by Q3 — what are people actually using?",
  },
  {
    src: "hn",
    who: "swyx_dev",
    score: 88,
    cat: "Switching",
    ago: "14m",
    text: "Finally hit the wall with Zapier pricing. Looking to move ~200 workflows somewhere saner this month.",
  },
  {
    src: "reddit",
    who: "u/hana_ops",
    score: 71,
    cat: "Complaint",
    ago: "31m",
    text: "Third outage this quarter and support still hasn't replied. Starting to look at alternatives seriously.",
  },
];

const SOURCES = [
  { name: "Reddit", meta: "OAuth · 6 subreddits", live: true, seed: 1284 },
  { name: "Hacker News", meta: "Algolia · no key needed", live: true, seed: 476 },
  { name: "X / Twitter", meta: "Recent search API", live: false, seed: 0 },
  { name: "G2", meta: "Review monitoring", live: false, seed: 0 },
];

const SCORING_ROWS = [
  { k: "Pass 1 · Haiku", d: "Scores every surviving mention 0–100. Cheap, fast, runs on everything.", pct: 100 },
  { k: "Pass 2 · Sonnet", d: "Re-judges only the borderline 40–70 band, where the call actually matters.", pct: 34 },
  { k: "Your feedback", d: "Every thumbs up/down writes a weight back into the next prompt.", pct: 62 },
];

/* ── motion helpers ────────────────────────────────────────────────────── */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Eases a number up to `target` whenever `run` flips true. */
function useCountUp(target: number, run: boolean, ms = 900) {
  const [n, setN] = useState(run ? 0 : target);
  useEffect(() => {
    if (!run) {
      setN(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return n;
}

/** Slowly climbing "live" counter. Starts deterministic, so SSR stays stable. */
function useTicker(start: number, run: boolean, everyMs = 2400) {
  const [n, setN] = useState(start);
  useEffect(() => {
    if (!run || start === 0) return;
    const t = setInterval(() => setN((v) => v + 1 + Math.floor(Math.random() * 3)), everyMs);
    return () => clearInterval(t);
  }, [run, start, everyMs]);
  return n;
}

/* ── icons ─────────────────────────────────────────────────────────────── */

type IconName = "inbox" | "search" | "globe" | "spark" | "flow" | "bell" | "gear" | "check";

const PATHS: Record<IconName, string> = {
  inbox: "M2 9h4l1 2h6l1-2h4M3 4h10l3 5v5H2V9l1-5Z",
  search: "M7.5 12.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM11 11l3.5 3.5",
  globe: "M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM1 8h14M8 1c3 3.5 3 10.5 0 14M8 1C5 4.5 5 11.5 8 15",
  spark: "M8 1.5 9.6 6l4.4 1.6L9.6 9.2 8 13.6 6.4 9.2 2 7.6 6.4 6 8 1.5Z",
  flow: "M4 2.5v3m0 0a1.5 1.5 0 1 0 0 3m0-3h5a1.5 1.5 0 0 1 1.5 1.5v0A1.5 1.5 0 0 1 9 9H4m0 4.5v-3",
  bell: "M8 2a4 4 0 0 0-4 4c0 3-1.5 4-1.5 4h11S12 9 12 6a4 4 0 0 0-4-4ZM6.5 13a1.5 1.5 0 0 0 3 0",
  gear: "M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6-2-1.6-.4a4.6 4.6 0 0 0-.5-1.2l.9-1.4-1.4-1.4-1.4.9a4.6 4.6 0 0 0-1.2-.5L8.4 2H7.6l-.4 1.6a4.6 4.6 0 0 0-1.2.5l-1.4-.9-1.4 1.4.9 1.4a4.6 4.6 0 0 0-.5 1.2L2 8v.8l1.6.4",
  check: "M3.5 8.5 6.5 11.5 12.5 5",
};

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden className={`shrink-0 ${className}`}>
      <path d={PATHS[name]} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── shared atoms ──────────────────────────────────────────────────────── */

/** Staggered child wrapper — every pane's rows cascade in. */
function Row({ i, children, className = "" }: { i: number; children: React.ReactNode; className?: string }) {
  return (
    <div className={`animate-fade-up ${className}`} style={{ animationDelay: `${i * 70}ms` }}>
      {children}
    </div>
  );
}

function ScorePill({ score, run }: { score: number; run: boolean }) {
  const n = useCountUp(score, run, 800);
  const tone = score >= 85 ? "text-signal" : score >= 70 ? "text-ink" : "text-static";
  return (
    <span className="flex shrink-0 items-center gap-1.5">
      <span className={`text-sm font-semibold tabular-nums ${tone}`}>{n}</span>
      <span className="relative h-1 w-10 overflow-hidden rounded-full bg-hairline">
        <span
          className="block h-full rounded-full bg-signal/70 transition-[width] duration-700 ease-out"
          style={{ width: `${run ? score : 0}%` }}
        />
      </span>
    </span>
  );
}

function SourceDot({ src }: { src: string }) {
  return (
    <span className="rounded bg-sunken px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-static">
      {src}
    </span>
  );
}

/* ── panes ─────────────────────────────────────────────────────────────── */

function PipelinePane({ step, reduced }: { step: number; reduced: boolean }) {
  const done = Math.min(step, PIPELINE_STEPS.length);
  return (
    <div className="bg-dot-grid flex h-full flex-col p-5 md:p-6">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        {PIPELINE_STEPS.map((s, i) => {
          const isDone = i < step;
          const isRunning = i === step;
          return (
            <div key={s.meta}>
              {i > 0 && (
                <div className="relative mx-auto h-5 w-px bg-divider">
                  <span
                    className="absolute inset-x-0 top-0 bottom-0 origin-top bg-signal transition-transform duration-500 ease-out"
                    style={{ transform: `scaleY(${isDone || isRunning ? 1 : 0})` }}
                  />
                  {/* Data packet riding the active edge */}
                  {isRunning && !reduced && (
                    <span className="absolute -left-[2.5px] h-1.5 w-1.5 animate-packet rounded-full bg-signal shadow-[0_0_7px_rgba(209,78,43,0.9)]" />
                  )}
                </div>
              )}

              <div
                className={`rounded-xl border bg-surface px-3.5 py-2.5 transition-all duration-500 ${
                  isRunning
                    ? `border-signal/50 ${reduced ? "shadow-[0_0_0_3px_rgba(209,78,43,0.10)]" : "animate-halo"}`
                    : isDone
                      ? "border-divider"
                      : "border-divider opacity-40"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold transition-colors duration-500 ${
                      isDone
                        ? "bg-signal text-white"
                        : isRunning
                          ? "bg-signal/15 text-signal"
                          : "bg-sunken text-static-soft"
                    }`}
                  >
                    {isDone ? <Icon name="check" className="h-3 w-3" /> : i + 1}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-ink">{s.title}</span>
                    <span className="mt-0.5 block truncate font-mono text-[11px] text-static-soft">
                      {s.meta}
                    </span>
                  </span>

                  {/* Output count fades in as the step completes */}
                  <span
                    className={`hidden shrink-0 font-mono text-[11px] tabular-nums transition-all duration-500 sm:block ${
                      isDone ? "text-signal opacity-100" : "opacity-0"
                    }`}
                  >
                    {s.out}
                  </span>

                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wide transition-colors duration-500 ${
                      isRunning ? "bg-signal/12 text-signal" : "bg-sunken text-static-soft"
                    }`}
                  >
                    {s.tag}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live run status */}
      <div className="mx-auto mt-4 flex w-full max-w-md items-center justify-between rounded-lg border border-divider bg-surface/80 px-3 py-2 backdrop-blur-sm">
        <span className="flex items-center gap-2 text-[11px] text-static">
          <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-success" />
          {done === PIPELINE_STEPS.length ? "Run complete" : `Running step ${done + 1} of ${PIPELINE_STEPS.length}`}
        </span>
        <span className="relative h-1 w-24 overflow-hidden rounded-full bg-hairline">
          <span
            className="block h-full rounded-full bg-signal transition-[width] duration-500 ease-out"
            style={{ width: `${(done / PIPELINE_STEPS.length) * 100}%` }}
          />
        </span>
      </div>
    </div>
  );
}

function LeadsPane({ run }: { run: boolean }) {
  return (
    <div className="h-full space-y-2.5 overflow-hidden p-5 md:p-6">
      {LEADS.map((l, i) => (
        <Row key={l.who} i={i}>
          <div
            className={`rounded-xl border border-divider bg-surface p-3.5 ${
              i === 0 && run ? "animate-flash" : ""
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2">
                <SourceDot src={l.src} />
                <span className="truncate text-[13px] font-medium text-ink">{l.who}</span>
                {i === 0 && (
                  <span className="shrink-0 rounded bg-signal/12 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-signal">
                    NEW
                  </span>
                )}
                <span className="hidden shrink-0 text-[11px] text-static-soft sm:inline">· {l.ago}</span>
              </span>
              <ScorePill score={l.score} run={run} />
            </div>
            <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-static">{l.text}</p>
          </div>
        </Row>
      ))}
      <Row i={LEADS.length}>
        <p className="pt-0.5 text-center text-[11px] text-static-soft">
          Sorted by intent — noise never reaches this list.
        </p>
      </Row>
    </div>
  );
}

function SourcesPane({ run }: { run: boolean }) {
  return (
    <div className="grid h-full grid-cols-1 content-start gap-2.5 overflow-hidden p-5 sm:grid-cols-2 md:p-6">
      {SOURCES.map((s, i) => (
        <Row key={s.name} i={i}>
          <SourceCard {...s} run={run} />
        </Row>
      ))}
    </div>
  );
}

function SourceCard({
  name,
  meta,
  live,
  seed,
  run,
}: (typeof SOURCES)[number] & { run: boolean }) {
  const count = useTicker(seed, run);
  return (
    <div className={`rounded-xl border border-divider bg-surface p-3.5 ${live ? "" : "opacity-55"}`}>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-ink">{name}</span>
        <span className={`flex items-center gap-1.5 text-[11px] ${live ? "text-success" : "text-static-soft"}`}>
          {live && <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-success" />}
          {live ? "Connected" : "Coming soon"}
        </span>
      </div>
      <p className="mt-1.5 font-mono text-[11px] text-static-soft">{meta}</p>
      {live && (
        <p className="mt-2 font-mono text-[11px] tabular-nums text-static">
          <span className="text-ink">{count.toLocaleString()}</span> mentions this week
        </p>
      )}
    </div>
  );
}

function ScoringPane({ run }: { run: boolean }) {
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 overflow-hidden p-5 md:p-6">
      {SCORING_ROWS.map((r, i) => (
        <Row key={r.k} i={i}>
          <div className="rounded-xl border border-divider bg-surface p-3.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[13px] font-medium text-ink">{r.k}</span>
              <span className="font-mono text-[11px] tabular-nums text-static-soft">
                {r.pct}% of batch
              </span>
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-static">{r.d}</p>
            <span className="relative mt-2.5 block h-1 overflow-hidden rounded-full bg-hairline">
              <span
                className="block h-full rounded-full bg-signal/70 transition-[width] duration-1000 ease-out"
                style={{ width: run ? `${r.pct}%` : "0%", transitionDelay: `${i * 120}ms` }}
              />
            </span>
          </div>
        </Row>
      ))}
    </div>
  );
}

function AlertsPane() {
  return (
    <div className="flex h-full flex-col justify-center overflow-hidden p-5 md:p-6">
      <Row i={0}>
        <div className="rounded-xl border border-divider bg-surface p-4">
          <div className="flex items-center gap-2 border-b border-hairline pb-2.5">
            <span className="h-2 w-2 rounded-full bg-signal" />
            <span className="text-[13px] font-medium text-ink">#sales</span>
            <span className="text-[11px] text-static-soft">· Slack</span>
            <span className="ml-auto flex items-center gap-1.5 text-[11px] text-success">
              <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-success" />
              delivered
            </span>
          </div>
          <div className="space-y-2 pt-3">
            <Row i={1}>
              <p className="text-[13px] font-medium text-ink">
                👂 New 94/100 lead on Reddit — Buying signal
              </p>
            </Row>
            <Row i={2}>
              <p className="border-l-2 border-divider pl-3 text-[12px] leading-relaxed text-static">
                “Our Notion setup has completely fallen over at 40 people. Budget approved,
                need something with real permissions by Q3…”
              </p>
            </Row>
            <Row i={3}>
              <p className="text-[12px] text-static">
                <span className="font-medium text-ink">💬 Reply angle:</span> Lead with the
                permissions model and the 40-seat migration path.
              </p>
            </Row>
            <Row i={4}>
              <p className="font-mono text-[11px] text-signal">Open the thread →</p>
            </Row>
          </div>
        </div>
      </Row>
      <Row i={5}>
        <p className="mt-3 text-center text-[11px] text-static-soft">
          Fires the second a lead clears your score threshold.
        </p>
      </Row>
    </div>
  );
}

/* ── shell ─────────────────────────────────────────────────────────────── */

const HEADERS: Record<Tab, { crumb: string; label: string; count: number; suffix: string }> = {
  "Lead feed": { crumb: "Leads", label: "High intent", count: 38, suffix: "new today" },
  Sources: { crumb: "Sources", label: "Connections", count: 2, suffix: "live" },
  Scoring: { crumb: "Scoring", label: "Two-pass engine", count: 1204, suffix: "scored" },
  Pipeline: { crumb: "Pipeline", label: "Buyer-intent run", count: 142, suffix: "runs today" },
  Alerts: { crumb: "Alerts", label: "Slack", count: 80, suffix: "min score" },
};

export function ProductShowcase() {
  const reduced = useReducedMotion();
  const [tabIdx, setTabIdx] = useState(3); // open on Pipeline — the animated one
  const [paused, setPaused] = useState(false);
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  const tab = TABS[tabIdx];
  const header = HEADERS[tab];

  // Gate entry animations until after hydration so SSR markup matches.
  useEffect(() => setMounted(true), []);

  // Tab carousel
  useEffect(() => {
    if (reduced || paused) return;
    const t = setInterval(() => setTabIdx((i) => (i + 1) % TABS.length), 6500);
    return () => clearInterval(t);
  }, [reduced, paused]);

  // Pipeline step runner — only ticks while its pane is on screen
  useEffect(() => {
    if (reduced || tab !== "Pipeline") return;
    setStep(0);
    const t = setInterval(
      () => setStep((s) => (s >= PIPELINE_STEPS.length ? 0 : s + 1)),
      950,
    );
    return () => clearInterval(t);
  }, [reduced, tab]);

  const run = mounted && !reduced;
  const headerCount = useCountUp(header.count, run);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Tab strip */}
      <div className="flex justify-center">
        <div
          role="tablist"
          aria-label="Product surfaces"
          className="flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-ink/[0.06] bg-paper/70 p-1.5 shadow-pill backdrop-blur-xl"
        >
          {TABS.map((t, i) => {
            const active = i === tabIdx;
            return (
              <button
                key={t}
                role="tab"
                aria-selected={active}
                onClick={() => setTabIdx(i)}
                className={`relative shrink-0 rounded-xl px-4 py-2 text-[13px] font-medium transition-all duration-300 md:px-5 ${
                  active ? "bg-surface text-ink shadow-sm" : "text-static hover:text-ink"
                }`}
              >
                {t}
                {active && (
                  <span className="absolute inset-x-4 bottom-1 h-0.5 origin-left animate-[fade-up_0.4s_ease-out] rounded-full bg-ink" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* App card */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-ink/[0.08] bg-surface shadow-float">
        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden w-[190px] shrink-0 border-r border-divider bg-veil p-3 md:block">
            <div className="space-y-0.5">
              {SIDEBAR.map((item) => {
                const active = item.tab === tab;
                return (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-all duration-300 ${
                      active ? "bg-surface font-medium text-ink shadow-xs" : "text-static"
                    }`}
                  >
                    <Icon name={item.icon} className={active ? "text-signal" : ""} />
                    {item.label}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Main */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3 border-b border-divider px-4 py-3 md:px-5">
              <p className="truncate text-[13px] text-static">
                {header.crumb}
                <span className="mx-1.5 text-static-soft">/</span>
                <span className="font-medium text-ink">{header.label}</span>
              </p>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="hidden items-center gap-1.5 rounded-full border border-divider px-2.5 py-1 text-[11px] text-static sm:flex">
                  <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-success" />
                  live
                </span>
                <span className="rounded-full border border-divider px-2.5 py-1 font-mono text-[11px] tabular-nums text-static">
                  {headerCount.toLocaleString()} {header.suffix}
                </span>
              </div>
            </div>

            {/* key={tab} restarts every child animation on switch */}
            <div key={tab} className="h-[340px] animate-pane-in bg-veil/40 sm:h-[380px]">
              {tab === "Pipeline" && <PipelinePane step={step} reduced={reduced} />}
              {tab === "Lead feed" && <LeadsPane run={run} />}
              {tab === "Sources" && <SourcesPane run={run} />}
              {tab === "Scoring" && <ScoringPane run={run} />}
              {tab === "Alerts" && <AlertsPane />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
