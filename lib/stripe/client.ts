import "server-only";
import Stripe from "stripe";

// Pinned to the version bundled with the installed SDK (keeps TS types aligned).
const API_VERSION = "2026-06-24.dahlia";

export class StripeNotConfiguredError extends Error {
  constructor() {
    super("Stripe is not configured — set STRIPE_SECRET_KEY / STRIPE_PRICE_ID.");
    this.name = "StripeNotConfiguredError";
  }
}

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new StripeNotConfiguredError();
  if (!stripe) stripe = new Stripe(key, { apiVersion: API_VERSION as Stripe.LatestApiVersion });
  return stripe;
}

/** True only when every key needed to run embedded checkout is present. */
export function stripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_PRICE_ID &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  );
}

/** A subscription that grants dashboard access. */
export function isActiveStatus(status: string | null | undefined): boolean {
  return status === "active" || status === "trialing";
}
