import { SectionHeading } from "@/components/ui/section-heading";
import { LIFETIME, PRO } from "@/content/plans";
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
          title={page ? `QR code generator pricing: *free, $${PRO.yearly} a year, or $${LIFETIME} once.*` : "Simple pricing. Codes that *last.*"}
          intro={page ? `EndureQR has three plans. Free gives unlimited static QR codes in 17 types and one dynamic code you can edit after printing. Pro costs $${PRO.monthly} a month or $${PRO.yearly} a year for unlimited dynamic codes, analytics, iPhone/Android redirects, folders and CSV bulk creation. Lifetime is $${LIFETIME} once, with everything in Pro. Every plan has unlimited scans, and codes keep redirecting if you cancel.` : "Start free, with one dynamic code you can edit after printing. Upgrade for unlimited codes. Cancel any time and your codes keep working."}
        />
        <div className="mt-12 lg:mt-16">
          <PricingCards headingLevel={page ? 2 : 3} />
        </div>
      </div>
    </section>
  );
}
