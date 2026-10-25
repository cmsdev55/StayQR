import Link from "next/link";
import { RichText } from "@/components/content/rich-text";
import type { LegalDoc } from "@/content/legal";

/** One legal document: title, short-version card, sticky section index, the full text and a link to the other document. */
export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <article aria-labelledby="legal-title">
      <header className="max-w-[720px]">
        <h1 id="legal-title" className="fade-up font-display text-display-lg font-semibold text-fg" style={{ ["--d" as string]: "60ms" }}>
          {doc.title}
        </h1>
        <p className="fade-up mt-4 font-mono text-[12px] text-fg-subtle" style={{ ["--d" as string]: "120ms" }}>
          Effective {doc.effective} · Last updated {doc.updated}
        </p>
      </header>

      <section aria-labelledby="short-title" className="glass fade-up mt-10 max-w-[720px] rounded-xl p-6 sm:p-8" style={{ ["--d" as string]: "240ms" }}>
        <h2 id="short-title" className="eyebrow">The short version</h2>
        <ul className="mt-5 flex flex-col gap-3">
          {doc.summary.map((s) => (
            <li key={s} className="flex gap-3 text-body text-fg">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-1 shrink-0 text-accent-text" aria-hidden>
                <path d="M3 8.5l3 3 7-7" />
              </svg>
              <span><RichText text={s} /></span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-body-sm text-fg-subtle">This summary helps you read the document; the full text below is what applies.</p>
      </section>

      <div className="mt-16 grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="Sections" className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">On this page</p>
          <ol className="mt-4 flex flex-col gap-1 border-l border-line">
            {doc.sections.map((s, i) => (
              <li key={s.id}>
                <Link href={`#${s.id}`} className="-ml-px flex gap-3 border-l border-transparent py-1.5 pl-4 text-body-sm text-fg-muted transition-colors duration-fast ease-stay hover:border-fg hover:text-fg">
                  <span className="font-mono text-[12px] text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-[68ch]">
          {doc.sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="border-t border-line pb-10 pt-8 first:border-t-0 first:pt-0">
              <h2 id={`${s.id}-h`} className="flex items-baseline gap-3 font-display text-h3 font-semibold text-fg">
                <span className="font-mono text-[13px] font-normal text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
              {s.body.map((p, j) => (
                <p key={j} className="mt-4 text-body text-fg-muted">
                  <RichText text={p} />
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>

      <p className="mt-6 border-t border-line pt-8 text-body-sm text-fg-muted">
        {doc.slug === "terms" ? "How we handle your data: " : "The agreement for using StayQR: "}
        <Link href={doc.slug === "terms" ? "/privacy" : "/terms"} className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">
          {doc.slug === "terms" ? "Privacy Policy" : "Terms of Service"}
        </Link>
      </p>
    </article>
  );
}
