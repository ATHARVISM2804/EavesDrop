import Link from "next/link";
import { Logo } from "./Logo";

const columns = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Demo", href: "/#demo" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Case studies", href: "/case-studies" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="container-content grid gap-10 py-16 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo className="text-paper" />
          <p className="mt-4 text-sm leading-relaxed text-paper/60">
            We listen where your buyers talk. Multi-source buyer-intent lead
            generation with scoring that learns from you.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.heading}>
            <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-paper/40">
              {col.heading}
            </h3>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-paper/70 transition-colors hover:text-signal"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-paper/10">
        <div className="container-content flex flex-col items-center justify-between gap-2 py-6 text-xs text-paper/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Eavesdrop. All rights reserved.</p>
          <p>Built to listen.</p>
        </div>
      </div>
    </footer>
  );
}
