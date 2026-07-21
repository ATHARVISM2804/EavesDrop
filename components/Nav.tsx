import Link from "next/link";
import { Logo } from "./Logo";

const productMenu: { label: string; href: string; desc: string }[] = [
  { label: "Lead Gen", href: "/lead-gen", desc: "Find buyers ready to buy, scored by intent" },
  { label: "Monitors", href: "/monitors", desc: "Always-on keyword & competitor tracking" },
  { label: "Compete", href: "/compete", desc: "Competitor intel & switch-ready buyers" },
  { label: "Content", href: "/content", desc: "Turn signals into authentic replies" },
  { label: "MCP", href: "/mcp", desc: "Use Eavesdrop inside Claude" },
  { label: "All features", href: "/features", desc: "The whole loop, end to end" },
];

const navLinks = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Compare", href: "/alternatives" },
  { label: "Pricing", href: "/pricing" },
];

function ProductDropdown() {
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-static transition-colors group-hover:text-ink"
      >
        Product
        <svg
          width="11"
          height="11"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
          className="mt-0.5 transition-transform duration-200 group-hover:rotate-180"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* pt-3 bridges the gap so the panel survives the pointer crossing it */}
      <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-1 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <div className="grid w-[520px] grid-cols-2 gap-1 rounded-2xl border border-divider bg-surface p-2 shadow-lg">
          {productMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group/item flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-sunken"
            >
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-static-soft transition-colors group-hover/item:bg-signal" />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ink">{item.label}</span>
                <span className="mt-0.5 block text-xs leading-snug text-static">
                  {item.desc}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Floating pill nav — detached from the page edge so the hero atmosphere shows
 * through beneath it. Translucent + blurred rather than solid, so it reads as
 * glass over the plate.
 */
export function Nav() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4 md:px-6">
      <nav className="mx-auto flex h-14 max-w-content items-center justify-between rounded-full border border-white/40 bg-paper/60 pl-5 pr-2 shadow-pill backdrop-blur-xl backdrop-saturate-150">
        <Link
          href="/"
          aria-label="Eavesdrop home"
          className="rounded text-ink transition-opacity hover:opacity-70"
        >
          <Logo />
        </Link>

        <div className="hidden items-center gap-0.5 md:flex">
          <ProductDropdown />
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm text-static transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="/sign-in"
            className="hidden rounded-md px-3 py-1.5 text-sm text-static transition-colors hover:text-ink sm:inline-flex"
          >
            Sign in
          </Link>
          <Link href="/sign-up" className="btn-signal rounded-full">
            Start free
          </Link>
        </div>
      </nav>
    </header>
  );
}
