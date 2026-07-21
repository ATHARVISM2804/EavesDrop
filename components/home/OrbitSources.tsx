// Orbital "coverage" section — sources arranged around a central listener with
// a slow radar sweep rotating over them. The radar metaphor is the whole point:
// Eavesdrop is listening across every channel at once.
//
// Pure CSS motion (spin + drift + pulse), so this stays a server component and
// costs nothing at runtime. All animation halts under prefers-reduced-motion
// via the global rule in globals.css.

type Mark = { key: string; node: React.ReactNode; top: string; left: string; delay: string };

/* Small monochrome channel glyphs, scattered across the rings like the ref. */
const MARKS: Mark[] = [
  {
    key: "reddit",
    top: "10%",
    left: "64%",
    delay: "0s",
    node: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
        <path d="M12 8c2.6 0 4.9.9 6.3 2.2.3-.2.6-.3 1-.3a1.7 1.7 0 0 1 1 3.1c0 .3.1.5.1.8 0 3-3.8 5.4-8.4 5.4S3.6 16.8 3.6 13.8c0-.3 0-.5.1-.8a1.7 1.7 0 0 1 1-3.1c.4 0 .7.1 1 .3C7.1 8.9 9.4 8 12 8Zm0-5.5.9 4.2c1.6.1 3 .5 4.1 1.1a1.4 1.4 0 1 1 .6 1.9" strokeLinecap="round" />
        <circle cx="8.4" cy="13" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="15.6" cy="13" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  { key: "hn", top: "26%", left: "26%", delay: "1.1s", node: <span className="text-[13px] font-bold">Y</span> },
  {
    key: "x",
    top: "48%",
    left: "12%",
    delay: "2.2s",
    node: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.9 1.6h3.7l-8 9.2 9.4 12.4h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.6h7.6l5.2 6.9 6.1-6.9Zm-1.3 19.4h2L6.5 3.7H4.4l13.2 17.3Z" />
      </svg>
    ),
  },
  { key: "g2", top: "74%", left: "24%", delay: "0.6s", node: <span className="text-[11px] font-bold">G2</span> },
  { key: "capterra", top: "80%", left: "62%", delay: "1.7s", node: <span className="text-[10px] font-bold tracking-tight">CAP</span> },
  {
    key: "slack",
    top: "52%",
    left: "84%",
    delay: "0.3s",
    node: <span className="text-[15px] font-bold">#</span>,
  },
  {
    key: "discord",
    top: "24%",
    left: "82%",
    delay: "2.6s",
    node: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M19.5 5.6A17 17 0 0 0 15.2 4l-.3.5a13 13 0 0 1 3.7 1.9 15.6 15.6 0 0 0-13.2 0A13 13 0 0 1 9.1 4.5L8.8 4A17 17 0 0 0 4.5 5.6C1.8 9.7 1 13.6 1.4 17.5a17 17 0 0 0 5.2 2.6l.6-1a11 11 0 0 1-1.8-.9l.4-.3a12 12 0 0 0 10.4 0l.4.3c-.6.4-1.2.7-1.8.9l.6 1a17 17 0 0 0 5.2-2.6c.5-4.5-.8-8.4-2.9-11.9ZM8.7 15.1c-1 0-1.9-.9-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1Zm6.6 0c-1 0-1.9-.9-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1Z" />
      </svg>
    ),
  },
];

function Ring({ size }: { size: string }) {
  return (
    <span
      aria-hidden
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-divider"
      style={{ width: size, height: size }}
    />
  );
}

export function OrbitSources() {
  return (
    <section className="section-tight">
      <div className="container-content text-center">
        <span className="eyebrow">Coverage</span>
        <h2 className="display-2 mx-auto mt-4 max-w-2xl text-ink">
          We listen everywhere your buyers do.
        </h2>
        <p className="lead mx-auto mt-5 max-w-xl">
          Reddit, Hacker News, X, review sites — every channel where a buying
          decision gets discussed, funnelled into one scored feed.
        </p>
      </div>

      {/* Orbit */}
      <div className="relative mx-auto mt-14 aspect-square w-full max-w-[520px]">
        <Ring size="100%" />
        <Ring size="68%" />
        <Ring size="38%" />

        {/* Radar sweep — the listening beam, rotating slowly over the sources */}
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full [animation-duration:14s] [mask-image:radial-gradient(circle,#000_62%,transparent_63%)]"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, transparent 296deg, rgba(209,78,43,0.14) 352deg, rgba(209,78,43,0.28) 360deg)",
          }}
        />
        {/* Soft center glow */}
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/10 blur-2xl"
        />

        {/* Source chips */}
        {MARKS.map((m) => (
          <span
            key={m.key}
            className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-drift items-center justify-center rounded-2xl border border-divider bg-surface text-ink shadow-sm"
            style={{ top: m.top, left: m.left, animationDelay: m.delay }}
          >
            {m.node}
          </span>
        ))}

        {/* Center hub — the listener */}
        <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-divider bg-surface shadow-md">
          <span aria-hidden className="absolute inset-0 animate-live-pulse rounded-2xl ring-2 ring-signal/25" />
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
            {/* concentric "signal" arcs + core — the listening mark */}
            <circle cx="12" cy="15" r="1.8" className="fill-signal" />
            <path d="M8 12a5.6 5.6 0 0 1 8 0M5.5 9.2a9.4 9.4 0 0 1 13 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-signal/60" />
          </svg>
        </span>
      </div>

      <p className="mt-10 text-center text-xs text-static-soft">
        New sources land continuously — you never reconfigure a thing.
      </p>
    </section>
  );
}
