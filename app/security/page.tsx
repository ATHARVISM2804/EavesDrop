import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Security & data handling — Eavesdrop",
  description:
    "How Eavesdrop handles your data: public-source listening only, account-scoped leads and personalization, encryption in transit and at rest, and no shared training on your feedback.",
};

const pillars = [
  {
    title: "Public sources only",
    body: "Eavesdrop reads public conversations through official search endpoints and public APIs — the same posts anyone can see. We don't scrape private data, automate accounts, or post on your behalf. You reply as yourself.",
  },
  {
    title: "Your data stays yours",
    body: "Queries, leads, and feedback are scoped to your account and never sold or shared. The personalization weights that tune your scoring are unique to you and never pooled into a shared model.",
  },
  {
    title: "Encrypted end to end",
    body: "All traffic is served over TLS, and data is encrypted at rest by our infrastructure providers. Access to production systems is limited and audited.",
  },
  {
    title: "Built on trusted infrastructure",
    body: "We build on established, SOC 2-compliant providers for hosting, authentication, and our database, so your account sits on a hardened foundation rather than something we rolled ourselves.",
  },
  {
    title: "Platform-safe by design",
    body: "Because we listen across multiple sources and stay within each platform's public API terms, there's no gray-area scraping and no single point of failure if one source changes its policy.",
  },
  {
    title: "Delete on request",
    body: "Close your account and we remove your queries, leads, and personalization data. Want an export or deletion before then? Reach out and we'll handle it promptly.",
  },
];

export default function SecurityPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="Security"
          title="Built to listen — responsibly."
          subtitle="Eavesdrop only reads what's already public, keeps your data scoped to your account, and never trains a shared model on your feedback. Here's exactly how."
        />

        <section className="container-content pb-20">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.title} className="card flex flex-col">
                <h2 className="font-serif text-xl font-semibold tracking-tight">
                  {p.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-static">
                  {p.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-divider bg-surface p-6 text-center shadow-sm">
            <p className="text-sm text-static">
              Have a security question or need documentation for a review?{" "}
              <Link href="/contact" className="font-medium text-signal hover:underline">
                Get in touch
              </Link>{" "}
              — or read our{" "}
              <Link href="/privacy" className="font-medium text-signal hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
