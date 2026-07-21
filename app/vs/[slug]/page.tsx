import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { CompareTable } from "@/components/marketing/CompareTable";
import { competitors, getCompetitor } from "@/lib/content/competitors";

export function generateStaticParams() {
  return competitors.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCompetitor(slug);
  if (!c) return {};
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    openGraph: { title: c.metaTitle, description: c.metaDescription, type: "article" },
  };
}

export default async function VsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCompetitor(slug);
  if (!c) notFound();

  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="py-20 md:py-24">
          <div className="container-content max-w-3xl">
            <span className="eyebrow">Compare</span>
            <h1 className="mt-4 font-serif text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              {c.heading}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-static">{c.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/sign-up" className="btn-signal">
                Start free
              </Link>
              <Link href="/features" className="btn-ghost">
                See all features
              </Link>
            </div>
          </div>
        </section>

        {/* Head-to-head table */}
        <section className="pb-8">
          <div className="container-content">
            <CompareTable
              rowHeader="Capability"
              columns={[
                { key: "eavesdrop", label: "Eavesdrop", featured: true },
                { key: "competitor", label: c.name, sublabel: c.descriptor },
              ]}
              rows={c.rows}
            />
          </div>
        </section>

        {/* Honest "where they're good" + why switch */}
        <section className="py-16">
          <div className="container-content grid gap-10 lg:grid-cols-2">
            <div className="rounded-xl border border-divider bg-surface p-8 shadow-sm">
              <h2 className="font-serif text-2xl font-semibold tracking-tight">
                Where {c.name} shines
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-static">
                {c.theyreGoodAt}
              </p>
            </div>
            <div className="rounded-xl border border-signal/30 bg-signal/[0.04] p-8 shadow-sm">
              <h2 className="font-serif text-2xl font-semibold tracking-tight">
                Why teams choose Eavesdrop
              </h2>
              <ul className="mt-5 space-y-4">
                {c.whyEavesdrop.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-relaxed text-ink">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden
                      className="mt-0.5 shrink-0"
                    >
                      <path
                        d="M13.5 4.5 6.5 11.5 3 8"
                        stroke="#D97B3F"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="container-content mt-10">
            <p className="text-sm text-static">
              Comparing something else? See our{" "}
              <Link href="/alternatives" className="font-medium text-signal hover:underline">
                full rundown of Reddit lead-gen alternatives
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
