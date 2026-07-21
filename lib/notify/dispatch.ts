// Alert dispatch: given fresh lead alerts and the user's settings, ping every
// channel that's enabled. Returns the raw_mention_ids we successfully notified
// (the caller marks scored_leads.notified_at so we never double-ping).

import "server-only";
import { sendSlackAlert } from "./slack";
import type { LeadAlert } from "./types";

export interface NotifySettings {
  enabled: boolean;
  slackWebhook: string | null;
  minScore: number;
}

export interface DispatchResult {
  attempted: number;
  sent: number;
  notifiedIds: string[];
}

export async function dispatchAlerts(
  settings: NotifySettings,
  alerts: LeadAlert[],
): Promise<DispatchResult> {
  const result: DispatchResult = { attempted: 0, sent: 0, notifiedIds: [] };
  if (!settings.enabled) return result;

  const toSend = alerts.filter((a) => a.score >= settings.minScore);
  result.attempted = toSend.length;
  if (toSend.length === 0) return result;

  for (const alert of toSend) {
    let ok = false;
    if (settings.slackWebhook) {
      ok = await sendSlackAlert(settings.slackWebhook, alert);
    }
    // Future channels (email, webhook) OR into `ok` here.
    if (ok) {
      result.sent++;
      result.notifiedIds.push(alert.rawMentionId);
    }
  }
  return result;
}
