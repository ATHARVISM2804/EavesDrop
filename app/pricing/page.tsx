import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Pricing — Eavesdrop",
  description:
    "Fair, usage-based pricing for multi-source buyer-intent lead generation. Start free, no credit card.",
};

type Tier = {
  name: string;
  price: string;
  cadence?: string;
  tagline: string;
  cta: string;
  href: string;
  featured?: boolean;
  note?: string;
  features: string[];
};

const tiers: Tier[] = [
  {
    name: "Free",
    price: "$0",
    tagline: "Kick the tires with real leads.",
    cta: "Start free",
    href: "/sign-up",
    features: [
      "10 leads / week",
      "Reddit source only",
      "Intent scoring & triage",
      "No credit card required",
    ],
  },
  {
    name: "Starter",
    price: "$29",
    cadence: "/mo",
    tagline: "For solo founders finding their first channels.",
    cta: "Start free trial",
    href: "/sign-up?plan=starter",
    features: [
      "Higher weekly lead cap",
      "All sources — Reddit, X, HN",
      "Personalized feedback loop",
      "Usage-based overage, no hard throttling",
    ],
  },
  {
    name: "Growth",
    price: "$79",
    cadence: "/mo",
    tagline: "For teams scaling outbound from social signal.",
    cta: "Start free trial",
    href: "/sign-up?plan=growth",
    featured: true,
    features: [
      "Everything in Starter",
      "Personalization at scale",
      "Priority scoring & fresher polls",
      "Email / Slack digests",
    ],
  },
  {
    name: "Pro / Team",
    price: "Custom",
    tagline: "Unlimited signal + competitor intel.",
    cta: "Contact us",
    href: "/contact",
    note: "Post-launch",
    features: [
      "Everything in Growth",
      "Review sites (G2 / Capterra)",
      "Competitor intelligence module",
      "Team seats & shared feeds",
    ],
  },
];

function Check() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="mt-0.5 shrink-0"
    >
      <path
        d="M13.5 4.5 6.5 11.5 3 8"
        stroke="#D97B3F"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="py-20 md:py-24">
          <div className="container-content text-center">
            <span className="eyebrow">Pricing</span>
            <h1 className="mx-auto mt-4 max-w-3xl font-serif text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Pay for signal, not seats.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-static">
              No artificial refresh caps. Start free, upgrade when the pipeline
              is paying for itself.
            </p>
          </div>

          <div className="container-content mt-16">
            <div className="grid items-start gap-6 lg:grid-cols-4">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative flex flex-col overflow-hidden rounded-xl border p-6 transition-all duration-300 ${
                    tier.featured
                      ? "border-signal/50 bg-surface shadow-lg ring-1 ring-signal/20 lg:-translate-y-3"
                      : "card card-hover"
                  }`}
                >
                  {tier.featured && (
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-signal-hi to-signal"
                    />
                  )}
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-xl font-semibold">
                      {tier.name}
                    </h2>
                    {tier.featured && (
                      <span className="rounded-full bg-signal/12 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-signal-dark">
                        Popular
                      </span>
                    )}
                    {tier.note && !tier.featured && (
                      <span className="rounded-full bg-static/12 px-2.5 py-1 text-[11px] font-medium text-static">
                        {tier.note}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="font-serif text-4xl font-semibold tracking-tight">
                      {tier.price}
                    </span>
                    {tier.cadence && (
                      <span className="text-sm text-static">{tier.cadence}</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-static">{tier.tagline}</p>

                  <Link
                    href={tier.href}
                    className={`mt-6 w-full ${
                      tier.featured ? "btn-signal" : "btn-ghost"
                    }`}
                  >
                    {tier.cta}
                  </Link>

                  <ul className="mt-8 space-y-3 border-t border-hairline pt-6">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex gap-2.5 text-sm text-ink">
                        <Check />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="mt-10 text-center text-xs text-static">
              Prices shown are indicative and finalized after our early-access
              validation. Questions?{" "}
              <Link href="/contact" className="text-signal hover:underline">
                Talk to us
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
