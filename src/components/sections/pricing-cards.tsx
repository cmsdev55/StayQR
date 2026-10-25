"use client";

import { useState } from "react";
import { Pausable } from "@/components/motion/pausable";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SegmentedToggle } from "@/components/ui/toggle";
import { LIFETIME, PLAN_FEATURES, PRO, YEARLY_SAVING, type Billing } from "@/content/plans";
import { cn } from "@/lib/utils";

/** Free / Pro / Lifetime. The billing toggle rolls the Pro price on the odometer. */
export function PricingCards({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const [billing, setBilling] = useState<Billing>("yearly");
  const yearly = billing === "yearly";
  const perMonth = yearly ? Math.round(PRO.yearlyPerMonth * 100) / 100 : PRO.monthly;

  return (
    <div>
      <div className="flex justify-center">
        <SegmentedToggle
          label="Billing period"
          value={billing}
          onChange={setBilling}
          options={[
            { value: "monthly", label: "Monthly" },
            {
              value: "yearly",
              label: (
                <>
                  Yearly
                  <span className={cn("rounded-full px-1.5 py-0.5 font-mono text-[10px] tracking-[0.04em]", yearly ? "bg-bg/15" : "bg-accent/[0.14] text-accent-text")}>
                    −{YEARLY_SAVING}%
                  </span>
                </>
              ),
            },
          ]}
        />
      </div>

      <Pausable className="mt-10 grid items-stretch gap-4 md:grid-cols-3 lg:mt-12 lg:gap-5">
        <Plan
          h={headingLevel}
          i={0}
          name="Free"
          blurb="Static codes for anything you print once."
          price={<span className="font-display text-display-md font-semibold text-fg">$0</span>}
          note="Free forever, no account"
          features={PLAN_FEATURES.free}
          cta={<ButtonLink href="/qr-code-generator" variant="secondary" className="w-full">Create free QR</ButtonLink>}
        />
        <Plan
          h={headingLevel}
          i={1}
          name="Pro"
          blurb="Dynamic codes you can edit, track and keep."
          price={
            <span className="flex items-baseline gap-1">
              <AnimatedCounter value={perMonth} decimals={2} prefix="$" duration={700} label={`$${perMonth.toFixed(2)} per month`} className="font-display text-display-md font-semibold text-fg" />
              <span className="text-body-sm text-fg-muted">/mo</span>
            </span>
          }
          note={yearly ? `Billed $${PRO.yearly} once a year` : "Billed monthly, cancel any time"}
          features={PLAN_FEATURES.pro}
          cta={<ButtonLink href={`/signup?plan=pro-${billing}`} variant="secondary" className="w-full">Start Pro</ButtonLink>}
        />
        <div className="lifetime-ring relative rounded-xl p-px" data-reveal="" style={{ ["--stagger" as string]: 2 }}>
          <div aria-hidden className="pointer-events-none absolute -inset-8 -z-10 rounded-[40px] opacity-60 [background:radial-gradient(closest-side,rgb(var(--depth)/0.22),transparent)]" />
          <Plan
            h={headingLevel}
            name="Lifetime"
            flat
            badge={<Badge variant="accent">Best value</Badge>}
            blurb="Everything in Pro. Pay once, never again."
            price={
              <span className="flex items-baseline gap-1">
                <span className="font-display text-display-md font-semibold text-fg">${LIFETIME}</span>
                <span className="text-body-sm text-fg-muted">once</span>
              </span>
            }
            note="Less than 3 years of Pro"
            features={PLAN_FEATURES.lifetime}
            cta={<ButtonLink href="/signup?plan=lifetime" className="w-full">Get lifetime</ButtonLink>}
          />
        </div>
      </Pausable>

      <p className="mt-8 text-center font-mono text-[12px] text-fg-subtle">
        Every plan: unlimited scans · codes never expire · no ads on your codes
      </p>
    </div>
  );
}

function Plan({
  h,
  i,
  name,
  badge,
  blurb,
  price,
  note,
  features,
  cta,
  flat,
}: {
  h: 2 | 3;
  i?: number;
  name: string;
  badge?: React.ReactNode;
  blurb: string;
  price: React.ReactNode;
  note: string;
  features: string[];
  cta: React.ReactNode;
  /** Inside the lifetime ring: solid fill so the orbiting border shows only at the edge. */
  flat?: boolean;
}) {
  return (
    <div
      data-reveal={flat ? undefined : ""}
      style={i !== undefined ? { ["--stagger" as string]: i } : undefined}
      className={cn("flex h-full flex-col rounded-xl p-6 sm:p-8", flat ? "bg-bg-raised" : "glass")}
    >
      <div className="flex items-center justify-between gap-3">
        {h === 2 ? <h2 className="font-display text-h3 font-semibold text-fg">{name}</h2> : <h3 className="font-display text-h3 font-semibold text-fg">{name}</h3>}
        {badge}
      </div>
      <p className="mt-2 text-body-sm text-fg-muted">{blurb}</p>
      <div className="mt-8 h-[52px]">{price}</div>
      <p className="mt-2 font-mono text-[12px] text-fg-subtle" aria-live="polite">{note}</p>
      <div className="mt-8">{cta}</div>
      <ul className="mt-8 flex flex-col gap-3 border-t border-line pt-8">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-body-sm text-fg-muted">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-accent-text" aria-hidden>
              <path d="M3 8.5l3 3 7-7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
