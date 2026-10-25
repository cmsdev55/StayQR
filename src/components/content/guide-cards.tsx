import Link from "next/link";
import type { Guide } from "@/content/guides";

/** Guide teasers: category, title, standfirst and reading time. */
export function GuideCards({ guides }: { guides: Guide[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      {guides.map((g, i) => (
        <li key={g.slug} data-reveal="" style={{ ["--stagger" as string]: i % 3 }}>
          <Link
            href={`/guides/${g.slug}`}
            className="glass flex h-full flex-col rounded-lg p-6 transition-colors duration-fast ease-stay hover:border-line-strong sm:p-7"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-fg-subtle">{g.category} · {g.readMinutes} min read</span>
            <span className="mt-4 font-display text-h3 font-semibold text-fg [text-wrap:balance]">{g.h1}</span>
            <span className="mt-3 text-body-sm text-fg-muted">{g.summary}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
