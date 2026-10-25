import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import { PricingCards } from "./pricing-cards";

/** Section 6, also the top of /pricing (where the heading is the page's h1 and plays on load). */
export function Pricing({ page = false }: { page?: boolean }) {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className={cn("relative", page ? "pb-24 pt-32 sm:pt-40 lg:pb-32" : "border-t border-line py-24 lg:py-40")}
    >
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <SectionHeading
          id="pricing-title"
          as={page ? "h1" : "h2"}
          immediate={page}
          align="center"
          eyebrow="Pricing"
          title="Simple pricing. Codes for *life.*"
          intro="Start free. Upgrade when you need to edit codes after printing. Cancel any time and your codes keep working."
        />
        <div className="mt-12 lg:mt-16">
          <PricingCards />
        </div>
      </div>
    </section>
  );
}
