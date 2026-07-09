import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { AuthForm } from "@/components/auth/AuthForm";
import { signIn } from "@/app/auth/actions";

export const metadata: Metadata = {
  title: "Sign in — Eavesdrop",
  description: "Sign in to your Eavesdrop account.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const { redirect, error } = await searchParams;
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

          {error ? (
            <p className="mt-6 rounded-md border border-alert/30 bg-alert/8 px-3 py-2 text-sm text-alert">
              {error}
            </p>
          ) : null}

          <AuthForm mode="sign-in" action={signIn} redirectTo={redirect} />

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
