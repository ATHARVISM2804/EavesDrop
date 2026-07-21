"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    n: "01",
    title: "Tell us your market",
    body: "Describe what you sell, drop in a few keywords and competitors, and pick the sources you want watched. Setup takes under a minute.",
    pills: ["Works for any niche", "Setup in minutes"],
  },
  {
    n: "02",
    title: "Eavesdrop surfaces the signals",
    body: "We poll every source, filter out the noise before it costs a cent, and score what's left with a two-pass AI engine — cheap first, careful on the close calls.",
    pills: ["Buying-intent detection", "Competitor & keyword monitors"],
  },
  {
    n: "03",
    title: "Turn signals into pipeline",
    body: "Work a ranked feed of real buyers, use the suggested reply angle to open the conversation, and thumbs up or down to sharpen every future score.",
    pills: ["Ranked by intent", "Learns from your feedback"],
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      className="grain relative scroll-mt-20 overflow-hidden border-y border-divider bg-ink py-24 text-paper"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-signal/15 blur-3xl"
      />
      <div className="container-content">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-signal">
            <span className="h-px w-5 bg-signal/60" />
            How it works
          </span>
          <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            From market to pipeline in three steps.
          </h2>
        </div>

        <div ref={ref} className="relative mt-16 max-w-3xl">
          {/* Timeline track + animated progress */}
          <div aria-hidden className="absolute bottom-8 left-7 top-8 w-px bg-paper/15" />
          <div
            aria-hidden
            className="absolute left-7 top-8 w-px origin-top bg-gradient-to-b from-signal to-signal/40 transition-transform duration-[1400ms] ease-out"
            style={{
              height: "calc(100% - 4rem)",
              transform: inView ? "scaleY(1)" : "scaleY(0)",
            }}
          />

          <div className="space-y-8">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className="relative flex gap-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transitionDelay: `${i * 180}ms`,
                  opacity: inView ? 1 : 0,
                  transform: inView ? "none" : "translateY(16px)",
                }}
              >
                {/* Node */}
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-paper/15 bg-ink-soft font-serif text-xl font-semibold text-signal">
                  {s.n}
                </div>

                {/* Content */}
                <div className="flex-1 rounded-xl border border-paper/10 bg-ink-soft/60 p-6 transition-colors hover:border-signal/30">
                  <h3 className="text-xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper/60">{s.body}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {s.pills.map((p) => (
                      <span
                        key={p}
                        className="rounded-full border border-paper/15 px-3 py-1 text-xs text-paper/70"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
