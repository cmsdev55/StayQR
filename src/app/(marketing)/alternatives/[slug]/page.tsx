import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/logo";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { CHECKED, COMPETITORS, STAYQR_ROW, competitorBySlug } from "@/content/competitors";
import { FAQ } from "@/content/faq";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return COMPETITORS.map((c) => ({ slug: c.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = competitorBySlug((await params).slug);
  if (!c) return {};
  return {
    title: `${c.name} alternative`,
    description: `Looking for a ${c.name} alternative? StayQR is $${STAYQR_ROW.pricePerYear}/year with unlimited codes and scans, and your codes keep working if you cancel.`,
    alternates: { canonical: `/alternatives/${c.slug}` },
  };
}

export default async function AlternativePage({ params }: Props) {
  const c = competitorBySlug((await params).slug);
  if (!c) notFound();
  const saving = c.pricePerYear - STAYQR_ROW.pricePerYear;
  const title = `The ${c.name} alternative that never breaks your codes`;
  const words = title.split(" ");

  const rows: [string, string, string, boolean][] = [
    ["Price per year", `$${c.pricePerYear} (${c.plan})`, `$${STAYQR_ROW.pricePerYear} (${STAYQR_ROW.plan})`, true],
    ["Codes included", c.codesIncluded, STAYQR_ROW.codesIncluded, true],
    ["If you cancel", c.afterCancelShort, STAYQR_ROW.afterCancelShort, true],
    ["Scan limits", c.scanLimit, STAYQR_ROW.scanLimit, !c.scanLimitOk],
    ["Edit after printing", c.editAfterPrint, STAYQR_ROW.editAfterPrint, true],
  ];

  const faq = [
    { q: `Is StayQR affiliated with ${c.name}?`, a: `No. StayQR is an independent product. ${c.name} is a trademark of its owner; we compare plans using their public pricing and help pages, checked ${CHECKED}.` },
    { q: `What happens to my ${c.name} codes if I cancel?`, a: c.afterCancelLong },
    { q: `Can I import my ${c.name} codes?`, a: `You can't move a code that points at ${c.name}'s short links, but you can export your destinations, import them into StayQR as a CSV and reprint once. After that, you never need to reprint again.` },
    FAQ[0],
  ];

  return (
    <main>
      <section aria-labelledby="alt-title" className="noise bg-grid relative isolate overflow-hidden pb-24 pt-32 sm:pt-40 lg:pb-32">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <p className="fade-up eyebrow" style={{ ["--d" as string]: "0ms" }}>{c.name} alternative</p>
          <h1 id="alt-title" className="mt-5 max-w-[20ch] font-display text-display-xl font-semibold text-fg [text-wrap:balance]">
            {words.map((w, i) => (
              <span key={i}>
                <span className="mask-word">
                  <span style={{ ["--i" as string]: i }} className={w === "never" ? "text-accent-text" : undefined}>{w}</span>
                </span>
                {i < words.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
          <p className="fade-up mt-6 max-w-[58ch] text-body-lg text-fg-muted" style={{ ["--d" as string]: "300ms" }}>
            {c.name}&apos;s {c.plan} plan costs ${c.pricePerYear} a year. StayQR Pro is ${STAYQR_ROW.pricePerYear}, with unlimited codes and scans, and
            every code you print keeps working even if you stop paying.
          </p>
          <div className="fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "380ms" }}>
            <ButtonLink href={`/signup?from=${c.slug}`} size="lg">Switch to StayQR</ButtonLink>
            <ButtonLink href="/#compare" size="lg" variant="secondary">Compare all services</ButtonLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="side-title" className="border-t border-line py-24 lg:py-32">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <SectionHeading id="side-title" eyebrow="Side by side" title={`StayQR vs *${c.name}*`} />
          <div className="mt-12 grid gap-4 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:gap-5">
            <div className="glass overflow-hidden rounded-xl" data-reveal="">
              <table className="w-full table-fixed text-left">
                <caption className="sr-only">StayQR compared with {c.name}</caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="w-[30%] px-5 py-4 font-mono text-label font-normal uppercase text-fg-subtle sm:px-6"><span className="sr-only">Feature</span></th>
                    <th scope="col" className="px-3 py-4 text-body-sm font-semibold text-fg-muted sm:px-6">{c.name}</th>
                    <th scope="col" className="bg-glass-strong px-3 py-4 sm:px-6">
                      <span className="flex items-center gap-2 text-body-sm font-semibold text-fg"><Logo size={16} /> StayQR</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([label, theirs, ours, win]) => (
                    <tr key={label} className="border-b border-line last:border-0">
                      <th scope="row" className="px-5 py-4 align-top text-body-sm font-normal text-fg-muted sm:px-6">{label}</th>
                      <td className="px-3 py-4 align-top text-body-sm text-fg-muted sm:px-6">{theirs}</td>
                      <td className={cn("bg-glass-strong px-3 py-4 align-top text-body-sm sm:px-6", win ? "font-medium text-fg" : "text-fg-muted")}>{ours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="glass flex flex-col justify-between rounded-xl p-6 sm:p-8" data-reveal="" style={{ ["--stagger" as string]: 1 }}>
              <div>
                <p className="eyebrow">You save every year</p>
                <AnimatedCounter value={saving} from={0} prefix="$" duration={1600} label={`$${saving} per year`} className="mt-4 font-display text-display-lg font-semibold text-accent-text" />
                <p className="mt-3 text-body-sm text-fg-muted">
                  Comparing {c.name} {c.plan} with StayQR Pro, both billed yearly. Or pay $79 once and never renew.
                </p>
              </div>
              <p className="mt-8 border-t border-line pt-6 text-body-sm text-fg-subtle">
                After you cancel {c.name}: {c.afterCancelLong}
              </p>
            </div>
          </div>
          <p className="mt-6 text-body-sm text-fg-subtle">
            Checked {CHECKED}:{" "}
            {c.sources.map((s, i) => (
              <span key={s.url}>
                <a href={s.url} target="_blank" rel="nofollow noopener noreferrer" className="underline decoration-line-strong underline-offset-2 hover:text-fg">{c.name} {s.label.toLowerCase()}</a>
                {i < c.sources.length - 1 ? ", " : "."}
              </span>
            ))}{" "}
            Prices in USD before tax and may change.
          </p>
        </div>
      </section>

      <section aria-labelledby="switch-title" className="border-t border-line py-24 lg:py-32">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <SectionHeading id="switch-title" eyebrow="Switching" title="Move over in an *afternoon.*" />
          <ol className="mt-12 grid gap-4 md:grid-cols-3 lg:gap-5">
            {[
              ["Export your destinations", `Download the list of links your ${c.name} codes point to.`],
              ["Import a CSV", "Upload it to StayQR and get a print-ready code for every row."],
              ["Reprint once", "Swap the codes on your next print run. It's the last reprint you'll need."],
            ].map(([t, b], i) => (
              <li key={t} className="glass rounded-lg p-6 sm:p-8" data-reveal="" style={{ ["--stagger" as string]: i }}>
                <span className="grid size-8 place-items-center rounded-full border border-line-strong font-mono text-[12px] text-fg">{i + 1}</span>
                <h3 className="mt-6 font-display text-h3 font-semibold text-fg">{t}</h3>
                <p className="mt-3 text-body-sm text-fg-muted">{b}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-body-sm text-fg-muted">
            Also comparing:{" "}
            {COMPETITORS.filter((o) => o.slug !== c.slug).map((o, i, all) => (
              <span key={o.slug}>
                <Link href={`/alternatives/${o.slug}`} className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">{o.name}</Link>
                {i < all.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>
      </section>

      <Faq items={faq} title="Switching *questions.*" />
      <CtaBand title="Stop renting your QR codes." href={`/signup?from=${c.slug}`} cta="Switch to StayQR" />
    </main>
  );
}
