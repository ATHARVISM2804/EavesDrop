import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Features — Multi-source buyer-intent lead generation | Eavesdrop",
  description:
    "How Eavesdrop works: multi-source monitoring across Reddit, X, and Hacker News, a two-pass AI intent-scoring engine, category triage, suggested reply angles, and a feedback loop that personalizes to your account.",
};

const sections = [
  {
    eyebrow: "Multi-source monitoring",
    title: "Listen everywhere your buyers talk.",
    body: "Your next customer isn't only on Reddit. Eavesdrop watches Reddit, X, and Hacker News from day one — with review sites on the way — so no single platform's API policy can switch your pipeline off overnight.",
    points: [
      "Reddit search across subreddits and comments",
      "X recent-search for real-time intent",
      "Hacker News via the Algolia API",
      "Review sites (G2 / Capterra) on the roadmap",
    ],
  },
  {
    eyebrow: "Two-pass intent scoring",
    title: "A score for every mention — without lighting money on fire.",
    body: "Every mention runs through a cheap first-pass model. Only the genuine close calls get escalated to a more careful model. You get a 0–100 intent score on everything, and we spend AI budget only where it changes the answer.",
    points: [
      "0–100 buyer-intent score on every mention",
      "Cheap first pass, careful escalation on close calls",
      "40–60% of noise filtered before it costs a cent",
      "Sorted so the hottest buyers are always on top",
    ],
  },
  {
    eyebrow: "Triage & reply",
    title: "Know what you're looking at, at a glance.",
    body: "Each mention is bucketed — buying, switching, complaint, curious, or noise — so you triage in seconds. When something's worth a reply, Eavesdrop suggests an angle to open the conversation naturally.",
    points: [
      "Category triage on every lead",
      "Suggested reply angle to start the conversation",
      "Jump straight to the source thread",
      "Work a ranked feed, not a noisy inbox",
    ],
  },
  {
    eyebrow: "Personalized scoring",
    title: "It learns to think like your best SDR.",
    body: "Thumbs up or down on any lead and the scoring engine retrains to your taste. The patterns you reward or reject become weights injected into every future scoring call — unique to your account, and impossible for a competitor to copy.",
    points: [
      "Feedback loop on every lead",
      "Per-account personalization weights",
      "Week four is sharper than week one",
      "Your taste becomes the moat",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="Features"
          title="One loop, done exceptionally well."
          subtitle="Find the people who are ready to buy — across every source, scored for intent, and sharpened by your feedback."
        />

        <div className="container-content space-y-6 pb-24">
          {sections.map((s, i) => (
            <section
              key={s.eyebrow}
              className="grid items-center gap-8 rounded-2xl border border-divider bg-surface p-8 shadow-sm md:grid-cols-2 md:p-12"
            >
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <span className="eyebrow">{s.eyebrow}</span>
                <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight">
                  {s.title}
                </h2>
                <p className="mt-4 text-static">{s.body}</p>
              </div>
              <ul
                className={`space-y-3 ${i % 2 === 1 ? "md:order-1" : ""}`}
              >
                {s.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-3 rounded-lg border border-hairline bg-paper/50 px-4 py-3 text-sm text-ink"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal/12">
                      <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <p className="pt-4 text-center text-sm text-static">
            Wondering how we stack up against Reddit-only tools?{" "}
            <Link href="/alternatives" className="font-medium text-signal hover:underline">
              See the comparison
            </Link>
            .
          </p>
        </div>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
