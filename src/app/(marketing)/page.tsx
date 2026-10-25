import { Compare } from "@/components/sections/compare";
import { Faq } from "@/components/sections/faq";
import { Features } from "@/components/sections/features";
import { FinalCta } from "@/components/sections/final-cta";
import { Generator } from "@/components/sections/generator";
import { Hero } from "@/components/sections/hero";
import { IndustriesMarquee } from "@/components/sections/industries";
import { NeverDies } from "@/components/sections/never-dies";
import { Pricing } from "@/components/sections/pricing";
import { SectionHeading } from "@/components/ui/section-heading";
import { FAQ } from "@/content/faq";
import { INDUSTRIES } from "@/content/industries";

export default function Home() {
  return (
    <main>
      <Hero />
      <NeverDies />
      <Generator />
      <Features />
      <Compare />
      <Pricing />
      <section id="industries" aria-labelledby="industries-title" className="relative overflow-hidden border-t border-line py-24 lg:py-40">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <SectionHeading
            id="industries-title"
            eyebrow="Industries"
            title="Built for everything you *print.*"
            intro="Menus, signs, badges, boxes. If it's printed, its code should outlive the print run."
          />
        </div>
        <div className="mt-12 lg:mt-16">
          <IndustriesMarquee items={INDUSTRIES.map(({ slug, name, line }) => ({ slug, name, line }))} />
        </div>
      </section>
      <Faq items={FAQ} />
      <FinalCta />
    </main>
  );
}
