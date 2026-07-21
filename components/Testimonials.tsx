// NOTE: early-access placeholder quotes — swap for real testimonials before launch.
const testimonials = [
  {
    quote:
      "We found three qualified buyers in our first week — all on threads our Reddit-only tool never even saw because they were on X.",
    name: "Maya R.",
    role: "Founder, dev-tools startup",
    initials: "MR",
  },
  {
    quote:
      "The intent score is the killer feature. I stopped scrolling feeds and just work the top of the list. It's like having an SDR that never sleeps.",
    name: "Devang P.",
    role: "Growth lead, B2B SaaS",
    initials: "DP",
  },
  {
    quote:
      "After a week of thumbs up/down it genuinely started scoring the way I would. The feed got sharper without me touching a setting.",
    name: "Chris L.",
    role: "Solo founder",
    initials: "CL",
  },
];

export function Testimonials() {
  return (
    <section className="scroll-mt-20 border-t border-divider bg-sunken/50 py-24">
      <div className="container-content">
        <div className="max-w-2xl">
          <span className="eyebrow">Early access</span>
          <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Founders are already listening.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="card card-hover flex flex-col"
            >
              <span
                aria-hidden
                className="font-serif text-5xl leading-none text-signal/30"
              >
                &ldquo;
              </span>
              <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-ink">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-hairline pt-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper">
                  {t.initials}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink">
                    {t.name}
                  </span>
                  <span className="block truncate text-xs text-static">
                    {t.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-8 text-xs text-static">
          Quotes from private beta participants. Names shortened for privacy.
        </p>
      </div>
    </section>
  );
}
