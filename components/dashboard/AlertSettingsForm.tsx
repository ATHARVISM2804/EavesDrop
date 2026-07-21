"use client";

import { useState, useTransition } from "react";
import { saveAlertSettings, sendTestAlert } from "@/app/(dashboard)/dashboard/settings/actions";

const inputClass =
  "mt-1.5 w-full rounded-md border border-divider bg-surface px-4 py-2.5 text-sm text-ink shadow-xs placeholder:text-static/70 focus:border-signal/60 focus:outline-none";

export function AlertSettingsForm({
  initial,
}: {
  initial: { enabled: boolean; webhook: string; minScore: number };
}) {
  const [enabled, setEnabled] = useState(initial.enabled);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, startSave] = useTransition();
  const [testing, startTest] = useTransition();

  function onSave(formData: FormData) {
    setMsg(null);
    startSave(async () => {
      const res = await saveAlertSettings(formData);
      setMsg(res.ok ? { ok: true, text: res.message } : { ok: false, text: res.error });
    });
  }

  function onTest() {
    setMsg(null);
    startTest(async () => {
      const res = await sendTestAlert();
      setMsg(res.ok ? { ok: true, text: res.message } : { ok: false, text: res.error });
    });
  }

  return (
    <form action={onSave} className="rounded-xl border border-divider bg-surface p-6 shadow-sm">
      {/* Enable toggle */}
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          name="notify_enabled"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-divider text-signal focus:ring-signal"
        />
        <span>
          <span className="block text-sm font-medium text-ink">
            Instant Slack alerts
          </span>
          <span className="mt-0.5 block text-xs text-static">
            Ping me the moment a new lead clears the score below — while the thread&apos;s still warm.
          </span>
        </span>
      </label>

      <div className="mt-5">
        <label htmlFor="wh" className="block text-sm font-medium text-ink">
          Slack incoming webhook URL
        </label>
        <input
          id="wh"
          name="notify_slack_webhook"
          type="url"
          defaultValue={initial.webhook}
          placeholder="https://hooks.slack.com/services/T…/B…/…"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-static">
          Slack → Apps → Incoming Webhooks → add to a channel → copy the URL.
        </p>
      </div>

      <div className="mt-5 max-w-[16rem]">
        <label htmlFor="score" className="block text-sm font-medium text-ink">
          Alert threshold (min intent score)
        </label>
        <input
          id="score"
          name="notify_min_score"
          type="number"
          min={0}
          max={100}
          defaultValue={initial.minScore}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-static">Only leads scoring ≥ this trigger a ping. 80 is a good start.</p>
      </div>

      {msg ? (
        <p className={`mt-5 text-sm ${msg.ok ? "text-success" : "text-alert"}`}>{msg.text}</p>
      ) : null}

      <div className="mt-6 flex items-center gap-3">
        <button type="submit" disabled={saving} className="btn-signal text-sm disabled:opacity-60">
          {saving ? "Saving…" : "Save settings"}
        </button>
        <button
          type="button"
          onClick={onTest}
          disabled={testing}
          className="btn-ghost text-sm disabled:opacity-60"
        >
          {testing ? "Sending…" : "Send test alert"}
        </button>
      </div>
    </form>
  );
}
