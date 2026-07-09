import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LeadCard, type LeadCardData } from "@/components/dashboard/LeadCard";
import type { IntentCategory, LeadFeedback, Source } from "@/lib/scoring/types";

export const metadata: Metadata = {
  title: "Leads — Eavesdrop",
};

// Never cache a signed-in user's feed.
export const dynamic = "force-dynamic";

type LeadRow = {
  id: string;
  intent_score: number;
  intent_category: IntentCategory;
  reasoning: string | null;
  suggested_reply_angle: string | null;
  user_feedback: LeadFeedback | null;
  raw_mention: {
    source: Source;
    url: string | null;
    author: string | null;
    content: string;
    posted_at: string | null;
  } | null;
};

export default async function LeadsPage() {
  const supabase = await createClient();

  // Does the user track anything yet? Drives the "no queries" vs "no leads yet"
  // empty states.
  const { count: queryCount } = await supabase
    .from("tracked_queries")
    .select("id", { count: "exact", head: true });

  const { data, error } = await supabase
    .from("scored_leads")
    .select(
      `id, intent_score, intent_category, reasoning, suggested_reply_angle, user_feedback,
       raw_mention:raw_mentions!inner (source, url, author, content, posted_at)`,
    )
    .neq("intent_category", "noise")
    .order("intent_score", { ascending: false })
    .limit(100);

  const rows = (data ?? []) as unknown as LeadRow[];
  const leads: LeadCardData[] = rows
    .filter((r) => r.raw_mention !== null)
    .map((r) => ({
      id: r.id,
      source: r.raw_mention!.source,
      author: r.raw_mention!.author,
      content: r.raw_mention!.content,
      url: r.raw_mention!.url,
      postedAt: r.raw_mention!.posted_at,
      score: r.intent_score,
      category: r.intent_category,
      reasoning: r.reasoning,
      replyAngle: r.suggested_reply_angle,
      feedback: r.user_feedback,
    }));

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-ink">
            Your leads
          </h1>
          <p className="mt-1 text-sm text-static">
            Highest buyer-intent first. React to teach Eavesdrop what a good lead
            looks like for you.
          </p>
        </div>
        <Link href="/dashboard/queries" className="btn-ink shrink-0 text-sm">
          Manage queries
        </Link>
      </div>

      {error ? (
        <p className="mt-8 rounded-md border border-alert/30 bg-alert/8 px-4 py-3 text-sm text-alert">
          Couldn&apos;t load your leads: {error.message}
        </p>
      ) : queryCount === 0 ? (
        <EmptyState
          title="No tracked queries yet"
          body="Tell Eavesdrop what you sell and who your competitors are. We'll start listening across Reddit, X, and Hacker News."
          cta={{ href: "/dashboard/queries", label: "Create your first query" }}
        />
      ) : leads.length === 0 ? (
        <EmptyState
          title="Listening…"
          body="No scored leads yet. New mentions are fetched and scored on a schedule — check back shortly."
        />
      ) : (
        <ul className="mt-6 space-y-3">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </ul>
      )}
    </div>
  );
}

function EmptyState({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="mt-8 rounded-lg border border-dashed border-divider bg-paper px-6 py-12 text-center">
      <h2 className="font-serif text-lg font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-static">{body}</p>
      {cta ? (
        <Link href={cta.href} className="btn-signal mt-5 inline-flex text-sm">
          {cta.label}
        </Link>
      ) : null}
    </div>
  );
}
