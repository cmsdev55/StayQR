import { Placeholder, PlaceholderSlot } from "@/components/ui/placeholder";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Social proof (between Pricing and Industries). Structure only: every logo, quote, name and
 * number is a visible [placeholder] until StayQR supplies real, permissioned customers.
 */
export function SocialProof() {
  return (
    <section id="customers" aria-labelledby="customers-title" className="relative border-t border-line py-24 lg:py-40">
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <SectionHeading
          id="customers-title"
          eyebrow="Customers"
          title="Printed once. Still *scanning.*"
          intro={<Placeholder>One line on who uses StayQR, supplied by StayQR</Placeholder>}
        />

        {/* logo strip */}
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-16 lg:grid-cols-6" aria-label="Customer logos">
          {[1, 2, 3, 4, 5, 6].map((n, i) => (
            <li key={n} data-reveal="" style={{ ["--stagger" as string]: i }}>
              <PlaceholderSlot label={`Customer logo ${n}`} className="h-20" />
            </li>
          ))}
        </ul>

        {/* testimonials: one large, two small */}
        <div className="mt-6 grid gap-4 lg:grid-cols-12 lg:gap-5">
          <figure className="glass flex flex-col justify-between rounded-xl p-6 sm:p-10 lg:col-span-7 lg:row-span-2" data-reveal="">
            <QuoteMark />
            <blockquote className="mt-6 font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-fg">
              <Placeholder className="text-[0.62em]">Customer quote, two or three sentences, used with permission</Placeholder>
            </blockquote>
            <Attribution big />
          </figure>
          {[1, 2].map((n, i) => (
            <figure key={n} className="glass flex flex-col justify-between rounded-xl p-6 sm:p-8 lg:col-span-5" data-reveal="" style={{ ["--stagger" as string]: i + 1 }}>
              <blockquote className="text-body-lg text-fg">
                <Placeholder>Short customer quote {n + 1}, one sentence</Placeholder>
              </blockquote>
              <Attribution />
            </figure>
          ))}
        </div>

        {/* numbers */}
        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-[var(--border)] lg:grid-cols-4" data-reveal="">
          {["Codes created", "Scans served", "Countries", "Businesses"].map((label) => (
            <div key={label} className="flex flex-col gap-2 bg-bg p-6 sm:p-8">
              <dt className="order-2 text-body-sm text-fg-muted">{label}</dt>
              <dd className="order-1 font-display text-display-md font-semibold text-fg">
                <Placeholder className="text-[0.55em]">number</Placeholder>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Attribution({ big }: { big?: boolean }) {
  return (
    <figcaption className="mt-8 flex items-center gap-3">
      <span className={big ? "grid size-12 shrink-0 place-items-center rounded-full border border-dashed border-line-strong font-mono text-[10px] text-fg-subtle" : "grid size-10 shrink-0 place-items-center rounded-full border border-dashed border-line-strong font-mono text-[10px] text-fg-subtle"} aria-hidden>
        [img]
      </span>
      <span className="flex flex-col gap-1 text-body-sm">
        <span className="font-medium text-fg"><Placeholder>Name</Placeholder></span>
        <span className="text-fg-muted"><Placeholder>Role, Company</Placeholder></span>
      </span>
    </figcaption>
  );
}

function QuoteMark() {
  return (
    <svg width="36" height="28" viewBox="0 0 36 28" fill="none" aria-hidden className="text-fg-subtle">
      <path d="M0 28V17.5C0 7.9 5.2 1.9 14.2 0l1.8 4.3C10.8 6 8.2 9.5 8 14h7.6v14zM20 28V17.5C20 7.9 25.2 1.9 34.2 0L36 4.3C30.8 6 28.2 9.5 28 14h7.6v14z" fill="currentColor" />
    </svg>
  );
}
