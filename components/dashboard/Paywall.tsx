"use client";

import { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { createCheckoutSession } from "@/app/(dashboard)/dashboard/billing";

const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = pk ? loadStripe(pk) : null;

const benefits = [
  "Buyer-intent leads across Reddit, X & Hacker News",
  "0–100 intent scoring + category triage",
  "Suggested reply angles on every lead",
  "Scoring that learns from your feedback",
];

export function Paywall() {
  const fetchClientSecret = useCallback(async () => {
    const res = await createCheckoutSession();
    if (!res.ok) throw new Error(res.message ?? res.reason);
    return res.clientSecret;
  }, []);

  return (
    <div className="w-full max-w-md rounded-2xl border border-divider bg-surface p-7 shadow-lg">
      <span className="eyebrow">Membership</span>
      <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink">
        Unlock Eavesdrop
      </h2>
      <p className="mt-2 flex items-baseline gap-1.5">
        <span className="font-serif text-4xl font-semibold text-ink">$49</span>
        <span className="text-sm text-static">/ month</span>
      </p>

      <ul className="mt-5 space-y-2.5 border-t border-hairline pt-5">
        {benefits.map((b) => (
          <li key={b} className="flex items-start gap-2.5 text-sm text-ink">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="mt-0.5 shrink-0">
              <path d="M13.5 4.5 6.5 11.5 3 8" stroke="#D97B3F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {b}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {stripePromise ? (
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ fetchClientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        ) : (
          <div className="rounded-lg border border-dashed border-divider bg-paper/60 p-5 text-center">
            <p className="text-sm font-medium text-ink">Payments aren&apos;t set up yet</p>
            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-relaxed text-static">
              Add your Stripe keys to <code className="text-signal-dark">.env.local</code>{" "}
              (see <code className="text-signal-dark">docs/SETUP-STRIPE.md</code>) and the
              secure card form appears right here.
            </p>
            <button
              type="button"
              disabled
              className="btn-signal mt-4 w-full cursor-not-allowed opacity-50"
            >
              Subscribe — $49/mo
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-static">
        Secure payment by Stripe · cancel anytime
      </p>
    </div>
  );
}
