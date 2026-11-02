import { RichText } from "@/components/content/rich-text";
import type { GuideBlock } from "@/content/guides";

/** Long-form content blocks shared by guides and landing pages (inline **bold** and [links] via RichText). */
export function Block({ b }: { b: GuideBlock }) {
  switch (b.type) {
    case "p":
      return <p className="break-words text-body-lg text-fg-muted"><RichText text={b.text} /></p>;
    case "h2":
      return <h2 id={b.id} className="scroll-mt-28 pt-8 font-display text-h3 font-semibold sm:text-[2rem] sm:leading-[1.15] text-fg [text-wrap:balance]">{b.text}</h2>;
    case "h3":
      return <h3 className="pt-2 font-display text-h4 font-semibold text-fg">{b.text}</h3>;
    case "ul":
    case "ol": {
      const List = b.type;
      return (
        <List className={`${b.type === "ul" ? "list-disc" : "list-decimal"} flex flex-col gap-2 break-words pl-6 text-body-lg text-fg-muted marker:text-fg-subtle`}>
          {b.items.map((it, i) => <li key={i} className="pl-1"><RichText text={it} /></li>)}
        </List>
      );
    }
    case "table":
      return (
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[480px] text-left text-body-sm">
            <thead className="bg-glass-strong">
              <tr>{b.head.map((h) => <th key={h} scope="col" className="px-4 py-3 font-semibold text-fg">{h}</th>)}</tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className="border-t border-line">
                  {r.map((c, j) => (j === 0 ? <th key={j} scope="row" className="px-4 py-3 font-medium text-fg"><RichText text={c} /></th> : <td key={j} className="px-4 py-3 text-fg-muted"><RichText text={c} /></td>))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "tip":
      return (
        <aside className="break-words rounded-lg border border-line border-l-accent bg-bg-raised px-5 py-4 text-body text-fg-muted [border-left-width:3px]">
          <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.08em] text-accent-text">Tip</span>
          <RichText text={b.text} />
        </aside>
      );
  }
}
