import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Sign in — Eavesdrop",
  description: "Sign in to your Eavesdrop account.",
};

export default function SignInPage() {
  return (
    <main className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-6 py-12 md:w-1/2 md:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" aria-label="Eavesdrop home" className="text-ink">
            <Logo />
          </Link>

          <h1 className="mt-10 font-serif text-3xl font-semibold tracking-tight">
            Welcome back.
          </h1>
          <p className="mt-2 text-sm text-static">
            Pick up where your pipeline left off.
          </p>

          <form className="mt-8 space-y-4" action="/sign-in" method="post">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-ink"
              >
                Email
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
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-ink"
                >
                  Password
                </label>
                <Link
                  href="/reset-password"
                  className="text-xs text-static hover:text-ink"
                >
                  Forgot?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-md border border-divider bg-paper px-4 py-3 text-sm text-ink placeholder:text-static/70 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
              />
            </div>
            <button type="submit" className="btn-ink w-full">
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-static">
            New to Eavesdrop?{" "}
            <Link href="/sign-up" className="font-medium text-signal hover:underline">
              Start free
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden w-1/2 overflow-hidden bg-ink md:block">
        <div
          aria-hidden
          className="absolute -left-24 bottom-1/3 h-72 w-72 rounded-full bg-static/25 blur-3xl"
        />
        <div className="relative flex h-full flex-col justify-center px-16 text-paper">
          <p className="font-serif text-3xl font-semibold leading-snug">
            Your next customer is talking right now.
          </p>
          <p className="mt-4 max-w-sm text-paper/60">
            Sign in to see this week&apos;s highest-intent signals.
          </p>
        </div>
      </div>
    </main>
  );
}
