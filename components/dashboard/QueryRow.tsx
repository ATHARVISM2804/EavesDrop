"use client";

import { useTransition } from "react";
import { deleteQuery, toggleQuery } from "@/app/(dashboard)/dashboard/queries/actions";
import type { Source } from "@/lib/scoring/types";

export type QueryRowData = {
  id: string;
  productDescription: string;
  keywords: string[];
  competitors: string[];
  sources: Source[];
  isActive: boolean;
};

export function QueryRow({ query }: { query: QueryRowData }) {
  const [isPending, startTransition] = useTransition();

  return (
    <li className="rounded-lg border border-divider bg-paper p-4">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-ink">{query.productDescription}</p>
        <span
          className={`shrink-0 rounded-sm px-2 py-0.5 text-[11px] font-medium ${
            query.isActive ? "bg-success/15 text-success" : "bg-static/12 text-static"
          }`}
        >
          {query.isActive ? "Active" : "Paused"}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {query.sources.map((s) => (
          <span key={s} className="rounded-sm bg-ink/5 px-2 py-0.5 text-[11px] text-static">
            {s}
          </span>
        ))}
        {query.keywords.slice(0, 4).map((k) => (
          <span key={k} className="rounded-sm bg-signal/8 px-2 py-0.5 text-[11px] text-signal">
            {k}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs">
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(() => toggleQuery(query.id, !query.isActive))
          }
          className="text-static hover:text-ink disabled:opacity-50"
        >
          {query.isActive ? "Pause" : "Resume"}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            if (confirm("Delete this query and all its leads?")) {
              startTransition(() => deleteQuery(query.id));
            }
          }}
          className="text-static hover:text-alert disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
