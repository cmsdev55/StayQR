import Link from "next/link";
import { Fragment } from "react";

/** Renders the guides' inline markup: **bold** and [text](/path) only. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((p, i) => {
        const bold = p.match(/^\*\*([^*]+)\*\*$/);
        if (bold) return <strong key={i} className="font-semibold text-fg">{bold[1]}</strong>;
        const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const internal = link[2].startsWith("/");
          return internal ? (
            <Link key={i} href={link[2]} className="text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-fg">{link[1]}</Link>
          ) : (
            <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer" className="text-fg underline decoration-line-strong underline-offset-4">{link[1]}</a>
          );
        }
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}
