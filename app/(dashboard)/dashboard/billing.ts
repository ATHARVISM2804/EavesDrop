"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getStripe, stripeConfigured } from "@/lib/stripe/client";

export type CheckoutInit =
  | { ok: true; clientSecret: string }
  | { ok: false; reason: "not_configured" | "unauthenticated" | "error"; message?: string };

/** Ensure the user has a Stripe customer, then open an embedded subscription
 * Checkout Session and return its client secret for the Payment element. */
export async function createCheckoutSession(): Promise<CheckoutInit> {
  if (!stripeConfigured()) return { ok: false, reason: "not_configured" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "unauthenticated" };

  try {
    const stripe = getStripe();
    const service = createServiceClient();

    // Reuse or create the Stripe customer for this user.
    const { data: row } = await service
      .from("users")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId = row?.stripe_customer_id as string | null | undefined;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      await service
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      ui_mode: "embedded_page", // renamed from "embedded" in the pinned API version
      customer: customerId,
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      client_reference_id: user.id,
      subscription_data: { metadata: { supabase_user_id: user.id } },
      return_url: `${base}/api/stripe/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    if (!session.client_secret) {
      return { ok: false, reason: "error", message: "No client secret returned." };
    }
    return { ok: true, clientSecret: session.client_secret };
  } catch (err) {
    return {
      ok: false,
      reason: "error",
      message: err instanceof Error ? err.message : String(err),
    };
  }
}
