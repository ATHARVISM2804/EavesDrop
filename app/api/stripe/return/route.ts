// Embedded Checkout return_url handler. Confirms the session server-side and
// unlocks access immediately — so it works locally even before webhooks are set
// up (the webhook remains the durable source of truth in production).

import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) return NextResponse.redirect(`${base}/dashboard`);

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    if (session.status === "complete" && session.customer) {
      const sub = session.subscription as Stripe.Subscription | string | null;
      const status = typeof sub === "object" && sub ? sub.status : "active";
      const subId = typeof sub === "object" && sub ? sub.id : (sub ?? null);
      await createServiceClient()
        .from("users")
        .update({ subscription_status: status, stripe_subscription_id: subId })
        .eq("stripe_customer_id", session.customer as string);
    }
  } catch {
    // Fall through — webhook will reconcile; just send them back to the dashboard.
  }

  return NextResponse.redirect(`${base}/dashboard?subscribed=1`);
}
