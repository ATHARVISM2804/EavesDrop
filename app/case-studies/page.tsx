import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";

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
          subtitle="We're gathering the first stories now. Want to be one of them?"
        />

        <section className="container-content pb-24">
          <div className="mx-auto max-w-2xl rounded-lg border border-dashed border-divider bg-paper p-10 text-center">
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
