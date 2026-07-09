import Link from "next/link";
import { LeadFeedMock } from "./LeadFeedMock";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-content grid items-center gap-14 py-20 md:py-28 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: copy */}
        <div className="max-w-xl">
          <span className="eyebrow">Multi-source buyer intent</span>
          <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            We listen where your{" "}
            <span className="italic text-signal">buyers</span> talk.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-static">
            Eavesdrop finds people across Reddit, X, and Hacker News who are
            actively expressing buying intent for a product like yours — and
            gets smarter about it every time you give feedback.
          </p>

          {/* CTA input */}
          <form
            action="/sign-up"
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              name="product"
              placeholder="Describe what you sell…"
              className="w-full rounded-md border border-divider bg-paper px-4 py-3 text-sm text-ink placeholder:text-static/70 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
            />
            <button type="submit" className="btn-signal shrink-0">
              Find my buyers
            </button>
          </form>
          <p className="mt-3 text-xs text-static">
            Free tier · no credit card · 10 leads/week on us
          </p>
        </div>

        {/* Right: product mock */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-6 -z-10 rounded-2xl bg-gradient-to-br from-signal/8 via-transparent to-static/8 blur-2xl"
          />
          <LeadFeedMock />
        </div>
      </div>

      {/* Trust strip */}
      <div className="border-y border-divider bg-paper">
        <div className="container-content flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-4 text-xs text-static">
          <span>Listening across</span>
          <span className="font-medium text-ink">Reddit</span>
          <span className="text-divider">·</span>
          <span className="font-medium text-ink">X</span>
          <span className="text-divider">·</span>
          <span className="font-medium text-ink">Hacker News</span>
          <span className="text-divider">·</span>
          <span className="italic">review sites soon</span>
        </div>
      </div>
    </section>
  );
}
