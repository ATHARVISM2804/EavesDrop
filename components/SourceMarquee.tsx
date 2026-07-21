import { Marquee } from "@/components/marketing/Marquee";

// Sources Eavesdrop listens across. Live ones are solid; "soon" ones are muted.
const sources: { name: string; soon?: boolean }[] = [
  { name: "Reddit" },
  { name: "X" },
  { name: "Hacker News" },
  { name: "G2", soon: true },
  { name: "Capterra", soon: true },
  { name: "TrustRadius", soon: true },
  { name: "Trustpilot", soon: true },
  { name: "Product Hunt", soon: true },
];

export function SourceMarquee() {
  return (
    <section className="border-y border-divider bg-surface py-8">
      <div className="container-content">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.18em] text-static">
          Listening across the places your buyers actually talk
        </p>
        <Marquee duration={30}>
          {sources.map((s) => (
            <span
              key={s.name}
              className="mx-6 inline-flex items-center gap-2 font-serif text-2xl font-semibold tracking-tight"
            >
              <span
                className={`h-2 w-2 rounded-full ${s.soon ? "bg-divider" : "bg-signal"}`}
              />
              <span className={s.soon ? "text-static/50" : "text-ink"}>{s.name}</span>
              {s.soon && (
                <span className="text-[10px] font-medium uppercase tracking-wide text-static/50">
                  soon
                </span>
              )}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
