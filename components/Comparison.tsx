// Yes / no / partial cell states — the whole point is that the Eavesdrop
// column is a clean sweep and the single-source column isn't.
type Cell = "yes" | "no" | "partial" | string;

type Row = {
  capability: string;
  eavesdrop: Cell;
  redditOnly: Cell;
  alerts: Cell;
};

const rows: Row[] = [
  {
    capability: "Sources covered",
    eavesdrop: "Reddit · X · HN (+more)",
    redditOnly: "Reddit only",
    alerts: "Keyword matches",
  },
  { capability: "Buyer-intent scoring (0–100)", eavesdrop: "yes", redditOnly: "no", alerts: "no" },
  { capability: "Category triage — buying vs. noise", eavesdrop: "yes", redditOnly: "no", alerts: "no" },
  { capability: "Suggested reply angle", eavesdrop: "yes", redditOnly: "no", alerts: "no" },
  { capability: "Learns from your feedback", eavesdrop: "yes", redditOnly: "no", alerts: "no" },
  { capability: "Noise filtered before AI cost", eavesdrop: "yes", redditOnly: "partial", alerts: "no" },
  {
    capability: "Platform-shutoff risk",
    eavesdrop: "Low — multi-source",
    redditOnly: "High — one API",
    alerts: "n/a",
  },
];

function Mark({ value, tone }: { value: Cell; tone: "signal" | "muted" }) {
  if (value === "yes") {
    return (
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
          tone === "signal" ? "bg-signal/12" : "bg-success/12"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-label="Yes">
          <path
            d="M13.5 4.5 6.5 11.5 3 8"
            stroke={tone === "signal" ? "#D97B3F" : "#7A9B76"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (value === "no") {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-static/10">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-label="No">
          <path
            d="M4 4l8 8M12 4l-8 8"
            stroke="#5B6B7A"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-static/10">
        <span className="h-0.5 w-2.5 rounded-full bg-static" />
      </span>
    );
  }
  return <span className="text-sm text-static">{value}</span>;
}

export function Comparison() {
  return (
    <section className="scroll-mt-20 py-24">
      <div className="container-content">
        <div className="max-w-2xl">
          <span className="eyebrow">The difference</span>
          <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Not another Reddit-only bot.
          </h2>
          <p className="mt-4 text-lg text-static">
            Single-source tools live and die by one platform&apos;s API. Keyword
            alerts drown you in noise. Eavesdrop scores intent across every place
            your buyers actually talk.
          </p>
        </div>

        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-2/5 px-5 py-4 text-left text-sm font-medium text-static">
                  Capability
                </th>
                <th className="rounded-t-xl border border-b-0 border-signal/40 bg-signal/[0.06] px-5 py-4 text-center">
                  <span className="font-serif text-lg font-semibold text-ink">
                    Eavesdrop
                  </span>
                </th>
                <th className="px-5 py-4 text-center text-sm font-medium text-static">
                  Reddit-only tools
                  <span className="mt-0.5 block text-xs font-normal text-static/70">
                    Linkeddit · F5Bot
                  </span>
                </th>
                <th className="px-5 py-4 text-center text-sm font-medium text-static">
                  Keyword alerts
                  <span className="mt-0.5 block text-xs font-normal text-static/70">
                    Google Alerts
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const last = i === rows.length - 1;
                return (
                  <tr key={row.capability} className="group">
                    <th
                      scope="row"
                      className="border-t border-hairline px-5 py-4 text-left text-sm font-medium text-ink"
                    >
                      {row.capability}
                    </th>
                    <td
                      className={`border-x border-signal/40 bg-signal/[0.06] px-5 py-4 text-center ${
                        last ? "rounded-b-xl border-b" : ""
                      }`}
                    >
                      <div className="flex justify-center">
                        <Mark value={row.eavesdrop} tone="signal" />
                      </div>
                    </td>
                    <td className="border-t border-hairline px-5 py-4 text-center">
                      <div className="flex justify-center">
                        <Mark value={row.redditOnly} tone="muted" />
                      </div>
                    </td>
                    <td className="border-t border-hairline px-5 py-4 text-center">
                      <div className="flex justify-center">
                        <Mark value={row.alerts} tone="muted" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
