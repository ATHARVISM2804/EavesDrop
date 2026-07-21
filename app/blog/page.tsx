import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { posts } from "@/lib/content/posts";

export const metadata: Metadata = {
  title: "Blog — Eavesdrop",
  description:
    "Field notes on buyer intent, social listening, and building a smarter lead engine.",
};

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
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card card-hover flex flex-col"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-sm bg-signal/12 px-2 py-0.5 font-medium text-signal-dark">
                    {post.tag}
                  </span>
                  <span className="text-static">{post.readingTime}</span>
                </div>
                <h2 className="mt-4 font-serif text-xl font-semibold leading-snug tracking-tight">
                  {post.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-static">
                  {post.excerpt}
                </p>
                <span className="mt-6 text-sm font-medium text-signal">
                  Read more →
                </span>
              </Link>
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
