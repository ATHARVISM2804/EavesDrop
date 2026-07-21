import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { caseStudies } from "@/lib/content/case-studies";

export const metadata: Metadata = {
  title: "Case studies — Eavesdrop",
  description:
    "How founders and teams turn multi-source buyer signal into pipeline with Eavesdrop.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="Case studies"
          title="Signal into pipeline, in the wild."
          subtitle="How founders and teams turn multi-source buyer signal into real conversations. Early stories below — yours could be next."
        />

        <section className="container-content pb-16">
          <div className="grid gap-6 md:grid-cols-2">
            {caseStudies.map((study) => (
              <Link
                key={study.slug}
                href={`/case-studies/${study.slug}`}
                className="card card-hover flex flex-col"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink text-xs font-semibold text-paper">
                    {study.logoInitials}
                  </span>
                  <div>
                    <span className="block text-sm font-semibold text-ink">
                      {study.company}
                    </span>
                    <span className="block text-xs text-static">
                      {study.industry}
                    </span>
                  </div>
                </div>

                <p className="mt-4 flex-1 font-serif text-lg font-semibold leading-snug tracking-tight text-ink">
                  {study.oneLiner}
                </p>

                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-hairline pt-5">
                  {study.metrics.slice(0, 3).map((m) => (
                    <div key={m.label}>
                      <span className="font-serif text-xl font-semibold text-signal-dark">
                        {m.value}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-static">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>

                <span className="mt-5 text-sm font-medium text-signal">
                  Read the story →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="container-content pb-24">
          <div className="mx-auto max-w-2xl rounded-xl border border-dashed border-divider bg-surface p-10 text-center shadow-sm">
            <h2 className="font-serif text-2xl font-semibold tracking-tight">
              Be an early case study.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-static">
              We&apos;re working with our first cohort of founders, agencies, and
              growth teams. Come on board early and we&apos;ll feature your
              results here.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/sign-up" className="btn-signal">
                Start free
              </Link>
              <Link href="/contact" className="btn-ghost">
                Talk to us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
