import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { Pricing } from "@/components/sections/pricing";
import { SectionHeading } from "@/components/ui/section-heading";
import { FAQ } from "@/content/faq";
import { LIFETIME, MATRIX, PRO } from "@/content/plans";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Free static QR codes, Pro at $${PRO.monthly}/month or $${PRO.yearly}/year, or $${LIFETIME} once for life. Unlimited scans on every plan, and codes keep working if you cancel.`,
  alternates: { canonical: "/pricing" },
};

const BILLING_FAQ = [
  FAQ[0],
  FAQ[4],
  { q: "Can I switch between monthly, yearly and lifetime?", a: "Yes, any time from Billing. Moving up is prorated to the day; moving to lifetime credits what's left of your current period." },
  { q: "Do you offer refunds?", a: "Yes. If StayQR isn't right for you, email us within 14 days of any payment for a full refund. Your codes keep working either way." },
  { q: "Which payment methods do you accept?", a: "All major cards, Apple Pay and Google Pay. Teams on yearly or lifetime plans can also pay by invoice." },
  FAQ[2],
];

export default function PricingPage() {
  return (
    <main>
      <Pricing page />

      <section aria-labelledby="matrix-title" className="border-t border-line py-24 lg:py-32">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <SectionHeading id="matrix-title" eyebrow="Compare plans" title="Everything in each *plan.*" />
          <div className="mt-12 overflow-x-auto" data-reveal="">
            <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left">
              <caption className="sr-only">Features in the Free, Pro and Lifetime plans</caption>
              <thead>
                <tr className="font-mono text-label uppercase text-fg-subtle">
                  <th scope="col" className="w-[40%] pb-4 font-normal">Feature</th>
                  <th scope="col" className="pb-4 font-normal">Free</th>
                  <th scope="col" className="pb-4 font-normal">Pro</th>
                  <th scope="col" className="pb-4 font-normal text-accent-text">Lifetime</th>
                </tr>
              </thead>
              {MATRIX.map((g) => (
                <tbody key={g.group}>
                  <tr>
                    <th colSpan={4} scope="colgroup" className="border-b border-line pb-3 pt-10 font-display text-h4 font-semibold text-fg">{g.group}</th>
                  </tr>
                  {g.rows.map((r) => (
                    <tr key={r.label}>
                      <th scope="row" className="border-b border-line py-4 pr-4 text-body-sm font-normal text-fg-muted">{r.label}</th>
                      {[r.free, r.pro, r.lifetime].map((v, i) => (
                        <td key={i} className="border-b border-line py-4 pr-4 text-body-sm">
                          <MatrixValue v={v} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </section>

      <Faq items={BILLING_FAQ} title="Billing *questions.*" />
      <CtaBand />
    </main>
  );
}

function MatrixValue({ v }: { v: string | boolean }) {
  if (v === true)
    return (
      <span className="inline-flex items-center gap-2 text-fg">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-text" aria-hidden><path d="M3 8.5l3 3 7-7" /></svg>
        <span className="sr-only">Included</span>
      </span>
    );
  if (v === false)
    return (
      <span className="text-fg-subtle">
        <span aria-hidden>—</span>
        <span className="sr-only">Not included</span>
      </span>
    );
  return <span className={cn("text-fg", v === "n/a" && "text-fg-subtle")}>{v}</span>;
}
