import Link from "next/link";

const faqs = [
  {
    q: "Is this against the platforms' terms of service?",
    a: "No. Eavesdrop reads public conversations through official search endpoints and public APIs — the same posts anyone can see. We don't scrape private data, automate accounts, or post on your behalf. You reply as yourself, like a normal user.",
  },
  {
    q: "How is this different from Google Alerts or F5Bot?",
    a: "Keyword tools tell you a word appeared — then you drown in noise. Eavesdrop scores every mention 0–100 for actual buying intent, sorts by it, and buckets each one as buying, switching, complaint, curious, or noise. You work a ranked list of real buyers instead of a firehose.",
  },
  {
    q: "Will my searches and leads stay private?",
    a: "Yes. Your queries, leads, and feedback are scoped to your account and never shared or used to train a shared model. The personalization weights that tune your scoring are unique to you.",
  },
  {
    q: "What happens if one source's API changes?",
    a: "That's exactly why we're multi-source from day one. A single-source tool goes dark if one platform changes its policy — Eavesdrop keeps surfacing buyers from the others while we adapt. Coverage is the moat.",
  },
  {
    q: "How quickly does the scoring get smart?",
    a: "It's useful immediately, and it sharpens fast. A week of thumbs up/down is usually enough to noticeably tilt the feed toward the leads you actually want — and it keeps improving from there.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "No. The free tier gives you 10 scored leads a week with no card required. Upgrade only once the pipeline is paying for itself.",
  },
];

export function FAQ() {
  return (
    <section className="scroll-mt-20 py-24">
      <div className="container-content grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <span className="eyebrow">FAQ</span>
          <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Questions, answered.
          </h2>
          <p className="mt-4 text-static">
            Still unsure?{" "}
            <Link href="/contact" className="font-medium text-signal hover:underline">
              Talk to us
            </Link>{" "}
            — we answer fast.
          </p>
        </div>

        <div className="divide-y divide-divider border-y border-divider">
          {faqs.map((faq) => (
            <details key={faq.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left [&::-webkit-details-marker]:hidden">
                <span className="font-serif text-lg font-semibold text-ink">
                  {faq.q}
                </span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-divider text-static transition-all duration-200 group-open:rotate-180 group-open:border-signal/40 group-open:bg-signal/10 group-open:text-signal">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path
                      d="M4 6l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </summary>
              <p className="animate-fade-up pb-5 pr-11 text-sm leading-relaxed text-static">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
