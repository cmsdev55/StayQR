import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/logo";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { QrSvg } from "@/components/qr/qr-svg";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { VerifyTag } from "@/components/ui/placeholder";
import { SectionHeading } from "@/components/ui/section-heading";
import { CHECKED, COMPETITORS, STAYQR_ROW, competitorBySlug } from "@/content/competitors";
import { FAQ } from "@/content/faq";
import { qrMatrix } from "@/lib/qr";
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
  const words = c.headline.split(" ");
  let accentOn = false;

  // [label, their fact, ours, StayQR is clearly better here]
  const rows: [string, (typeof c)["price"], string, boolean][] = [
    ["Price per year", c.price, `${STAYQR_ROW.price} (${STAYQR_ROW.plan})`, true],
    ["Codes included", c.codes, STAYQR_ROW.codes, true],
    ["Scan limits", c.scans, STAYQR_ROW.scans, c.scans.verdict !== "yes"],
    ["Edit after printing", c.edit, STAYQR_ROW.edit, c.edit.verdict !== "yes"],
    ["What happens when you cancel", c.cancel, STAYQR_ROW.cancel, true],
  ];

  const faq = [
    { q: `Is StayQR affiliated with ${c.name}?`, a: `No. StayQR is an independent product. ${c.name} is a trademark of its owner; we compare plans using their public pricing and help pages, checked ${CHECKED}.` },
    { q: `What happens to my ${c.name} codes if I cancel?`, a: `${c.cancelLong} (Checked ${CHECKED}; confirm with ${c.name} before relying on it.)` },
    { q: `Can I import my ${c.name} codes?`, a: `You can't move a code that points at ${c.name}'s short links, but you can export your destinations, import them into StayQR as a CSV and reprint once. After that, you never need to reprint again.` },
    FAQ[0],
  ];

  return (
    <main>
      <section aria-labelledby="alt-title" className="noise bg-grid relative isolate overflow-hidden pb-24 pt-32 sm:pt-40 lg:pb-32">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <p className="fade-up eyebrow" style={{ ["--d" as string]: "0ms" }}>{c.name} alternative</p>
          <h1 id="alt-title" className="mt-5 max-w-[20ch] font-display text-display-xl font-semibold text-fg [text-wrap:balance]">
            {words.map((w, i) => {
              if (w.startsWith("*")) accentOn = true;
              const accent = accentOn;
              if (/\*[.,!?]?$/.test(w)) accentOn = false;
              return (
                <span key={i}>
                  <span className="mask-word">
                    <span style={{ ["--i" as string]: i }} className={accent ? "text-accent-text" : undefined}>{w.replace(/\*/g, "")}</span>
                  </span>
                  {i < words.length - 1 ? " " : null}
                </span>
              );
            })}
          </h1>
          <p className="fade-up mt-6 max-w-[58ch] text-body-lg text-fg-muted" style={{ ["--d" as string]: "300ms" }}>
            {c.pitch}
          </p>
          <div className="fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "380ms" }}>
            <ButtonLink href={`/signup?from=${c.slug}`} size="lg">Switch to StayQR</ButtonLink>
            <ButtonLink href="/#compare" size="lg" variant="secondary">Compare all services</ButtonLink>
          </div>
        </div>
      </section>

      {/* After cancelling: their code (a real screenshot, to be supplied) next to ours */}
      <section aria-labelledby="after-title" className="border-t border-line py-24 lg:py-32">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <SectionHeading
            id="after-title"
            eyebrow="After cancelling"
            title="What a printed code does once you *stop paying.*"
            intro={`What ${c.name}'s own help pages say happens to your codes, next to what you'd see in StayQR after cancelling.`}
          />
          <div className="mt-12 grid gap-4 lg:grid-cols-2 lg:gap-5">
            <figure className="flex flex-col" data-reveal="">
              <div className="glass flex aspect-[4/3] flex-col justify-between rounded-xl p-6 sm:p-8">
                <p className="eyebrow">In {c.name}&apos;s own words</p>
                <blockquote cite={c.quote.url} className="flex flex-col gap-4 font-display text-[clamp(1.05rem,0.95rem+0.5vw,1.35rem)] font-medium leading-snug text-fg [text-wrap:pretty]">
                  {c.quote.text.map((t) => <p key={t}>&ldquo;{t}&rdquo;</p>)}
                </blockquote>
                <a href={c.quote.url} target="_blank" rel="nofollow noopener noreferrer" className="font-mono text-[11px] text-fg-subtle underline decoration-line-strong underline-offset-2 hover:text-fg">
                  {c.quote.source} · read {CHECKED}
                </a>
              </div>
              <figcaption className="mt-4 text-body-sm text-fg-muted">
                <span className="font-medium text-fg">{c.name}</span> · after cancelling: {c.cancel.text.charAt(0).toLowerCase() + c.cancel.text.slice(1)}.
              </figcaption>
            </figure>
            <figure className="flex flex-col" data-reveal="" style={{ ["--stagger" as string]: 1 }}>
              <CancelledDashboard />
              <figcaption className="mt-4 text-body-sm text-fg-muted">
                <span className="font-medium text-fg">StayQR</span> · plan cancelled, every code still Active and redirecting to its last destination.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Facts: anything not on their current pricing page is marked [verify] */}
      <section aria-labelledby="facts-title" className="border-t border-line py-24 lg:py-32">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <SectionHeading id="facts-title" eyebrow="The facts" title={`StayQR vs *${c.name}*`} />
          <div className="mt-12 grid gap-4 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:gap-5">
            <div className="glass overflow-hidden rounded-xl" data-reveal="">
              <table className="w-full table-fixed text-left">
                <caption className="sr-only">StayQR compared with {c.name}</caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="w-[30%] px-5 py-4 sm:px-6"><span className="sr-only">Fact</span></th>
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
                      <td className="px-3 py-4 align-top text-body-sm text-fg-muted sm:px-6">
                        {theirs.text} {!theirs.confirmed && <VerifyTag />}
                      </td>
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
                  {c.priceNote && <span className="mt-2 block text-fg-subtle">{c.priceNote}</span>}
                </p>
              </div>
              <p className="mt-8 border-t border-line pt-6 text-body-sm text-fg-subtle">
                Every {c.name} fact here comes from {c.name}&apos;s own pricing, help or FAQ pages, linked below.
              </p>
            </div>
          </div>
          <p className="mt-6 text-body-sm text-fg-subtle">
            Checked {CHECKED}:{" "}
            {c.sources.map((src, i) => (
              <span key={src.url}>
                <a href={src.url} target="_blank" rel="nofollow noopener noreferrer" className="underline decoration-line-strong underline-offset-2 hover:text-fg">{c.short} {src.label.toLowerCase()}</a>
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
      <CtaBand title={c.ctaTitle} href={`/signup?from=${c.slug}`} cta="Switch to StayQR" />
    </main>
  );
}

/** StayQR billing + codes the day a plan is cancelled (a calm, solid dashboard mock). */
function CancelledDashboard() {
  const codes = [
    { name: "Table tent · dinner menu", url: "stayqr.com/r/k3xb9", today: 412 },
    { name: "Window · order online", url: "stayqr.com/r/t4qa8", today: 76 },
    { name: "Receipt · leave a review", url: "stayqr.com/r/p7mw2", today: 104 },
  ];
  return (
    <div className="flex aspect-[4/3] flex-col overflow-hidden rounded-xl border border-line bg-bg-raised text-body-sm" aria-label="StayQR dashboard after cancelling">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <span className="flex items-center gap-2 font-medium text-fg"><Logo size={16} /> QR codes</span>
        <Badge variant="warning">Plan cancelled<span className="hidden sm:inline"> · ends 14 Mar</span></Badge>
      </div>
      <ul className="flex-1 divide-y divide-line">
        {codes.map((code) => (
          <li key={code.url} className="flex items-center gap-3 px-4 py-3 sm:px-5">
            <span className="grid size-9 shrink-0 place-items-center rounded-[6px] bg-white p-1 text-[#0B0D12]">
              <QrSvg m={qrMatrix(`https://${code.url}`, 0)} shape="rounded" className="size-full" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium text-fg">{code.name}</span>
              <span className="block truncate font-mono text-[11px] text-fg-subtle">{code.url}</span>
            </span>
            <span className="hidden text-right sm:block">
              <span className="block tabular-nums text-fg">{code.today}</span>
              <span className="block font-mono text-[10px] text-fg-subtle">scans today</span>
            </span>
            <Badge variant="accent"><span className="size-1.5 rounded-full bg-current" /> Active</Badge>
          </li>
        ))}
      </ul>
      <p className="border-t border-line px-4 py-3 font-mono text-[11px] text-fg-subtle sm:px-5">All 14 codes redirecting · no service page, no ads</p>
    </div>
  );
}
