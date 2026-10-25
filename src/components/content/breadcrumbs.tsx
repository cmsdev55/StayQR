import Link from "next/link";

/** Visible breadcrumb trail (pair it with breadcrumbLd for structured data). */
export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-[12px] text-fg-subtle">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((it, i) => (
          <li key={it.path} className="flex items-center gap-2">
            {i < items.length - 1 ? (
              <Link href={it.path} className="transition-colors hover:text-fg">{it.name}</Link>
            ) : (
              <span aria-current="page" className="text-fg-muted">{it.name}</span>
            )}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
