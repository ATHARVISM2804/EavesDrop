import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — Eavesdrop",
  description: "The terms governing your use of Eavesdrop.",
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="container-content max-w-3xl py-16 md:py-20">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-static">Last updated: Draft template</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-ink">
          <section>
            <h2 className="font-serif text-xl font-semibold">
              1. Agreement
            </h2>
            <p className="mt-2 text-static">
              This is a placeholder terms document. Replace with reviewed legal
              copy before launch. By using Eavesdrop you agree to these terms.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold">2. The service</h2>
            <p className="mt-2 text-static">
              Eavesdrop surfaces publicly available posts scored for buyer
              intent. We make no guarantee that any lead will convert. You are
              responsible for how you engage the people surfaced.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold">
              3. Acceptable use
            </h2>
            <p className="mt-2 text-static">
              Don&apos;t use Eavesdrop to spam, harass, or violate the terms of
              the platforms we monitor. We may suspend accounts that do.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold">4. Billing</h2>
            <p className="mt-2 text-static">
              Paid plans are billed via Stripe. Usage-based charges, where
              applicable, are metered and shown before they apply.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold">5. Contact</h2>
            <p className="mt-2 text-static">
              Questions? Email{" "}
              <a
                href="mailto:legal@eavesdrop.io"
                className="text-signal hover:underline"
              >
                legal@eavesdrop.io
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
