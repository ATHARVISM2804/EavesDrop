// Protected pipeline trigger. Runs ingest → score for all active queries (or a
// single ?queryId=). Guarded by CRON_SECRET so it's never publicly runnable.
// This is the manual trigger now and the Vercel Cron target in Phase 3.

import { NextResponse, type NextRequest } from "next/server";
import { runPipeline } from "@/lib/pipeline/run";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // scoring calls Anthropic; give it room

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // never open when unconfigured
  const header = req.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function POST(req: NextRequest) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured on the server" },
      { status: 500 },
    );
  }
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const queryId = req.nextUrl.searchParams.get("queryId") ?? undefined;

  try {
    const report = await runPipeline({ queryId });
    return NextResponse.json({ ok: true, report });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

// Vercel Cron sends GET — allow it too, same guard.
export async function GET(req: NextRequest) {
  return POST(req);
}
