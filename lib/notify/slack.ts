// Slack alerts via Incoming Webhook — no SDK, no keys, just a POST to the URL
// the user pastes in Settings. This is the "ping the second it lands" channel.

import "server-only";
import type { LeadAlert } from "./types";
import { sourceLabel, categoryLabel } from "./types";

function truncate(s: string, n: number): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}

/** Post one lead alert to a Slack incoming webhook. Returns true on success. */
export async function sendSlackAlert(
  webhookUrl: string,
  alert: LeadAlert,
): Promise<boolean> {
  const header = `👂 New ${alert.score}/100 lead on ${sourceLabel[alert.source]} — ${categoryLabel[alert.category]}`;
  const lines: string[] = [`*${header}*`, `> ${truncate(alert.content, 240)}`];
  if (alert.replyAngle) lines.push(`💬 *Reply angle:* ${truncate(alert.replyAngle, 200)}`);
  if (alert.url) lines.push(`<${alert.url}|Open the thread →>`);

  const body = {
    blocks: [
      {
        type: "section",
        text: { type: "mrkdwn", text: lines.join("\n") },
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok;
  } catch (err) {
    console.warn("[slack] alert failed:", err);
    return false;
  }
}
