import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AlertSettingsForm } from "@/components/dashboard/AlertSettingsForm";

export const metadata: Metadata = { title: "Settings — Eavesdrop" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("users")
    .select("notify_enabled, notify_slack_webhook, notify_min_score")
    .eq("id", user!.id)
    .single();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-serif text-2xl font-semibold tracking-tight text-ink">
        Alerts
      </h1>
      <p className="mt-1 text-sm text-static">
        Reddit and HN threads go cold fast. Get pinged within minutes of a
        high-intent lead landing — reply angle included.
      </p>

      <div className="mt-6">
        <AlertSettingsForm
          initial={{
            enabled: data?.notify_enabled ?? false,
            webhook: data?.notify_slack_webhook ?? "",
            minScore: data?.notify_min_score ?? 80,
          }}
        />
      </div>
    </div>
  );
}
