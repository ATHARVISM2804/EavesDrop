"use client";

import { useState, useTransition } from "react";
import type { IntentCategory, LeadFeedback, Source } from "@/lib/scoring/types";
import { submitFeedback } from "@/app/(dashboard)/dashboard/feedback";

export type LeadCardData = {
  id: string;
  source: Source;
  author: string | null;
  content: string;
  url: string | null;
  postedAt: string | null;
  score: number;
  category: IntentCategory;
  reasoning: string | null;
  replyAngle: string | null;
  feedback: LeadFeedback | null;
};

const sourceLabel: Record<Source, string> = {
  reddit: "Reddit",
  x: "X",
  hn: "Hacker News",
  g2: "G2",
  capterra: "Capterra",
};

const categoryMeta: Record<IntentCategory, { label: string; className: string }> = {
  buying_signal: { label: "Buying", className: "bg-signal/12 text-signal" },
  switching_signal: { label: "Switching", className: "bg-alert/12 text-alert" },
  complaint: { label: "Complaint", className: "bg-static/12 text-static" },
  curious: { label: "Curious", className: "bg-success/15 text-success" },
  noise: { label: "Noise", className: "bg-static/12 text-static" },
};

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-divider">
        <div className="h-full rounded-full bg-signal" style={{ width: `${score}%` }} />
      </div>
      <span className="w-7 text-right text-xs font-semibold tabular-nums text-ink">
        {score}
      </span>
    </div>
  );
}

export function LeadCard({ lead }: { lead: LeadCardData }) {
  const [feedback, setFeedback] = useState<LeadFeedback | null>(lead.feedback);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const cat = categoryMeta[lead.category];

  function react(next: LeadFeedback) {
    const previous = feedback;
    setFeedback(next); // optimistic
    setError(null);
    startTransition(async () => {
      const res = await submitFeedback(lead.id, next);
      if (!res.ok) {
        setFeedback(previous);
        setError(res.error);
      }
    });
  }

  return (
    <li className="rounded-lg border border-divider bg-paper px-5 py-4 shadow-[0_1px_0_rgba(14,14,16,0.03)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2 text-xs text-static">
          <span className="font-medium text-ink">{sourceLabel[lead.source]}</span>
          {lead.author ? (
            <>
              <span className="text-divider">·</span>
              <span className="truncate">{lead.author}</span>
            </>
          ) : null}
        </div>
        <span
          className={`shrink-0 rounded-sm px-2 py-0.5 text-[11px] font-medium ${cat.className}`}
        >
          {cat.label}
        </span>
      </div>

      <p className="mt-1.5 text-sm text-ink">{lead.content}</p>

      {lead.reasoning ? (
        <p className="mt-2 text-xs italic text-static">{lead.reasoning}</p>
      ) : null}

      {lead.replyAngle ? (
        <p className="mt-2 rounded-md bg-signal/6 px-3 py-2 text-xs text-ink">
          <span className="font-medium text-signal">Reply angle: </span>
          {lead.replyAngle}
        </p>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-4">
        <ScoreBar score={lead.score} />

        <div className="flex items-center gap-1">
          {lead.url ? (
            <a
              href={lead.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mr-2 text-xs font-medium text-signal hover:underline"
            >
              View source ↗
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => react("thumbs_up")}
            disabled={isPending}
            aria-pressed={feedback === "thumbs_up"}
            aria-label="Good lead"
            className={`rounded-md border px-2 py-1 text-sm transition disabled:opacity-50 ${
              feedback === "thumbs_up"
                ? "border-success bg-success/10 text-success"
                : "border-divider text-static hover:border-success hover:text-success"
            }`}
          >
            ▲
          </button>
          <button
            type="button"
            onClick={() => react("thumbs_down")}
            disabled={isPending}
            aria-pressed={feedback === "thumbs_down"}
            aria-label="Bad lead"
            className={`rounded-md border px-2 py-1 text-sm transition disabled:opacity-50 ${
              feedback === "thumbs_down"
                ? "border-alert bg-alert/10 text-alert"
                : "border-divider text-static hover:border-alert hover:text-alert"
            }`}
          >
            ▼
          </button>
        </div>
      </div>

      {error ? <p className="mt-2 text-xs text-alert">{error}</p> : null}
    </li>
  );
}
