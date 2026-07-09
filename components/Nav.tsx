import Link from "next/link";
import { Logo } from "./Logo";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Demo", href: "/#demo" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-divider/70 bg-paper/80 backdrop-blur-md">
      <nav className="container-content flex h-16 items-center justify-between">
        <Link href="/" aria-label="Eavesdrop home" className="text-ink">
          <Logo />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-static transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden text-sm text-static transition-colors hover:text-ink sm:inline-flex"
          >
            Sign in
          </Link>
          <Link href="/sign-up" className="btn-signal">
            Start free
          </Link>
        </div>
      </nav>
    </header>
  );
}
