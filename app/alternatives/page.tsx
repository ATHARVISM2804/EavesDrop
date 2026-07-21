import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { PageHeader } from "@/components/PageHeader";
import { CompareTable, type CompareRow } from "@/components/marketing/CompareTable";

export const metadata: Metadata = {
  title: "The best Reddit lead-gen & social-listening alternatives (2026)",
  description:
    "A side-by-side look at Reddit lead-gen and social-listening tools — Linkeddit, F5Bot, Google Alerts — and where multi-source, intent-scored Eavesdrop fits in.",
};

const tools = [
  {
    name: "Eavesdrop",
    href: "/sign-up",
    linkLabel: "Start free",
    best: "Multi-source buyer intent, scored and personalized",
    blurb:
      "Scores every mention 0–100 across Reddit, X, and Hacker News, triages buying vs. noise, and learns from your feedback. Built for teams turning social signal into pipeline.",
    featured: true,
  },
  {
    name: "Linkeddit",
    href: "/vs/linkeddit",
    linkLabel: "Eavesdrop vs. Linkeddit",
    best: "Simple Reddit-only keyword monitoring",
    blurb:
      "Watches Reddit for keyword matches. Clean and focused, but single-source — and it doesn't score intent or learn from you.",
  },
  {
    name: "F5Bot",
    href: "/vs/f5bot",
    linkLabel: "Eavesdrop vs. F5Bot",
    best: "Free keyword alerts for hobby monitoring",
    blurb:
      "Emails you when keywords appear on Reddit and Hacker News. Free and reliable, but it's raw alerts — no scoring, no triage, no X coverage.",
  },
  {
    name: "Google Alerts",
    href: null,
    linkLabel: null,
    best: "Broad web mentions, not buyer intent",
    blurb:
      "Catches your keywords across the open web. Useful for brand monitoring, but far too noisy to find people who are actually ready to buy.",
  },
];

const columns = [
  { key: "eavesdrop", label: "Eavesdrop", featured: true },
  { key: "linkeddit", label: "Linkeddit" },
  { key: "f5bot", label: "F5Bot" },
  { key: "alerts", label: "Google Alerts" },
];

const rows: CompareRow[] = [
  {
    label: "Sources covered",
    values: {
      eavesdrop: "Reddit · X · HN",
      linkeddit: "Reddit",
      f5bot: "Reddit · HN",
      alerts: "Open web",
    },
  },
  {
    label: "Buyer-intent scoring (0–100)",
    values: { eavesdrop: true, linkeddit: false, f5bot: false, alerts: false },
  },
  {
    label: "Category triage",
    values: { eavesdrop: true, linkeddit: false, f5bot: false, alerts: false },
  },
  {
    label: "Suggested reply angle",
    values: { eavesdrop: true, linkeddit: false, f5bot: false, alerts: false },
  },
  {
    label: "Learns from your feedback",
    values: { eavesdrop: true, linkeddit: false, f5bot: false, alerts: false },
  },
  {
    label: "Noise filtering",
    values: { eavesdrop: true, linkeddit: "partial", f5bot: false, alerts: false },
  },
  {
    label: "Free tier",
    values: { eavesdrop: true, linkeddit: true, f5bot: true, alerts: true },
  },
];

export default function AlternativesPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="Alternatives"
          title="Reddit lead-gen tools, compared."
          subtitle="Keyword alerts and single-source bots all solve a slice of the problem. Here's how the options stack up — and where an intent-scored, multi-source approach pulls ahead."
        />

        <section className="container-content pb-8">
          <CompareTable rowHeader="Capability" columns={columns} rows={rows} />
        </section>

        <section className="container-content py-16">
          <div className="grid gap-6 md:grid-cols-2">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className={`flex flex-col rounded-xl border p-6 shadow-sm ${
                  tool.featured
                    ? "border-signal/30 bg-signal/[0.04]"
                    : "border-divider bg-surface"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-semibold tracking-tight">
                    {tool.name}
                  </h2>
                  {tool.featured && (
                    <span className="rounded-full bg-signal/12 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-signal-dark">
                      Our pick
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-static">
                  Best for: {tool.best}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-static">
                  {tool.blurb}
                </p>
                {tool.href && tool.linkLabel && (
                  <Link
                    href={tool.href}
                    className="mt-5 text-sm font-medium text-signal hover:underline"
                  >
                    {tool.linkLabel} →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
