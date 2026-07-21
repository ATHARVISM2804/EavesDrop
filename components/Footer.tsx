import Link from "next/link";
import { Logo } from "./Logo";

const columns: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Lead Gen", href: "/lead-gen" },
      { label: "Monitors", href: "/monitors" },
      { label: "Compete", href: "/compete" },
      { label: "Content", href: "/content" },
      { label: "MCP", href: "/mcp" },
      { label: "All features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Use cases",
    links: [
      { label: "Reddit lead generation", href: "/lead-gen" },
      { label: "Buyer-intent monitoring", href: "/monitors" },
      { label: "Competitor intelligence", href: "/compete" },
      { label: "Reply drafting", href: "/content" },
      { label: "Eavesdrop in Claude", href: "/mcp" },
    ],
  },
  {
    heading: "Compare",
    links: [
      { label: "All alternatives", href: "/alternatives" },
      { label: "Eavesdrop vs. Linkeddit", href: "/vs/linkeddit" },
      { label: "Eavesdrop vs. F5Bot", href: "/vs/f5bot" },
      { label: "F5Bot alternative", href: "/alternatives" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Case studies", href: "/case-studies" },
      { label: "Security", href: "/security" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Sign in", href: "/sign-in" },
      { label: "Start free", href: "/sign-up" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

/**
 * Light editorial footer closing on an oversized ghosted wordmark — the
 * reference's sign-off. The wordmark is clipped by the section, so it reads as
 * the brand receding off the bottom of the page rather than as a headline.
 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-divider bg-paper">
      <div className="container-content grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-6">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo className="text-ink" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-static">
            Buyer-intent lead generation across the channels where buying
            decisions actually get discussed.
          </p>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-divider px-3 py-1.5 text-xs text-static transition-colors hover:border-static-soft hover:text-ink"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M18.9 1.6h3.7l-8 9.2 9.4 12.4h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.6h7.6l5.2 6.9 6.1-6.9Zm-1.3 19.4h2L6.5 3.7H4.4l13.2 17.3Z" />
            </svg>
            Follow along
          </a>
        </div>

        {columns.map((col) => (
          <div key={col.heading}>
            <h3 className="text-[11px] font-medium uppercase tracking-eyebrow text-static-soft">
              {col.heading}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-static transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-divider">
        <div className="container-content flex flex-col items-center justify-between gap-2 py-6 text-xs text-static-soft sm:flex-row">
          <p>
            © {new Date().getFullYear()} Eavesdrop. Not affiliated with Reddit, X,
            or Hacker News.
          </p>
          <p>Built to listen.</p>
        </div>
      </div>

      {/* Oversized ghosted wordmark — clipped by the footer's bottom edge */}
      <div
        aria-hidden
        className="pointer-events-none select-none px-6 pt-4"
        style={{ marginBottom: "-0.22em" }}
      >
        <p className="text-center text-[19vw] font-semibold leading-[0.78] tracking-display text-ink/[0.045]">
          Eavesdrop
        </p>
      </div>
    </footer>
  );
}
