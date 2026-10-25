import { Accordion } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Faq as FaqItem } from "@/content/faq";

/** Section 8: one-open accordion plus FAQPage structured data built from the same answers. */
export function Faq({ items, id = "faq", title = "Questions, *answered.*" }: { items: FaqItem[]; id?: string; title?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative border-t border-line py-24 lg:py-40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="mx-auto grid max-w-container gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading id={`${id}-title`} eyebrow="FAQ" title={title} />
          <p className="mt-6 max-w-[36ch] text-body text-fg-muted" data-reveal="" style={{ ["--stagger" as string]: 2 }}>
            Something else? Email{" "}
            <a href="mailto:hello@stayqr.com" className="text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-fg">
              hello@stayqr.com
            </a>{" "}
            and a person will reply within a day.
          </p>
        </div>
        <div data-reveal="" style={{ ["--stagger" as string]: 1 }}>
          <Accordion items={items.map((f) => ({ id: f.q, title: f.q, content: f.a }))} defaultOpen={[0]} />
        </div>
      </div>
    </section>
  );
}
