import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CloudBackdrop } from "@/components/home/CloudBackdrop";

export const metadata: Metadata = {
  title: "Pricing — Eavesdrop",
  description:
    "Fair, lead-based pricing for multi-source buyer-intent lead generation. Start free, no credit card — pay for signal, not seats.",
};

/* ── tiers ─────────────────────────────────────────────────────────────── */

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
      "Reddit source",
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
      "200 leads / week",
      "Reddit + Hacker News",
      "Personalized feedback loop",
      "Instant Slack alerts",
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
      "1,000 leads / week",
      "All live sources",
      "Priority scoring & fresher polls",
      "Email + Slack digests",
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
      "Unlimited leads",
      "Review sites (G2 / Capterra)",
      "Competitor intelligence",
      "Team seats & shared feeds",
    ],
  },
];

/* ── compare matrix ────────────────────────────────────────────────────── */

const COMPARE: { label: string; cells: string[] }[] = [
  { label: "Leads per week", cells: ["10", "200", "1,000", "Unlimited"] },
  { label: "Sources", cells: ["Reddit", "Reddit · HN", "All live", "All + reviews"] },
  { label: "Intent scoring (0–100)", cells: ["✓", "✓", "✓", "✓"] },
  { label: "Personalized feedback loop", cells: ["—", "✓", "✓", "✓"] },
  { label: "Instant Slack / email alerts", cells: ["—", "✓", "✓", "✓"] },
  { label: "Priority scoring & fresher polls", cells: ["—", "—", "✓", "✓"] },
  { label: "Competitor intelligence", cells: ["—", "—", "—", "✓"] },
  { label: "Team seats", cells: ["—", "1", "3", "Custom"] },
  { label: "Support", cells: ["Community", "Email", "Priority", "Dedicated"] },
];

/* ── pricing FAQ ───────────────────────────────────────────────────────── */

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is the free tier really free?",
    a: "Yes. 10 scored leads a week from Reddit, no credit card, no trial clock. It's there so you can see real buyers for your product before paying anything.",
  },
  {
    q: "What counts as a “lead”?",
    a: "A mention we've fetched, cleared the noise filter, and scored for buyer intent — with reasoning and a suggested reply angle. Noise that gets filtered out never counts against your cap.",
  },
  {
    q: "Which sources are live today?",
    a: "Reddit and Hacker News are live now. X / Twitter and review sites (G2, Capterra) are rolling out — the Pro / Team tier is where those land first.",
  },
  {
    q: "Can I change or cancel my plan?",
    a: "Anytime, self-serve. Upgrades take effect immediately; downgrades and cancellations apply at the end of the billing period. No “contact sales to cancel” games.",
  },
  {
    q: "What happens when I hit my weekly cap?",
    a: "Scoring pauses for the week rather than surprise-billing you. You keep every lead already found, and the cap resets weekly. Need more headroom? Move up a tier.",
  },
  {
    q: "Are these prices final?",
    a: "They're indicative during early access and may adjust as we validate. Anyone who signs up early keeps the price they started on.",
  },
];

/* ── atoms ─────────────────────────────────────────────────────────────── */

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden className="mt-0.5 shrink-0 text-signal">
      <path d="M13.5 4.5 6.5 11.5 3 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Cell({ value }: { value: string }) {
  if (value === "✓") return <span className="text-signal">✓</span>;
  if (value === "—") return <span className="text-static-soft">—</span>;
  return <span className="text-ink">{value}</span>;
}

/* ── page ──────────────────────────────────────────────────────────────── */

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Intro */}
        <section className="container-content pt-16 text-center md:pt-20">
          <span className="eyebrow">Pricing</span>
          <h1 className="display-2 mx-auto mt-4 max-w-2xl text-ink">
            Pay for signal, not seats.
          </h1>
          <p className="lead mx-auto mt-5 max-w-xl">
            No artificial refresh caps. Start free, upgrade when the pipeline is
            paying for itself.
          </p>
        </section>

        {/* Cloud pricing band — cards float on the atmosphere plate */}
        <section className="relative mt-12">
          <div className="atmosphere atmosphere-fade relative overflow-hidden py-20 md:py-28">
            <CloudBackdrop />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_60%_at_50%_30%,rgba(255,255,255,0.6),transparent_72%)]"
            />

            <div className="container-content relative z-10">
              <h2 className="display-3 mb-10 text-center text-ink">
                Pricing that scales with you.
              </h2>

              <div className="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-4">
                {tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`relative flex flex-col rounded-2xl border bg-surface/95 p-6 backdrop-blur-sm transition-transform duration-300 ${
                      tier.featured
                        ? "border-ink/15 shadow-float lg:-translate-y-3"
                        : "border-divider shadow-lg hover:-translate-y-1"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-ink">{tier.name}</h3>
                      {tier.featured && (
                        <span className="rounded-full bg-signal/12 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-eyebrow text-signal">
                          Popular
                        </span>
                      )}
                      {tier.note && !tier.featured && (
                        <span className="rounded-full bg-sunken px-2.5 py-0.5 text-[10px] font-medium text-static">
                          {tier.note}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-medium tracking-display text-ink">
                        {tier.price}
                      </span>
                      {tier.cadence && (
                        <span className="text-sm text-static">{tier.cadence}</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-static">{tier.tagline}</p>

                    <Link
                      href={tier.href}
                      className={`mt-6 w-full ${tier.featured ? "btn-signal" : "btn-ghost"}`}
                    >
                      {tier.cta}
                    </Link>

                    <ul className="mt-6 space-y-3 border-t border-hairline pt-6">
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
            </div>
          </div>
        </section>

        {/* Compare plans */}
        <section className="section-tight">
          <div className="container-content">
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow">Compare</span>
              <h2 className="display-3 mt-4 text-ink">Every plan, side by side.</h2>
            </div>

            <div className="mt-10 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-divider">
                    <th className="py-3 pr-4 text-left font-medium text-static">Plan</th>
                    {tiers.map((t) => (
                      <th
                        key={t.name}
                        className={`px-4 py-3 text-left font-semibold ${
                          t.featured ? "text-signal" : "text-ink"
                        }`}
                      >
                        {t.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((row, i) => (
                    <tr
                      key={row.label}
                      className={`border-b border-hairline ${i % 2 ? "bg-veil/60" : ""}`}
                    >
                      <td className="py-3 pr-4 text-static">{row.label}</td>
                      {row.cells.map((c, idx) => (
                        <td key={idx} className="px-4 py-3 tabular-nums">
                          <Cell value={c} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-tight bg-sunken">
          <div className="container-content">
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow">Questions</span>
              <h2 className="display-3 mt-4 text-ink">Pricing, answered.</h2>
            </div>

            <div className="mx-auto mt-10 max-w-prose divide-y divide-divider rounded-xl border border-divider bg-surface">
              {FAQS.map((f) => (
                <details key={f.q} className="group px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-ink">
                    {f.q}
                    <span className="shrink-0 text-static transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-static">{f.a}</p>
                </details>
              ))}
            </div>

            <p className="mx-auto mt-8 max-w-prose text-center text-xs text-static-soft">
              Prices are indicative during early access. Questions?{" "}
              <Link href="/contact" className="text-ink underline underline-offset-2 hover:opacity-70">
                Talk to us
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="section text-center">
          <div className="container-content">
            <h2 className="display-2 mx-auto max-w-2xl text-ink">
              See your first buyers before you pay a cent.
            </h2>
            <div className="mt-8 flex justify-center">
              <Link href="/sign-up" className="btn-signal px-6 py-3">
                Start free
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
