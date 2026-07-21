import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24">
      <div className="container-content">
        <div className="grain relative overflow-hidden rounded-2xl border border-ink/5 bg-ink px-8 py-16 text-center text-paper shadow-lg md:px-16 md:py-20">
          <div
            aria-hidden
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-signal/25 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-static/20 blur-3xl"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Your next customer is talking right now.
            </h2>
            <p className="mt-5 text-lg text-paper/70">
              Start listening in under a minute. Free tier, no credit card, and
              scoring that gets sharper every day.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/sign-up" className="btn-signal">
                Start free
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-md border border-paper/25 px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-paper/10"
              >
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
