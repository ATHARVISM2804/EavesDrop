const features = [
  {
    group: "Multi-Source Monitoring",
    title: "Not just Reddit.",
    body: "Track buyer conversations across Reddit, X, and Hacker News from day one — with review sites on the way. No single platform's API policy can switch you off.",
    points: ["Reddit search", "X recent search", "Hacker News (Algolia)"],
  },
  {
    group: "Buyer Intent Feed",
    title: "Signal, not noise.",
    body: "Every mention is scored 0–100 and sorted by intent, then bucketed into buying, switching, complaint, curious, or noise — so you triage at a glance and reply while it's hot.",
    points: ["Intent scoring 0–100", "Category triage", "Suggested reply angle"],
  },
  {
    group: "Personalized Scoring",
    title: "It learns from you.",
    body: "Thumbs up or down on any lead and the scoring engine retrains to your taste. The more you use Eavesdrop, the more it thinks like your best SDR — and the harder it is for competitors to copy.",
    points: ["Feedback loop", "Per-account weights", "Gets smarter over time"],
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="scroll-mt-20 py-24">
      <div className="container-content">
        <div className="max-w-2xl">
          <span className="eyebrow">Why Eavesdrop</span>
          <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            One job, done exceptionally well.
          </h2>
          <p className="mt-4 text-lg text-static">
            Most social-listening tools try to be five products at once.
            Eavesdrop nails a single loop: find the people ready to buy.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.group} className="card flex flex-col">
              <span className="eyebrow">{f.group}</span>
              <h3 className="mt-3 font-serif text-2xl font-semibold tracking-tight">
                {f.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-static">
                {f.body}
              </p>
              <ul className="mt-6 space-y-2 border-t border-divider pt-5">
                {f.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-2 text-sm text-ink"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
