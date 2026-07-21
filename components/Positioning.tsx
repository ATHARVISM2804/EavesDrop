import Link from "next/link";

export function Positioning() {
  return (
    <section
      id="demo"
      className="scroll-mt-20 border-y border-divider bg-sunken/50 py-24"
    >
      <div className="container-content grid items-center gap-14 lg:grid-cols-2">
        <div className="max-w-xl">
          <span className="eyebrow">Beyond Reddit-only</span>
          <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            The feedback loop is the moat.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-static">
            Anyone can wrap a Reddit search in a generic AI prompt. What they
            can&apos;t copy is the model of <em>your</em> taste. Every thumbs up
            or down tunes the scoring to your account — so week four is sharper
            than week one, and a competitor starting today is always behind.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6">
            {[
              { dt: "Noise filtered before AI cost", dd: "40–60%" },
              { dt: "Sources from day one", dd: "3+" },
              { dt: "Intent score range", dd: "0–100" },
              { dt: "Refresh throttling", dd: "None" },
            ].map((stat) => (
              <div key={stat.dt} className="border-l-2 border-signal/30 pl-4">
                <dd className="font-serif text-3xl font-semibold text-ink">
                  {stat.dd}
                </dd>
                <dt className="mt-1 text-sm text-static">{stat.dt}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/sign-up" className="btn-signal">
              Try the live demo
            </Link>
            <Link href="/pricing" className="btn-ghost">
              See pricing
            </Link>
          </div>
        </div>

        {/* Feedback-loop visual */}
        <div className="rounded-xl border border-divider bg-surface p-6 shadow-md">
          <div className="flex items-center justify-between border-b border-hairline pb-4">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-static">
              Your scoring, personalized
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/12 px-2.5 py-1 text-[11px] font-medium text-success">
              <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-success" />
              learning
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {[
              { label: "“alternative to …”", weight: "+18", up: true },
              { label: "generic keyword mention", weight: "−22", up: false },
              { label: "old bumped thread", weight: "−15", up: false },
              { label: "“looking for a tool that …”", weight: "+24", up: true },
            ].map((row) => (
              <div
                key={row.label}
                className="group flex items-center justify-between rounded-lg border border-hairline bg-paper/50 px-4 py-3 transition-colors hover:border-divider hover:bg-paper"
              >
                <span className="text-sm text-ink">{row.label}</span>
                <span
                  className={`rounded-md px-2 py-0.5 text-sm font-semibold tabular-nums ${
                    row.up
                      ? "bg-success/10 text-success"
                      : "bg-alert/10 text-alert"
                  }`}
                >
                  {row.weight}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs leading-relaxed text-static">
            Patterns you reward or reject become weights injected into every
            future scoring call — unique to your account.
          </p>
        </div>
      </div>
    </section>
  );
}
