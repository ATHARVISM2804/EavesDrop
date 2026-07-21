"use client";

import { useEffect, useState } from "react";

/**
 * Hero product showcase — a tabbed, self-running mock of the Eavesdrop app.
 *
 * Every tab is alive, not just Pipeline:
 *  • Lead feed  — a scanning sweep + a lead that periodically flashes in as NEW.
 *  • Sources    — per-source live sparklines, ticking mention counts + sync clock.
 *  • Scoring    — a processing queue flowing Haiku → Sonnet, bars that fill.
 *  • Pipeline   — nodes light in sequence, connectors fill, a packet rides the edge.
 *  • Alerts     — a Slack alert delivering, with a live "delivered" pulse.
 *
 * The pipeline steps mirror the real implementation in lib/pipeline/.
 * Every loop halts under prefers-reduced-motion; the tab cycle pauses on
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
    src: "reddit" as const,
    who: "u/marcusbuilds",
    score: 94,
    cat: "Buying signal",
    ago: "2m",
    text: "Our Notion setup has completely fallen over at 40 people. Budget approved, need something with real permissions by Q3 — what are people actually using?",
  },
  {
    src: "hn" as const,
    who: "swyx_dev",
    score: 88,
    cat: "Switching",
    ago: "14m",
    text: "Finally hit the wall with Zapier pricing. Looking to move ~200 workflows somewhere saner this month.",
  },
  {
    src: "reddit" as const,
    who: "u/hana_ops",
    score: 71,
    cat: "Complaint",
    ago: "31m",
    text: "Third outage this quarter and support still hasn't replied. Starting to look at alternatives seriously.",
  },
];

const SOURCES = [
  { name: "Reddit", src: "reddit" as const, meta: "OAuth · 6 subreddits", live: true, seed: 1284, spark: [4, 7, 5, 9, 6, 8, 5, 7, 9, 6, 8, 10] },
  { name: "Hacker News", src: "hn" as const, meta: "Algolia · no key needed", live: true, seed: 476, spark: [3, 5, 4, 6, 5, 4, 7, 5, 6, 8, 6, 7] },
  { name: "X / Twitter", src: "x" as const, meta: "Recent search API", live: false, seed: 0, spark: [] },
  { name: "G2", src: "g2" as const, meta: "Review monitoring", live: false, seed: 0, spark: [] },
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

/** Slowly climbing "live" counter. Deterministic start keeps SSR stable. */
function useTicker(start: number, run: boolean, everyMs = 2400) {
  const [n, setN] = useState(start);
  useEffect(() => {
    if (!run || start === 0) return;
    const t = setInterval(() => setN((v) => v + 1 + Math.floor(Math.random() * 3)), everyMs);
    return () => clearInterval(t);
  }, [run, start, everyMs]);
  return n;
}

/** "Last sync" seconds counter that climbs then resets — feels like polling. */
function useSyncClock(run: boolean) {
  const [s, setS] = useState(6);
  useEffect(() => {
    if (!run) return;
    const t = setInterval(() => setS((v) => (v >= 18 ? 1 : v + 1)), 1000);
    return () => clearInterval(t);
  }, [run]);
  return s;
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

type SourceKey = "reddit" | "hn" | "x" | "g2";

/** Small monochrome brand glyph for each source, in a rounded chip. */
function SourceGlyph({ src, live }: { src: SourceKey; live: boolean }) {
  const glyph = {
    reddit: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 8c2.6 0 4.9.9 6.3 2.2.3-.2.6-.3 1-.3a1.7 1.7 0 0 1 1 3.1c0 .3.1.5.1.8 0 3-3.8 5.4-8.4 5.4S3.6 16.8 3.6 13.8c0-.3 0-.5.1-.8a1.7 1.7 0 0 1 1-3.1c.4 0 .7.1 1 .3C7.1 8.9 9.4 8 12 8Zm0-5.5.9 4.2c1.6.1 3 .5 4.1 1.1a1.4 1.4 0 1 1 .6 1.9M8.4 14.2a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Zm7.2 0a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Zm-7 2.4c1 .9 2.3 1.2 3.4 1.2s2.4-.3 3.4-1.2" stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      </svg>
    ),
    hn: <span className="text-[11px] font-bold">Y</span>,
    x: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.9 1.6h3.7l-8 9.2 9.4 12.4h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.6h7.6l5.2 6.9 6.1-6.9Zm-1.3 19.4h2L6.5 3.7H4.4l13.2 17.3Z" />
      </svg>
    ),
    g2: <span className="text-[10px] font-bold">G2</span>,
  }[src];

  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
        live ? "border-divider bg-surface text-ink" : "border-hairline bg-sunken text-static-soft"
      }`}
    >
      {glyph}
    </span>
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

/** Live sparkline — bars breathe at staggered delays (pure CSS, no state). */
function Sparkline({ data, run }: { data: number[]; run: boolean }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex h-8 items-end gap-[3px]" aria-hidden>
      {data.map((v, i) => (
        <span
          key={i}
          className={`w-1 origin-bottom rounded-full bg-signal/60 ${run ? "animate-bars" : ""}`}
          style={{ height: `${(v / max) * 100}%`, animationDelay: `${i * 90}ms` }}
        />
      ))}
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

/* ── panes ─────────────────────────────────────────────────────────────── */

function PipelinePane({ step, reduced }: { step: number; reduced: boolean }) {
  const done = Math.min(step, PIPELINE_STEPS.length);
  return (
    <div className="bg-dot-grid flex h-full flex-col p-5 md:p-7">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
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
                      isDone ? "bg-signal text-white" : isRunning ? "bg-signal/15 text-signal" : "bg-sunken text-static-soft"
                    }`}
                  >
                    {isDone ? <Icon name="check" className="h-3 w-3" /> : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-ink">{s.title}</span>
                    <span className="mt-0.5 block truncate font-mono text-[11px] text-static-soft">{s.meta}</span>
                  </span>
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

      <div className="mx-auto flex w-full max-w-md items-center justify-between rounded-lg border border-divider bg-surface/80 px-3 py-2 backdrop-blur-sm">
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
  // Periodically re-flash the top lead so the feed feels live.
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    if (!run) return;
    const t = setInterval(() => setPulse((p) => p + 1), 4200);
    return () => clearInterval(t);
  }, [run]);

  return (
    <div className="relative h-full overflow-hidden p-5 md:p-7">
      {/* Scanning sweep — reads as "listening across sources right now" */}
      {run && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 z-10 h-16 animate-scan bg-[linear-gradient(180deg,transparent,rgba(209,78,43,0.06),transparent)]"
        />
      )}

      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-[11px] text-static">
          <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-signal" />
          Scanning Reddit · Hacker News
        </span>
        <span className="font-mono text-[11px] text-static-soft">sorted by intent</span>
      </div>

      <div className="space-y-2.5">
        {LEADS.map((l, i) => (
          <Row key={l.who} i={i}>
            {/* key={pulse} remounts the top card each tick so the flash replays */}
            <div
              key={i === 0 ? pulse : "static"}
              className={`rounded-xl border border-divider bg-surface p-3.5 ${
                i === 0 && run ? "animate-flash" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2">
                  <SourceGlyph src={l.src} live />
                  <span className="flex min-w-0 flex-col">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[13px] font-medium text-ink">{l.who}</span>
                      {i === 0 && (
                        <span className="shrink-0 rounded bg-signal/12 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-signal">
                          NEW
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-static-soft">{l.cat} · {l.ago} ago</span>
                  </span>
                </span>
                <ScorePill score={l.score} run={run} />
              </div>
              <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-static">{l.text}</p>
            </div>
          </Row>
        ))}
      </div>
    </div>
  );
}

function SourcesPane({ run }: { run: boolean }) {
  const sync = useSyncClock(run);
  return (
    <div className="flex h-full flex-col p-5 md:p-7">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2 text-[11px] text-static">
          <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-success" />
          Polling every 5 min
        </span>
        <span className="font-mono text-[11px] tabular-nums text-static-soft">last sync {sync}s ago</span>
      </div>

      <div className="grid flex-1 grid-cols-1 content-start gap-3 sm:grid-cols-2">
        {SOURCES.map((s, i) => (
          <Row key={s.name} i={i}>
            <SourceCard {...s} run={run} />
          </Row>
        ))}
      </div>
    </div>
  );
}

function SourceCard({
  name,
  src,
  meta,
  live,
  seed,
  spark,
  run,
}: (typeof SOURCES)[number] & { run: boolean }) {
  const count = useTicker(seed, run);
  return (
    <div className={`rounded-xl border border-divider bg-surface p-4 ${live ? "" : "opacity-60"}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="flex items-center gap-2.5">
          <SourceGlyph src={src} live={live} />
          <span className="flex flex-col">
            <span className="text-[13px] font-medium text-ink">{name}</span>
            <span className="font-mono text-[10px] text-static-soft">{meta}</span>
          </span>
        </span>
        <span className={`flex items-center gap-1.5 text-[11px] ${live ? "text-success" : "text-static-soft"}`}>
          {live && <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-success" />}
          {live ? "Connected" : "Coming soon"}
        </span>
      </div>

      {live ? (
        <div className="mt-3 flex items-end justify-between gap-3">
          <span className="font-mono text-[11px] tabular-nums text-static">
            <span className="text-base font-semibold text-ink">{count.toLocaleString()}</span>
            <span className="ml-1">mentions / wk</span>
          </span>
          <Sparkline data={spark} run={run} />
        </div>
      ) : (
        <div className="mt-3 h-8 rounded-md border border-dashed border-hairline" />
      )}
    </div>
  );
}

function ScoringPane({ run }: { run: boolean }) {
  return (
    <div className="flex h-full flex-col p-5 md:p-7">
      {/* Live processing queue — chips flow Haiku → (borderline) → Sonnet */}
      <div className="mb-4 rounded-xl border border-divider bg-surface p-3">
        <div className="mb-2 flex items-center justify-between text-[11px] text-static">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-signal" />
            Scoring queue
          </span>
          <span className="font-mono text-static-soft">two-pass</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[68, 42, 91, 55, 12, 77, 39, 84].map((v, i) => (
            <span
              key={i}
              className={`h-6 flex-1 rounded-md text-center text-[9px] font-semibold leading-6 tabular-nums ${
                v >= 40 && v <= 70
                  ? "bg-signal/15 text-signal"
                  : v >= 85
                    ? "bg-signal/80 text-white"
                    : "bg-sunken text-static"
              } ${run ? "animate-fade-up" : ""}`}
              style={{ animationDelay: `${i * 90}ms` }}
            >
              {v}
            </span>
          ))}
        </div>
        <p className="mt-2 text-[10px] text-static-soft">
          <span className="text-signal">Amber</span> = 40–70 borderline, escalated to Sonnet.
        </p>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-2.5">
        {SCORING_ROWS.map((r, i) => (
          <Row key={r.k} i={i}>
            <div className="rounded-xl border border-divider bg-surface p-3.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[13px] font-medium text-ink">{r.k}</span>
                <span className="font-mono text-[11px] tabular-nums text-static-soft">{r.pct}% of batch</span>
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
    </div>
  );
}

function AlertsPane({ run }: { run: boolean }) {
  return (
    <div className="flex h-full flex-col justify-center p-5 md:p-7">
      <Row i={0}>
        <div className="rounded-xl border border-divider bg-surface p-4">
          <div className="flex items-center gap-2 border-b border-hairline pb-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sunken text-[11px] font-bold text-ink">#</span>
            <span className="text-[13px] font-medium text-ink">sales</span>
            <span className="text-[11px] text-static-soft">· Slack</span>
            <span className="ml-auto flex items-center gap-1.5 text-[11px] text-success">
              <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-success" />
              delivered
            </span>
          </div>
          <div className="space-y-2 pt-3">
            <Row i={1}>
              <p className="text-[13px] font-medium text-ink">👂 New 94/100 lead on Reddit — Buying signal</p>
            </Row>
            <Row i={2}>
              <p className="border-l-2 border-signal/40 pl-3 text-[12px] leading-relaxed text-static">
                “Our Notion setup has completely fallen over at 40 people. Budget approved, need something with real
                permissions by Q3…”
              </p>
            </Row>
            <Row i={3}>
              <p className="text-[12px] text-static">
                <span className="font-medium text-ink">💬 Reply angle:</span> Lead with the permissions model and the
                40-seat migration path.
              </p>
            </Row>
            <Row i={4}>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-sunken px-2.5 py-1 font-mono text-[11px] text-signal">
                Open the thread →
              </span>
            </Row>
          </div>
        </div>
      </Row>
      <Row i={5}>
        <p className="mt-3 flex items-center justify-center gap-2 text-center text-[11px] text-static-soft">
          {run && <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-signal" />}
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

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (reduced || paused) return;
    const t = setInterval(() => setTabIdx((i) => (i + 1) % TABS.length), 6500);
    return () => clearInterval(t);
  }, [reduced, paused]);

  useEffect(() => {
    if (reduced || tab !== "Pipeline") return;
    setStep(0);
    const t = setInterval(() => setStep((s) => (s >= PIPELINE_STEPS.length ? 0 : s + 1)), 950);
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
          className="flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-white/40 bg-paper/55 p-1.5 shadow-pill backdrop-blur-xl backdrop-saturate-150"
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
            <div key={tab} className="h-[430px] animate-pane-in bg-veil/40 sm:h-[470px]">
              {tab === "Pipeline" && <PipelinePane step={step} reduced={reduced} />}
              {tab === "Lead feed" && <LeadsPane run={run} />}
              {tab === "Sources" && <SourcesPane run={run} />}
              {tab === "Scoring" && <ScoringPane run={run} />}
              {tab === "Alerts" && <AlertsPane run={run} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
