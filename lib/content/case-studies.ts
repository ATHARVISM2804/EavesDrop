// Case-study content. These are ILLUSTRATIVE examples (not real customers) so
// the template + index are functional pre-launch. Set `illustrative: false` and
// swap in real numbers/quotes once you have signed-off stories.

export type CaseMetric = { value: string; label: string };

export type CaseStudy = {
  slug: string;
  company: string;
  logoInitials: string;
  industry: string;
  oneLiner: string;
  illustrative: boolean;
  metrics: CaseMetric[];
  challenge: string;
  approach: string;
  outcome: string;
  quote: { text: string; name: string; role: string };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "devtools-startup",
    company: "A dev-tools startup",
    logoInitials: "DT",
    industry: "Developer tools · Seed stage",
    oneLiner:
      "Replaced a Reddit-only alert tool and started catching buyers on X and HN they'd been missing entirely.",
    illustrative: true,
    metrics: [
      { value: "3", label: "Qualified buyers in week one" },
      { value: "2×", label: "Sources that converted vs. Reddit alone" },
      { value: "<1 hr", label: "Per week spent triaging" },
    ],
    challenge:
      "The team was running a single-source Reddit alert tool and manually skimming a noisy inbox. They suspected they were missing conversations elsewhere — but had no bandwidth to watch three platforms by hand, and no way to tell a real buyer from idle chatter.",
    approach:
      "They described their product and competitors, turned on Reddit, X, and Hacker News, and worked the ranked feed top-down. Instead of reading every mention, they replied only to the buying and switching signals surfaced at the top, and used the suggested reply angle to open each conversation.",
    outcome:
      "In the first week they found three qualified buyers — two on threads their Reddit-only tool never surfaced because the conversation happened on X. A week of thumbs up/down sharpened the feed to their definition of a good lead, and weekly triage dropped to under an hour.",
    quote: {
      text: "We found three qualified buyers in our first week — all on threads our Reddit-only tool never even saw because they were on X.",
      name: "Maya R.",
      role: "Founder, dev-tools startup",
    },
  },
  {
    slug: "b2b-growth-team",
    company: "A B2B SaaS growth team",
    logoInitials: "GT",
    industry: "B2B SaaS · Series A",
    oneLiner:
      "Turned social listening from a background chore into a ranked pipeline the whole team could work.",
    illustrative: true,
    metrics: [
      { value: "0–100", label: "Intent score on every mention" },
      { value: "40–60%", label: "Noise filtered before review" },
      { value: "Week 4", label: "Feed noticeably sharper than week 1" },
    ],
    challenge:
      "Their growth lead knew buyers were out there discussing alternatives, but scrolling feeds was unrewarding and impossible to hand off. Without a way to prioritize, social listening kept slipping to the bottom of the to-do list.",
    approach:
      "They let Eavesdrop score and rank every mention, then worked strictly from the top of the intent-sorted list. Reactions from the whole team fed the same per-account personalization, so the scoring converged on what they collectively considered a strong lead.",
    outcome:
      "Social signal became a real channel instead of a chore. With noise filtered before it hit anyone's screen and the highest-intent buyers always on top, the team could triage in minutes — and the feed kept getting sharper as they used it.",
    quote: {
      text: "The intent score is the killer feature. I stopped scrolling feeds and just work the top of the list.",
      name: "Devang P.",
      role: "Growth lead, B2B SaaS",
    },
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
