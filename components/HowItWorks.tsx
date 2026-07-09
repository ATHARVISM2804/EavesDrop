const steps = [
  {
    n: "01",
    title: "Tell us your market",
    body: "Describe what you sell, drop in a few keywords and competitors, and pick the sources you want watched. Setup takes under a minute.",
  },
  {
    n: "02",
    title: "Eavesdrop surfaces the signals",
    body: "We poll every source, filter out the noise before it costs a cent, and score what's left with a two-pass AI engine — cheap first, careful on the close calls.",
  },
  {
    n: "03",
    title: "Turn signals into pipeline",
    body: "Work a ranked feed of real buyers, use the suggested reply angle to open the conversation, and thumbs up or down to sharpen every future score.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-y border-divider bg-ink py-24 text-paper"
    >
      <div className="container-content">
        <div className="max-w-2xl">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-signal">
            How it works
          </span>
          <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            From market to pipeline in three steps.
          </h2>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-paper/10 bg-paper/10 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="bg-ink p-8">
              <span className="font-serif text-5xl font-semibold text-signal">
                {s.n}
              </span>
              <h3 className="mt-6 text-xl font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-paper/60">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
