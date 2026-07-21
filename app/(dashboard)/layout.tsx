import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { Paywall } from "@/components/dashboard/Paywall";
import { isActiveStatus } from "@/lib/stripe/client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-suspenders: middleware already guards /dashboard, but never render
  // authed UI without a verified user.
  if (!user) {
    redirect("/sign-in?redirect=/dashboard");
  }

  // Paywall gate: dashboard access requires an active subscription.
  // DEMO_MODE=true bypasses the paywall entirely (free demo — no Stripe, and
  // migration 0002 isn't even required). Turn it OFF for production.
  let subscribed = process.env.DEMO_MODE === "true";
  if (!subscribed) {
    const { data: row } = await supabase
      .from("users")
      .select("subscription_status")
      .eq("id", user.id)
      .single();
    subscribed = isActiveStatus(row?.subscription_status);
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-20 border-b border-divider bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link href="/dashboard" aria-label="Eavesdrop dashboard" className="text-ink">
            <Logo />
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {subscribed ? (
              <>
                <Link href="/dashboard" className="font-medium text-ink hover:text-signal">
                  Leads
                </Link>
                <Link href="/dashboard/queries" className="text-static hover:text-ink">
                  Queries
                </Link>
                <Link href="/dashboard/settings" className="text-static hover:text-ink">
                  Alerts
                </Link>
              </>
            ) : null}
            <span className="hidden text-xs text-static sm:inline">{user.email}</span>
            <form action={signOut}>
              <button type="submit" className="text-sm text-static hover:text-ink">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {subscribed ? (
          children
        ) : (
          <div className="relative min-h-[75vh]">
            {/* The real dashboard, blurred + inert behind the paywall */}
            <div aria-hidden className="pointer-events-none select-none blur-[6px] saturate-50 opacity-50">
              {children}
            </div>
            {/* Paywall overlay */}
            <div className="absolute inset-0 z-10 flex items-start justify-center bg-paper/50 pt-8 backdrop-blur-[2px] sm:pt-12">
              <Paywall />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
