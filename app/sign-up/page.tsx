import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Start free — Eavesdrop",
  description: "Create your Eavesdrop account and start finding buyers today.",
};

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen">
      {/* Left: form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 md:w-1/2 md:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" aria-label="Eavesdrop home" className="text-ink">
            <Logo />
          </Link>

          <h1 className="mt-10 font-serif text-3xl font-semibold tracking-tight">
            Start listening.
          </h1>
          <p className="mt-2 text-sm text-static">
            Free tier, no credit card. 10 leads a week on us.
          </p>

          {/* Placeholder form — auth wired up in Phase 1b (Supabase) */}
          <form className="mt-8 space-y-4" action="/sign-up" method="post">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-ink"
              >
                Work email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                className="mt-1.5 w-full rounded-md border border-divider bg-paper px-4 py-3 text-sm text-ink placeholder:text-static/70 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-ink"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-md border border-divider bg-paper px-4 py-3 text-sm text-ink placeholder:text-static/70 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
              />
            </div>
            <button type="submit" className="btn-signal w-full">
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-static">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-signal hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right: brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-ink md:block">
        <div
          aria-hidden
          className="absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-signal/20 blur-3xl"
        />
        <div className="relative flex h-full flex-col justify-center px-16 text-paper">
          <p className="font-serif text-3xl font-semibold leading-snug">
            “We listen where your buyers talk.”
          </p>
          <p className="mt-4 max-w-sm text-paper/60">
            Reddit, X, and Hacker News — scored for buying intent and sorted so
            you reply while it&apos;s hot.
          </p>
        </div>
      </div>
    </main>
  );
}
