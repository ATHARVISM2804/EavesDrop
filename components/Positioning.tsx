import Link from "next/link";

export function Positioning() {
  return (
    <section id="demo" className="scroll-mt-20 py-24">
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

          <dl className="mt-10 grid grid-cols-2 gap-8">
            <div>
              <dt className="text-sm text-static">Noise filtered before AI cost</dt>
              <dd className="mt-1 font-serif text-3xl font-semibold text-ink">
                40–60%
              </dd>
            </div>
            <div>
              <dt className="text-sm text-static">Sources from day one</dt>
              <dd className="mt-1 font-serif text-3xl font-semibold text-ink">
                3+
              </dd>
            </div>
            <div>
              <dt className="text-sm text-static">Intent score range</dt>
              <dd className="mt-1 font-serif text-3xl font-semibold text-ink">
                0–100
              </dd>
            </div>
            <div>
              <dt className="text-sm text-static">Refresh throttling</dt>
              <dd className="mt-1 font-serif text-3xl font-semibold text-ink">
                None
              </dd>
            </div>
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
        <div className="card bg-paper">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-static">
              Your scoring, personalized
            </span>
            <span className="rounded-sm bg-success/15 px-2 py-0.5 text-[11px] font-medium text-success">
              learning
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {[
              { label: "“alternative to …”", weight: "+18", up: true },
              { label: "generic keyword mention", weight: "−22", up: false },
              { label: "old bumped thread", weight: "−15", up: false },
              { label: "“looking for a tool that …”", weight: "+24", up: true },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-md border border-divider px-4 py-3"
              >
                <span className="text-sm text-ink">{row.label}</span>
                <span
                  className={`text-sm font-semibold tabular-nums ${
                    row.up ? "text-success" : "text-alert"
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
