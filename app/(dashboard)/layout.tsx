import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";

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

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-10 border-b border-divider bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link href="/dashboard" aria-label="Eavesdrop dashboard" className="text-ink">
            <Logo />
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="font-medium text-ink hover:text-signal">
              Leads
            </Link>
            <Link href="/dashboard/queries" className="text-static hover:text-ink">
              Queries
            </Link>
            <span className="hidden text-xs text-static sm:inline">{user.email}</span>
            <form action={signOut}>
              <button type="submit" className="text-sm text-static hover:text-ink">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
