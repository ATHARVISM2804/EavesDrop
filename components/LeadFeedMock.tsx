// Static visual mock of the "Leads" feed — used on the marketing page to show
// the product's triage-at-a-glance pattern (source label + signal bar + score).

type Lead = {
  source: "reddit" | "x" | "hn";
  handle: string;
  snippet: string;
  score: number;
  category: "buying_signal" | "switching_signal" | "complaint" | "curious";
};

const sourceMeta: Record<Lead["source"], { label: string; tag: string }> = {
  reddit: { label: "Reddit", tag: "r/SaaS" },
  x: { label: "X", tag: "@post" },
  hn: { label: "Hacker News", tag: "Ask HN" },
};

const categoryMeta: Record<
  Lead["category"],
  { label: string; className: string }
> = {
  buying_signal: { label: "Buying", className: "bg-signal/12 text-signal" },
  switching_signal: { label: "Switching", className: "bg-alert/12 text-alert" },
  complaint: { label: "Complaint", className: "bg-static/12 text-static" },
  curious: { label: "Curious", className: "bg-success/15 text-success" },
};

const leads: Lead[] = [
  {
    source: "reddit",
    handle: "u/growthmarketer",
    snippet: "Anyone found a solid alternative to Linkeddit that isn't Reddit-only?",
    score: 94,
    category: "switching_signal",
  },
  {
    source: "hn",
    handle: "throwaway_ceo",
    snippet: "Looking for a tool that surfaces buyer intent across a few platforms…",
    score: 88,
    category: "buying_signal",
  },
  {
    source: "x",
    handle: "@indiehacker",
    snippet: "Our current lead-gen stack keeps missing threads on X. Frustrating.",
    score: 71,
    category: "complaint",
  },
  {
    source: "reddit",
    handle: "u/agencyowner",
    snippet: "How do you all monitor mentions without drowning in noise?",
    score: 52,
    category: "curious",
  },
];

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-divider">
        <div
          className="h-full rounded-full bg-signal"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="w-7 text-right text-xs font-semibold tabular-nums text-ink">
        {score}
      </span>
    </div>
  );
}

export function LeadFeedMock() {
  return (
    <div className="rounded-lg border border-divider bg-paper shadow-[0_1px_0_rgba(14,14,16,0.03)]">
      {/* Mock header */}
      <div className="flex items-center justify-between border-b border-divider px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success" />
          <span className="text-xs font-medium text-static">
            Live buyer-intent feed
          </span>
        </div>
        <span className="text-xs text-static">Sorted by intent</span>
      </div>

      {/* Rows */}
      <ul className="divide-y divide-divider">
        {leads.map((lead, i) => {
          const src = sourceMeta[lead.source];
          const cat = categoryMeta[lead.category];
          return (
            <li key={i} className="px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-2 text-xs text-static">
                  <span className="font-medium text-ink">{src.label}</span>
                  <span className="text-divider">·</span>
                  <span className="truncate">{lead.handle}</span>
                </div>
                <span
                  className={`shrink-0 rounded-sm px-2 py-0.5 text-[11px] font-medium ${cat.className}`}
                >
                  {cat.label}
                </span>
              </div>
              <p className="mt-1.5 truncate text-sm text-ink">{lead.snippet}</p>
              <div className="mt-2.5">
                <ScoreBar score={lead.score} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
