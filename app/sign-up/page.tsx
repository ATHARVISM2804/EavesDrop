import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { AuthForm } from "@/components/auth/AuthForm";
import { signUp } from "@/app/auth/actions";

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

          <AuthForm mode="sign-up" action={signUp} />

          <p className="mt-6 text-center text-sm text-static">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-signal hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right: brand panel */}
      <div className="grain relative hidden w-1/2 overflow-hidden bg-ink md:block">
        <div
          aria-hidden
          className="absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-signal/20 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -left-20 bottom-16 h-64 w-64 rounded-full bg-static/20 blur-3xl"
        />
        <div className="relative flex h-full flex-col justify-center px-16 text-paper">
          <p className="font-serif text-4xl font-semibold leading-snug">
            “We listen where your buyers talk.”
          </p>
          <p className="mt-4 max-w-sm text-paper/60">
            Reddit, X, and Hacker News — scored for buying intent and sorted so
            you reply while it&apos;s hot.
          </p>

          <ul className="mt-10 space-y-3">
            {[
              "10 free leads a week, no credit card",
              "Intent scoring & category triage",
              "Scoring that learns from your feedback",
            ].map((point) => (
              <li key={point} className="flex items-center gap-3 text-sm text-paper/80">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path
                    d="M13.5 4.5 6.5 11.5 3 8"
                    stroke="#D97B3F"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
