import Link from "next/link";
import { QR_TYPES, type QrTypeDef } from "@/lib/qr-types";
import { cn } from "@/lib/utils";

const GROUPS: QrTypeDef["group"][] = ["Popular", "Contact", "Social", "More"];

function TypeIcon({ d }: { d: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function TypeCard({ t }: { t: QrTypeDef }) {
  return (
    <Link
      href={`/qr-code-generator/${t.slug}`}
      className="group flex items-center gap-3 rounded-md border border-line bg-bg-raised px-4 py-3.5 transition-colors duration-fast ease-stay hover:border-line-strong hover:bg-glass-strong"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-sm border border-line text-fg-muted transition-colors group-hover:text-fg">
        <TypeIcon d={t.icon} />
      </span>
      <span className="text-body-sm font-medium text-fg">{t.name} QR code</span>
    </Link>
  );
}

/** Every free generator type, grouped like the picker, each linking to its own page. */
export function TypeGrid({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-10", className)}>
      {GROUPS.map((g) => (
        <div key={g}>
          <h3 className="eyebrow">{g}</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {QR_TYPES.filter((t) => t.group === g).map((t) => (
              <li key={t.slug}><TypeCard t={t} /></li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** A short row of related types (the [type] pages' internal links). */
export function RelatedTypes({ slugs }: { slugs: string[] }) {
  const types = slugs.map((s) => QR_TYPES.find((t) => t.slug === s)).filter((t): t is QrTypeDef => !!t);
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {types.map((t) => (
        <li key={t.slug}><TypeCard t={t} /></li>
      ))}
    </ul>
  );
}
