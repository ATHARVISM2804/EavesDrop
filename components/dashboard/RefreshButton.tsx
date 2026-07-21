"use client";

import { useState, useTransition } from "react";
import { refreshLeads } from "@/app/(dashboard)/dashboard/refresh";

export function RefreshButton() {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ tone: "ok" | "warn" | "err"; text: string } | null>(null);

  function run() {
    setMsg(null);
    startTransition(async () => {
      const res = await refreshLeads();
      if (!res.ok) {
        setMsg({ tone: "err", text: res.error });
      } else if (res.note) {
        setMsg({
          tone: "warn",
          text: `Fetched ${res.inserted} new mention${res.inserted === 1 ? "" : "s"} — but scoring is off (add ANTHROPIC_API_KEY).`,
        });
      } else {
        setMsg({
          tone: "ok",
          text: `Fetched ${res.inserted} new · scored ${res.scored}.`,
        });
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      {msg ? (
        <span
          className={`text-xs ${
            msg.tone === "err"
              ? "text-alert"
              : msg.tone === "warn"
                ? "text-signal-dark"
                : "text-success"
          }`}
        >
          {msg.text}
        </span>
      ) : null}
      <button
        type="button"
        onClick={run}
        disabled={isPending}
        className="btn-ghost text-sm disabled:opacity-60"
      >
        {isPending ? "Fetching…" : "↻ Refresh"}
      </button>
    </div>
  );
}
