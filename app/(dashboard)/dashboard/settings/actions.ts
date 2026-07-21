"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { sendSlackAlert } from "@/lib/notify/slack";

export type SaveResult = { ok: true; message: string } | { ok: false; error: string };

export async function saveAlertSettings(formData: FormData): Promise<SaveResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const enabled = formData.get("notify_enabled") === "on";
  const webhook = String(formData.get("notify_slack_webhook") ?? "").trim();
  const minScore = Math.max(0, Math.min(100, Number(formData.get("notify_min_score")) || 80));

  if (webhook && !/^https:\/\/hooks\.slack\.com\//.test(webhook)) {
    return { ok: false, error: "That doesn't look like a Slack incoming webhook URL." };
  }
  if (enabled && !webhook) {
    return { ok: false, error: "Add a Slack webhook to enable alerts." };
  }

  const { error } = await createServiceClient()
    .from("users")
    .update({
      notify_enabled: enabled,
      notify_slack_webhook: webhook || null,
      notify_min_score: minScore,
    })
    .eq("id", user.id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/settings");
  return { ok: true, message: "Alert settings saved." };
}

export async function sendTestAlert(): Promise<SaveResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { data } = await createServiceClient()
    .from("users")
    .select("notify_slack_webhook")
    .eq("id", user.id)
    .single();

  const webhook = data?.notify_slack_webhook as string | null;
  if (!webhook) return { ok: false, error: "Add and save a Slack webhook first." };

  const ok = await sendSlackAlert(webhook, {
    rawMentionId: "test",
    source: "reddit",
    score: 94,
    category: "switching_signal",
    content:
      "Anyone found a solid alternative to [competitor] that isn't $99/mo? — (this is a test alert from Eavesdrop)",
    url: "https://www.reddit.com",
    replyAngle: "Lead with the price gap and mention your usage-based tier.",
  });

  return ok
    ? { ok: true, message: "Test alert sent — check Slack." }
    : { ok: false, error: "Slack rejected it — double-check the webhook URL." };
}
