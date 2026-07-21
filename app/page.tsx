import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { SourceMarquee } from "@/components/SourceMarquee";
import { Metrics } from "@/components/Metrics";
import { BeyondLeadGen } from "@/components/home/BeyondLeadGen";
import { PlatformTools } from "@/components/home/PlatformTools";
import { OrbitSources } from "@/components/home/OrbitSources";
import { AtmosphereBand } from "@/components/marketing/AtmosphereBand";
import { HowItWorks } from "@/components/HowItWorks";
import { Comparison } from "@/components/Comparison";
import { Positioning } from "@/components/Positioning";
import { UseCases } from "@/components/home/UseCases";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/anim/Reveal";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <SourceMarquee />
        <Reveal>
          <Metrics />
        </Reveal>
        <Reveal>
          <BeyondLeadGen />
        </Reveal>
        <Reveal>
          <PlatformTools />
        </Reveal>
        {/* The one extra video band on the home page (the hero has the other) */}
        <AtmosphereBand video>
          <Reveal>
            <OrbitSources />
          </Reveal>
        </AtmosphereBand>
        {/* HowItWorks self-animates its timeline on scroll */}
        <HowItWorks />
        <Reveal>
          <Comparison />
        </Reveal>
        <Reveal>
          <Positioning />
        </Reveal>
        <Reveal>
          <UseCases />
        </Reveal>
        <Reveal>
          <Testimonials />
        </Reveal>
        <Reveal>
          <FAQ />
        </Reveal>
        <Reveal>
          <CTA />
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
