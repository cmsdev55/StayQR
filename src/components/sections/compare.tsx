import { Logo } from "@/components/logo";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { SectionHeading } from "@/components/ui/section-heading";
import { VerifyTag } from "@/components/ui/placeholder";
import { CHECKED, COMPETITORS, STAYQR_ROW, type Competitor, type Verdict } from "@/content/competitors";
import { cn } from "@/lib/utils";

type Cell = { text: string; verdict?: Verdict; confirmed?: boolean };

// The cancel row is plain text on purpose: what happens varies too much for a tick or a cross.
const ROWS: { label: string; ours: Cell; theirs: (c: Competitor) => Cell }[] = [
  { label: "Codes included", ours: { text: STAYQR_ROW.codes, verdict: "yes" }, theirs: (c) => c.codes },
  { label: "What happens when you cancel", ours: { text: STAYQR_ROW.cancel }, theirs: (c) => c.cancel },
  { label: "Scan limits", ours: { text: STAYQR_ROW.scans, verdict: "yes" }, theirs: (c) => c.scans },
  { label: "Edit after printing", ours: { text: STAYQR_ROW.edit, verdict: "yes" }, theirs: (c) => c.edit },
];

/** Section 5: StayQR vs the three best-known dynamic QR services (facts in src/content/competitors.ts). */
export function Compare() {
  return (
    <section id="compare" aria-labelledby="compare-title" className="relative border-t border-line py-24 lg:py-40">
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <SectionHeading
          id="compare-title"
          eyebrow="Compare"
          title="Same codes, for a *fraction* of the price."
          intro={`The cheapest paid plan with editable codes on each service, and what happens to your printed codes when you stop paying. Checked ${CHECKED} against each company's own pages.`}
        />

        {/* md+: a real table */}
        <div className="mt-12 hidden overflow-hidden md:block lg:mt-16">
          <table className="w-full table-fixed border-separate border-spacing-0 text-left">
            <caption className="sr-only">StayQR compared with {COMPETITORS.map((c) => c.name).join(" and ")}</caption>
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[26%]" />
              {COMPETITORS.map((c) => (
                <col key={c.slug} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className="pb-6 align-bottom"><span className="eyebrow">Price per year</span></th>
                <th scope="col" className="rounded-t-xl border-x border-t border-line-strong bg-glass-strong px-5 pb-6 pt-6 align-bottom">
                  <span className="flex items-center gap-2 text-body font-semibold text-fg"><Logo size={18} /> StayQR</span>
                  <span className="mt-0.5 block font-mono text-[12px] font-normal text-fg-subtle">{STAYQR_ROW.plan} · or $79 once</span>
                  <AnimatedCounter value={STAYQR_ROW.pricePerYear} from={300} prefix="$" duration={1800} label={`$${STAYQR_ROW.pricePerYear} per year`} className="mt-4 font-display text-display-md font-semibold text-accent-text" />
                </th>
                {COMPETITORS.map((c) => (
                  <th key={c.slug} scope="col" className="px-5 pb-6 align-bottom">
                    <span className="block text-body font-semibold text-fg">{c.name}</span>
                    <span className="mt-0.5 block font-mono text-[12px] font-normal text-fg-subtle">{c.plan}</span>
                    <AnimatedCounter value={c.pricePerYear} from={0} prefix="$" duration={1800} label={`$${c.pricePerYear} per year`} className="mt-4 font-display text-display-md font-semibold text-fg-muted" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={row.label} data-reveal="" style={{ ["--stagger" as string]: i + 1 }} className="group">
                  <th scope="row" className="border-t border-line py-5 pr-4 text-body-sm font-medium text-fg-muted">{row.label}</th>
                  <td className={cn("border-x border-t border-line-strong bg-glass-strong px-5 py-5", i === ROWS.length - 1 && "rounded-b-xl border-b")}>
                    <Value cell={row.ours} delay={i} strong />
                  </td>
                  {COMPETITORS.map((c) => (
                    <td key={c.slug} className="border-t border-line px-5 py-5">
                      <Value cell={row.theirs(c)} delay={i} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* phones: one block per question */}
        <div className="mt-12 flex flex-col gap-4 md:hidden">
          <div className="glass rounded-lg p-5" data-reveal="">
            <p className="eyebrow">Price per year</p>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <dt className="flex items-center gap-1.5 text-body-sm font-semibold text-fg"><Logo size={14} /> StayQR</dt>
                <dd><AnimatedCounter value={STAYQR_ROW.pricePerYear} from={300} prefix="$" duration={1800} label={`$${STAYQR_ROW.pricePerYear} per year`} className="font-display text-[34px] font-semibold text-accent-text" /></dd>
              </div>
              {COMPETITORS.map((c) => (
                <div key={c.slug}>
                  <dt className="truncate text-body-sm text-fg-muted">{c.short}</dt>
                  <dd><AnimatedCounter value={c.pricePerYear} from={0} prefix="$" duration={1800} label={`$${c.pricePerYear} per year`} className="font-display text-[34px] font-semibold text-fg-muted" /></dd>
                </div>
              ))}
            </dl>
          </div>
          {ROWS.map((row, i) => (
            <div key={row.label} className="glass rounded-lg p-5" data-reveal="" style={{ ["--stagger" as string]: i + 1 }}>
              <p className="eyebrow">{row.label}</p>
              <dl className="mt-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4 rounded-sm bg-glass-strong px-3 py-2.5">
                  <dt className="text-body-sm font-semibold text-fg">StayQR</dt>
                  <dd><Value cell={row.ours} delay={0} strong /></dd>
                </div>
                {COMPETITORS.map((c) => (
                  <div key={c.slug} className="flex items-start justify-between gap-4 px-3">
                    <dt className="shrink-0 text-body-sm text-fg-muted">{c.short}</dt>
                    <dd className="text-right"><Value cell={row.theirs(c)} delay={0} align="right" /></dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-[90ch] text-body-sm text-fg-subtle">
          Cheapest paid plan that includes editable (dynamic) codes, billed annually, in USD before tax.{" "}
          Sources:{" "}
          {COMPETITORS.flatMap((c) => c.sources.map((s) => ({ ...s, who: c.name }))).map((s, i, all) => (
            <span key={s.url}>
              <a href={s.url} rel="nofollow noopener noreferrer" target="_blank" className="underline decoration-line-strong underline-offset-2 transition-colors hover:text-fg">
                {s.who} {s.label.toLowerCase()}
              </a>
              {i < all.length - 1 ? ", " : "."}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

function Value({ cell, delay, strong, align }: { cell: Cell; delay: number; strong?: boolean; align?: "right" }) {
  return (
    <span className={cn("flex items-start gap-2.5", align === "right" && "flex-row-reverse text-right")}>
      {cell.verdict && <Mark verdict={cell.verdict} delay={delay} />}
      <span className={cn("text-body-sm", strong ? "font-medium text-fg" : "text-fg-muted")}>
        {cell.text}
        {cell.confirmed === false && <VerifyTag />}
      </span>
    </span>
  );
}

/** Tick, cross or dash, drawn in when its row is revealed. */
function Mark({ verdict, delay }: { verdict: Verdict; delay: number }) {
  const tone = verdict === "yes" ? "bg-accent/[0.14] text-accent-text" : verdict === "no" ? "bg-danger/[0.12] text-danger" : "bg-warning/[0.12] text-warning";
  const label = verdict === "yes" ? "Yes" : verdict === "no" ? "No" : "Partly";
  return (
    <span className={cn("mt-px grid size-5 shrink-0 place-items-center rounded-full", tone)} role="img" aria-label={label}>
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path
          className="draw"
          pathLength={1}
          style={{ transitionDelay: `${400 + delay * 50}ms` }}
          d={verdict === "yes" ? "M2.5 6.2l2.4 2.4 4.6-5" : verdict === "no" ? "M3 3l6 6M9 3L3 9" : "M3 6h6"}
        />
      </svg>
    </span>
  );
}
