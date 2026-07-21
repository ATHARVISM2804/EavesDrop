import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { posts, getPost, type Block } from "@/lib/content/posts";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Eavesdrop`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          key={i}
          className="mt-10 font-serif text-2xl font-semibold tracking-tight text-ink"
        >
          {block.text}
        </h2>
      );
    case "quote":
      return (
        <blockquote
          key={i}
          className="my-8 border-l-2 border-signal pl-5 font-serif text-xl italic leading-snug text-ink"
        >
          {block.text}
        </blockquote>
      );
    case "ul":
      return (
        <ul key={i} className="mt-4 space-y-2.5">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-static">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    default:
      return (
        <p key={i} className="mt-5 leading-relaxed text-static">
          {block.text}
        </p>
      );
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <Nav />
      <main>
        <article className="container-content py-16 md:py-20">
          <div className="mx-auto max-w-2xl">
            <Link
              href="/blog"
              className="text-sm font-medium text-static transition-colors hover:text-ink"
            >
              ← All posts
            </Link>

            <div className="mt-6 flex items-center gap-3 text-xs">
              <span className="rounded-sm bg-signal/12 px-2 py-0.5 font-medium text-signal-dark">
                {post.tag}
              </span>
              <span className="text-static">{post.date}</span>
              <span className="h-1 w-1 rounded-full bg-divider" />
              <span className="text-static">{post.readingTime}</span>
            </div>

            <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-static">{post.excerpt}</p>

            <hr className="mt-8 border-divider" />

            <div className="mt-2">
              {post.body.map((block, i) => renderBlock(block, i))}
            </div>
          </div>
        </article>

        {more.length > 0 && (
          <section className="border-t border-divider bg-sunken/50 py-16">
            <div className="container-content">
              <h2 className="font-serif text-2xl font-semibold tracking-tight">
                Keep reading
              </h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {more.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="card card-hover flex flex-col"
                  >
                    <span className="text-xs font-medium text-signal-dark">
                      {p.tag}
                    </span>
                    <h3 className="mt-2 font-serif text-lg font-semibold leading-snug tracking-tight">
                      {p.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-static">
                      {p.excerpt}
                    </p>
                    <span className="mt-4 text-sm font-medium text-signal">
                      Read more →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <CTA />
      </main>
      <Footer />
    </>
  );
}
