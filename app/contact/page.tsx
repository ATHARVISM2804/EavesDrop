import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Contact — Eavesdrop",
  description: "Questions about Eavesdrop? Get in touch.",
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="Contact"
          title="Let's talk."
          subtitle="Sales questions, partnerships, or just curious — we read everything."
        />

        <section className="container-content pb-24">
          <div className="mx-auto max-w-lg">
            {/* Placeholder form — wire to an email/CRM handler in Phase 1b. */}
            <form className="space-y-5" action="/contact" method="post">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-ink"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="mt-1.5 w-full rounded-md border border-divider bg-paper px-4 py-3 text-sm text-ink focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-ink"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="mt-1.5 w-full rounded-md border border-divider bg-paper px-4 py-3 text-sm text-ink focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-ink"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="mt-1.5 w-full rounded-md border border-divider bg-paper px-4 py-3 text-sm text-ink focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
                />
              </div>
              <button type="submit" className="btn-signal w-full">
                Send message
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-static">
              Prefer email? Reach us at{" "}
              <a
                href="mailto:hello@eavesdrop.io"
                className="text-signal hover:underline"
              >
                hello@eavesdrop.io
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
