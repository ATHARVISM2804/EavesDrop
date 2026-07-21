// Orbital "coverage" section — sources arranged around a central listener with
// a slow radar sweep rotating over them. The radar metaphor is the point:
// Eavesdrop listens across every channel at once.
//
// Pure-CSS motion (spin + drift + pulse), so this stays a server component and
// costs nothing at runtime. All animation halts under prefers-reduced-motion
// via the global rule in globals.css.

/* ── brand marks ───────────────────────────────────────────────────────── */

/** Colored letter badge — for brands whose logo is essentially a wordmark. */
function Badge({
  children,
  bg,
  round = false,
}: {
  children: React.ReactNode;
  bg: string;
  round?: boolean;
}) {
  return (
    <span
      className={`flex h-8 w-8 items-center justify-center font-bold text-white ${
        round ? "rounded-full" : "rounded-[7px]"
      }`}
      style={{ backgroundColor: bg }}
    >
      {children}
    </span>
  );
}

const Reddit = (
  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
    <circle cx="17.6" cy="5.6" r="1.7" fill="#FF4500" />
    <path d="M12 7.4 16.4 5.9" stroke="#FF4500" strokeWidth="1.1" strokeLinecap="round" />
    <circle cx="12" cy="13.4" r="8.4" fill="#FF4500" />
    <circle cx="8.7" cy="13" r="1.55" fill="#fff" />
    <circle cx="15.3" cy="13" r="1.55" fill="#fff" />
    <path d="M8.7 16.1c1.8 1.5 4.8 1.5 6.6 0" stroke="#fff" strokeWidth="1.3" fill="none" strokeLinecap="round" />
  </svg>
);

const XMark = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="#0A0B0D" aria-hidden>
    <path d="M18.9 1.6h3.7l-8 9.2 9.4 12.4h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.6h7.6l5.2 6.9 6.1-6.9Zm-1.3 19.4h2L6.5 3.7H4.4l13.2 17.3Z" />
  </svg>
);

const Discord = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#5865F2" aria-hidden>
    <path d="M19.5 5.6A17 17 0 0 0 15.2 4l-.3.5a13 13 0 0 1 3.7 1.9 15.6 15.6 0 0 0-13.2 0A13 13 0 0 1 9.1 4.5L8.8 4A17 17 0 0 0 4.5 5.6C1.8 9.7 1 13.6 1.4 17.5a17 17 0 0 0 5.2 2.6l.6-1a11 11 0 0 1-1.8-.9l.4-.3a12 12 0 0 0 10.4 0l.4.3c-.6.4-1.2.7-1.8.9l.6 1a17 17 0 0 0 5.2-2.6c.5-4.5-.8-8.4-2.9-11.9ZM8.7 15.1c-1 0-1.9-.9-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1Zm6.6 0c-1 0-1.9-.9-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1Z" />
  </svg>
);

/* ── layout: scattered around the rings (top / left in %) ──────────────── */

type Mark = { key: string; node: React.ReactNode; top: string; left: string; delay: string };

const MARKS: Mark[] = [
  { key: "reddit", node: Reddit, top: "9%", left: "58%", delay: "0s" },
  { key: "hn", node: <Badge bg="#FF6600">Y</Badge>, top: "20%", left: "30%", delay: "1.1s" },
  { key: "x", node: XMark, top: "44%", left: "12%", delay: "2.1s" },
  { key: "g2", node: <Badge bg="#EF492D"><span className="text-[10px]">G2</span></Badge>, top: "72%", left: "22%", delay: "0.7s" },
  { key: "ph", node: <Badge bg="#DA552F" round>P</Badge>, top: "84%", left: "52%", delay: "1.6s" },
  { key: "capterra", node: <Badge bg="#044D80"><span className="text-[10px]">Ca</span></Badge>, top: "76%", left: "80%", delay: "2.5s" },
  { key: "discord", node: Discord, top: "40%", left: "87%", delay: "0.4s" },
  { key: "linkedin", node: <Badge bg="#0A66C2"><span className="text-[11px] lowercase">in</span></Badge>, top: "16%", left: "78%", delay: "1.9s" },
];

function Ring({ size }: { size: string }) {
  return (
    <span
      aria-hidden
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-divider/80"
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
      <div className="relative mx-auto mt-16 aspect-square w-full max-w-[540px]">
        <Ring size="100%" />
        <Ring size="66%" />
        <Ring size="34%" />

        {/* Soft center glow for depth */}
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/[0.07] blur-3xl"
        />

        {/* Radar sweep — a soft rotating beam with a bright leading edge */}
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full [animation-duration:16s]"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(209,78,43,0) 0deg, rgba(209,78,43,0) 248deg, rgba(209,78,43,0.05) 332deg, rgba(209,78,43,0.15) 356deg, rgba(209,78,43,0.32) 360deg)",
            WebkitMaskImage: "radial-gradient(circle, #000 48%, rgba(0,0,0,0.4) 60%, transparent 67%)",
            maskImage: "radial-gradient(circle, #000 48%, rgba(0,0,0,0.4) 60%, transparent 67%)",
          }}
        />

        {/* Source chips */}
        {MARKS.map((m) => (
          <span
            key={m.key}
            className="absolute flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 animate-drift items-center justify-center rounded-2xl border border-divider bg-surface shadow-sm"
            style={{ top: m.top, left: m.left, animationDelay: m.delay }}
          >
            {m.node}
          </span>
        ))}

        {/* Center hub — the listener */}
        <span className="absolute left-1/2 top-1/2 flex h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-divider bg-surface shadow-md">
          <span aria-hidden className="absolute inset-0 animate-live-pulse rounded-2xl ring-2 ring-signal/25" />
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="16" r="1.9" className="fill-signal" />
            <path d="M8 12.5a5.7 5.7 0 0 1 8 0" stroke="#D14E2B" strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />
            <path d="M5.4 9.6a9.5 9.5 0 0 1 13.2 0" stroke="#D14E2B" strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
          </svg>
        </span>
      </div>

      <p className="mt-12 text-center text-xs text-static-soft">
        New sources land continuously — you never reconfigure a thing.
      </p>
    </section>
  );
}
