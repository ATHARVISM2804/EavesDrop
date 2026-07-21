import Link from "next/link";
import { ProductShowcase } from "./home/ProductShowcase";

/**
 * Full-bleed atmosphere plate with the tabbed product showcase floating over
 * its lower edge — the reference's signature hero composition.
 *
 * The plate is a pure-CSS alpine gradient (see `.atmosphere` in globals.css)
 * plus the ridge SVG below. To swap in real photography, drop a
 * `<Image fill priority>` into the plate and remove the ridge + background.
 */
function Ridgeline() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      className="absolute inset-x-0 bottom-0 h-[46%] w-full"
    >
      {/* Far range — pale, hazy */}
      <path
        d="M0 232 L138 176 L246 214 L378 132 L520 206 L648 158 L792 220 L918 166 L1064 212 L1198 154 L1320 200 L1440 162 L1440 320 L0 320Z"
        fill="#C3D0DE"
        opacity="0.5"
      />
      {/* Mid range */}
      <path
        d="M0 268 L112 220 L232 258 L352 196 L482 250 L604 206 L742 258 L874 212 L1002 254 L1146 200 L1282 246 L1440 208 L1440 320 L0 320Z"
        fill="#AFC0D2"
        opacity="0.45"
      />
      {/* Near range — resolves into the white page */}
      <path
        d="M0 300 L150 268 L288 294 L430 254 L566 288 L706 252 L850 292 L988 258 L1130 290 L1272 256 L1440 286 L1440 320 L0 320Z"
        fill="#9FB2C7"
        opacity="0.35"
      />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative">
      {/* Atmosphere plate — pulled up behind the floating nav */}
      <div className="atmosphere atmosphere-fade relative -mt-[4.5rem] overflow-hidden pb-px pt-[4.5rem]">
        <Ridgeline />

        <div className="container-content relative z-10 pb-44 pt-20 text-center md:pb-60 md:pt-28">
          <div className="animate-fade-up">
            <span className="badge-hero">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              Built for B2B SaaS teams
            </span>
          </div>

          <h1 className="display-1 mx-auto mt-7 max-w-4xl animate-fade-up text-ink [animation-delay:60ms]">
            Buyer-intent infrastructure
            <br className="hidden sm:block" /> that listens where your buyers talk.
          </h1>

          <p className="lead mx-auto mt-6 max-w-xl animate-fade-up text-ink/60 [animation-delay:120ms]">
            Eavesdrop finds the people across Reddit, X, and Hacker News who are
            actively expressing intent for a product like yours — scored, triaged,
            and sharpened by your feedback.
          </p>

          <div className="mt-9 flex animate-fade-up flex-col items-center justify-center gap-3 [animation-delay:180ms] sm:flex-row">
            <Link href="/sign-up" className="btn-signal px-6 py-3">
              Start free
            </Link>
            <Link href="/#how-it-works" className="btn-ghost px-6 py-3">
              See how it works
            </Link>
          </div>

          <p className="mt-5 animate-fade-up text-xs text-ink/45 [animation-delay:220ms]">
            Free tier · no credit card · 10 leads a week on us
          </p>
        </div>
      </div>

      {/* Tabbed app showcase — overlaps the plate's lower edge */}
      <div className="container-content relative z-20 -mt-40 animate-fade-up [animation-delay:260ms] md:-mt-52">
        <ProductShowcase />
      </div>
    </section>
  );
}
