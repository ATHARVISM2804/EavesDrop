import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Eavesdrop",
  description: "How Eavesdrop handles data and privacy.",
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="container-content max-w-3xl py-16 md:py-20">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-static">Last updated: Draft template</p>

        <div className="prose-editorial mt-10 space-y-8 text-sm leading-relaxed text-ink">
          <section>
            <h2 className="font-serif text-xl font-semibold">1. Overview</h2>
            <p className="mt-2 text-static">
              This is a placeholder privacy policy. Before launch, replace it
              with reviewed legal copy. Eavesdrop is committed to collecting only
              the data required to deliver the service.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold">
              2. What we collect
            </h2>
            <p className="mt-2 text-static">
              Account details (email), your tracked queries, and public post
              metadata (author usernames from public posts only). We do not
              collect private messages or data behind authentication walls on
              third-party platforms.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold">
              3. How we use it
            </h2>
            <p className="mt-2 text-static">
              To surface buyer-intent leads, personalize your scoring via your
              feedback, and operate billing. We never store more user PII than
              required.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold">4. Contact</h2>
            <p className="mt-2 text-static">
              Questions about privacy? Email{" "}
              <a
                href="mailto:privacy@eavesdrop.io"
                className="text-signal hover:underline"
              >
                privacy@eavesdrop.io
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
