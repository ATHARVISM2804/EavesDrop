const metrics = [
  { value: "3+", label: "Sources from day one", sub: "Reddit · X · Hacker News" },
  { value: "0–100", label: "Intent score", sub: "on every single mention" },
  { value: "40–60%", label: "Noise filtered", sub: "before it costs a cent" },
  { value: "<60s", label: "To start listening", sub: "no credit card" },
];

export function Metrics() {
  return (
    <section className="border-y border-divider bg-surface">
      <div className="container-content">
        <dl className="grid grid-cols-2 divide-y divide-hairline md:grid-cols-4 md:divide-x md:divide-y-0">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="flex flex-col items-center px-4 py-10 text-center"
            >
              <dd className="font-serif text-4xl font-semibold tracking-tight text-ink md:text-5xl">
                {m.value}
              </dd>
              <dt className="mt-3 text-sm font-medium text-ink">{m.label}</dt>
              <p className="mt-1 text-xs text-static">{m.sub}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
