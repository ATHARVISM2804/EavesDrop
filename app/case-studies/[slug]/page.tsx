import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { caseStudies, getCaseStudy } from "@/lib/content/case-studies";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const title = `${study.company} — Eavesdrop case study`;
  return {
    title,
    description: study.oneLiner,
    openGraph: { title, description: study.oneLiner, type: "article" },
  };
}

function Section({ heading, body }: { heading: string; body: string }) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink">
        {heading}
      </h2>
      <p className="mt-4 leading-relaxed text-static">{body}</p>
    </div>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="py-16 md:py-20">
          <div className="container-content max-w-3xl">
            <Link
              href="/case-studies"
              className="text-sm font-medium text-static transition-colors hover:text-ink"
            >
              ← All case studies
            </Link>

            <div className="mt-6 flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ink text-sm font-semibold text-paper">
                {study.logoInitials}
              </span>
              <div>
                <span className="block text-sm font-semibold text-ink">
                  {study.company}
                </span>
                <span className="block text-xs text-static">{study.industry}</span>
              </div>
            </div>

            <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
              {study.oneLiner}
            </h1>

            {study.illustrative && (
              <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-divider bg-surface px-3 py-1 text-xs text-static">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                Illustrative example — representative scenario, not a named customer
              </p>
            )}
          </div>
        </section>

        {/* Metrics */}
        <section className="border-y border-divider bg-surface">
          <div className="container-content">
            <dl className="grid grid-cols-1 divide-y divide-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {study.metrics.map((m) => (
                <div key={m.label} className="px-4 py-8 text-center">
                  <dd className="font-serif text-4xl font-semibold tracking-tight text-ink">
                    {m.value}
                  </dd>
                  <dt className="mt-2 text-sm text-static">{m.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Narrative */}
        <article className="container-content py-16">
          <div className="mx-auto max-w-3xl space-y-10">
            <Section heading="The challenge" body={study.challenge} />
            <Section heading="The approach" body={study.approach} />

            <blockquote className="border-l-2 border-signal pl-6">
              <p className="font-serif text-2xl italic leading-snug text-ink">
                “{study.quote.text}”
              </p>
              <footer className="mt-4 text-sm text-static">
                <span className="font-semibold text-ink">{study.quote.name}</span>{" "}
                · {study.quote.role}
              </footer>
            </blockquote>

            <Section heading="The outcome" body={study.outcome} />
          </div>
        </article>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
