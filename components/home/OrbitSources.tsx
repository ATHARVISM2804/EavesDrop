// Orbital "coverage" section — source logos revolving around the Eavesdrop
// mark. Two rings turn at different speeds and opposite directions; each chip
// counter-rotates at the same duration so the logos stay upright while their
// orbit carries them around.
//
// Pure-CSS motion, so this stays a server component and costs nothing at
// runtime. Everything halts under prefers-reduced-motion via globals.css.

import { LogoMark } from "@/components/Logo";

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

type Mark = { key: string; node: React.ReactNode };

/** Outer ring — the primary listening surfaces. */
const OUTER: Mark[] = [
  { key: "reddit", node: Reddit },
  { key: "x", node: XMark },
  { key: "hn", node: <Badge bg="#FF6600">Y</Badge> },
  { key: "linkedin", node: <Badge bg="#0A66C2"><span className="text-[11px] lowercase">in</span></Badge> },
];

/** Inner ring — review sites & communities. */
const INNER: Mark[] = [
  { key: "g2", node: <Badge bg="#EF492D"><span className="text-[10px]">G2</span></Badge> },
  { key: "ph", node: <Badge bg="#DA552F" round>P</Badge> },
  { key: "capterra", node: <Badge bg="#044D80"><span className="text-[10px]">Ca</span></Badge> },
  { key: "discord", node: Discord },
];

/* ── orbit ─────────────────────────────────────────────────────────────── */

/**
 * One revolving ring. The wrapper spins; each chip spins the opposite way at
 * the same duration, cancelling the rotation so logos never turn upside down.
 */
function Orbit({
  items,
  radius,
  duration,
  startDeg,
  reverse = false,
}: {
  items: Mark[];
  radius: number; // % of container half-width
  duration: number; // seconds per revolution
  startDeg: number;
  reverse?: boolean;
}) {
  return (
    <div
      className="absolute inset-0 animate-spin"
      style={{
        animationDuration: `${duration}s`,
        animationDirection: reverse ? "reverse" : "normal",
      }}
    >
      {items.map((m, i) => {
        const deg = startDeg + (360 / items.length) * i;
        const rad = (deg * Math.PI) / 180;
        const left = 50 + radius * Math.cos(rad);
        const top = 50 + radius * Math.sin(rad);
        return (
          <span
            key={m.key}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ top: `${top}%`, left: `${left}%` }}
          >
            <span
              className="flex h-[52px] w-[52px] animate-spin items-center justify-center rounded-2xl border border-divider bg-surface shadow-sm"
              style={{
                animationDuration: `${duration}s`,
                animationDirection: reverse ? "normal" : "reverse",
              }}
            >
              {m.node}
            </span>
          </span>
        );
      })}
    </div>
  );
}

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

      <div className="relative mx-auto mt-16 aspect-square w-full max-w-[540px]">
        {/* Orbit paths — sized so the chips ride exactly on them */}
        <Ring size="88%" />
        <Ring size="64%" />
        <Ring size="34%" />

        {/* Revolving rings — opposite directions, different speeds */}
        <Orbit items={OUTER} radius={44} duration={48} startDeg={-90} />
        <Orbit items={INNER} radius={32} duration={34} startDeg={-45} reverse />

        {/* Center hub — the Eavesdrop mark */}
        <span className="absolute left-1/2 top-1/2 flex h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-divider bg-surface shadow-md">
          <LogoMark size={38} />
        </span>
      </div>

      <p className="mt-12 text-center text-xs text-static-soft">
        New sources land continuously — you never reconfigure a thing.
      </p>
    </section>
  );
}
