"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import type { AuthState } from "@/app/auth/actions";

type Mode = "sign-in" | "sign-up";

const inputClass =
  "mt-1.5 w-full rounded-md border border-divider bg-surface px-4 py-3 text-sm text-ink shadow-xs transition-colors placeholder:text-static/70 focus:border-signal/60 focus:outline-none";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-ink w-full disabled:opacity-60">
      {pending ? "One moment…" : label}
    </button>
  );
}

export function AuthForm({
  mode,
  action,
  redirectTo,
}: {
  mode: Mode;
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
  redirectTo?: string;
}) {
  const [state, formAction] = useActionState<AuthState, FormData>(action, null);
  const isSignUp = mode === "sign-up";

  return (
    <form className="mt-8 space-y-4" action={formAction}>
      {redirectTo ? (
        <input type="hidden" name="redirect" value={redirectTo} />
      ) : null}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className={inputClass}
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-ink">
            Password
          </label>
          {!isSignUp && (
            <Link href="/reset-password" className="text-xs text-static hover:text-ink">
              Forgot?
            </Link>
          )}
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={isSignUp ? 8 : undefined}
          autoComplete={isSignUp ? "new-password" : "current-password"}
          placeholder="••••••••"
          className={inputClass}
        />
        {isSignUp && (
          <p className="mt-1.5 text-xs text-static">At least 8 characters.</p>
        )}
      </div>

      {state && "error" in state ? (
        <p className="rounded-md border border-alert/30 bg-alert/8 px-3 py-2 text-sm text-alert">
          {state.error}
        </p>
      ) : null}
      {state && "message" in state ? (
        <p className="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
          {state.message}
        </p>
      ) : null}

      <SubmitButton label={isSignUp ? "Create account" : "Sign in"} />
    </form>
  );
}
