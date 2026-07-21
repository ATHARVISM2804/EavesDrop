import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { Reveal } from "@/components/anim/Reveal";
import type { Product, ProductFeature } from "@/lib/content/products";

function Check({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M13.5 4.5 6.5 11.5 3 8"
        stroke="#D97B3F"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// A branded faux-UI panel built from the feature's points — gives each block a
// visual without hand-drawing a unique mock per feature.
function FeaturePreview({ feature }: { feature: ProductFeature }) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-4 -z-10 rounded-2xl bg-dot-grid opacity-60 [mask-image:radial-gradient(70%_70%_at_50%_40%,#000,transparent)]"
      />
      <div className="overflow-hidden rounded-xl border border-divider bg-surface shadow-lg">
        <div className="flex items-center gap-2 border-b border-hairline bg-sunken/60 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-alert/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-signal/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/50" />
          <span className="ml-2 text-[11px] font-medium text-static">{feature.label}</span>
        </div>
        <ul className="divide-y divide-hairline">
          {feature.points.map((p) => (
            <li key={p} className="flex items-center gap-3 px-5 py-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-signal/12">
                <Check />
              </span>
              <span className="text-sm text-ink">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ProductPage({ product }: { product: Product }) {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden py-20 md:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-24 -z-10 h-[30rem] w-[30rem] rounded-full bg-signal/10 blur-3xl"
          />
          <div className="container-content max-w-3xl">
            <span className="eyebrow">{product.eyebrow}</span>
            <h1 className="mt-4 font-serif text-5xl font-semibold leading-[1.04] tracking-tight md:text-6xl">
              {product.title}
              {product.titleItalic ? (
                <>
                  {" "}
                  <span className="italic text-signal">{product.titleItalic}</span>
                </>
              ) : null}
              .
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-static">{product.intro}</p>
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

        {/* Feature blocks (alternating) */}
        <div className="container-content space-y-20 pb-8 md:space-y-28">
          {product.features.map((f, i) => (
            <Reveal key={f.label}>
              <section className="grid items-center gap-10 md:grid-cols-2">
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <span className="eyebrow">{f.label}</span>
                  <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight">
                    {f.title}
                  </h2>
                  <p className="mt-4 text-static">{f.body}</p>
                  <ul className="mt-6 space-y-3">
                    {f.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-sm text-ink">
                        <Check className="mt-0.5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={i % 2 === 1 ? "md:order-1" : ""}>
                  <FeaturePreview feature={f} />
                </div>
              </section>
            </Reveal>
          ))}
        </div>

        {/* MCP-style steps */}
        {product.steps ? (
          <section className="py-16">
            <div className="container-content">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {product.steps.map((s) => (
                  <Reveal key={s.n} delay={Number(s.n) * 60}>
                    <div className="h-full rounded-xl border border-divider bg-surface p-6 shadow-sm">
                      <span className="font-serif text-sm font-semibold text-static">{s.n}</span>
                      <h3 className="mt-3 font-semibold tracking-tight text-ink">{s.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-static">{s.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* MCP-style tool tags */}
        {product.tools ? (
          <section className="pb-16">
            <div className="container-content">
              <p className="mb-4 text-sm font-medium text-static">Tools Claude gets:</p>
              <div className="flex flex-wrap gap-2">
                {product.tools.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-divider bg-surface px-3 py-1.5 font-mono text-xs text-ink shadow-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <CTA />
      </main>
      <Footer />
    </>
  );
}
