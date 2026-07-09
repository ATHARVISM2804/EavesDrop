import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Blog — Eavesdrop",
  description:
    "Field notes on buyer intent, social listening, and building a smarter lead engine.",
};

// Placeholder posts — replace with real content (or a CMS/MDX source) later.
const posts = [
  {
    title: "Why single-source social listening is a dead end",
    excerpt:
      "Reddit-only tools live and die by one platform's API policy. Here's why coverage is a moat.",
    tag: "Positioning",
    date: "Coming soon",
  },
  {
    title: "Scoring buyer intent without lighting money on fire",
    excerpt:
      "A two-pass approach: cheap first-pass on everything, careful escalation only on the close calls.",
    tag: "Engineering",
    date: "Coming soon",
  },
  {
    title: "The feedback loop that makes scoring feel personal",
    excerpt:
      "How a thumbs up or down quietly retrains the model to think like your best SDR.",
    tag: "Product",
    date: "Coming soon",
  },
];

export default function BlogPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="Blog"
          title="Field notes on listening for intent."
          subtitle="Writing about buyer signal, lead gen, and building Eavesdrop in public."
        />

        <section className="container-content pb-24">
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <article key={post.title} className="card flex flex-col">
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-sm bg-signal/12 px-2 py-0.5 font-medium text-signal">
                    {post.tag}
                  </span>
                  <span className="text-static">{post.date}</span>
                </div>
                <h2 className="mt-4 font-serif text-xl font-semibold leading-snug tracking-tight">
                  {post.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-static">
                  {post.excerpt}
                </p>
                <span className="mt-6 text-sm font-medium text-static">
                  Coming soon →
                </span>
              </article>
            ))}
          </div>

          <p className="mt-12 text-center text-sm text-static">
            Want these in your inbox?{" "}
            <Link href="/sign-up" className="text-signal hover:underline">
              Start free
            </Link>{" "}
            and we&apos;ll keep you posted.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
