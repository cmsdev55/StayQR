"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { bulkCreateAction } from "@/app/dashboard/actions";
import { Button, ButtonLink } from "@/components/ui/button";
import { csvToCodes } from "@/lib/csv";
import { DEFAULT_DESIGN } from "@/lib/qr-design";
import { artworkSvg } from "@/lib/qr-export";

type Row = { name: string; destination: string; folder: string };
type Created = { slug: string; name: string; shortUrl: string };

const SAMPLE = "name,destination,folder\nTable 1,https://example.com/menu?table=1,Restaurant\nTable 2,https://example.com/menu?table=2,Restaurant\n";

/** CSV in, one dynamic code per row out, then a ZIP of print-ready SVGs. */
export function BulkCreate({ limit }: { limit: number }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Created[] | null>(null);
  const [zipping, setZipping] = useState(false);
  const [busy, start] = useTransition();
  const input = useRef<HTMLInputElement>(null);

  const load = async (file?: File) => {
    setError(null);
    setCreated(null);
    if (!file) return;
    if (file.size > 2_000_000) return setError("Keep the file under 2 MB.");
    const parsed = csvToCodes(await file.text());
    setFileName(file.name);
    if (!parsed.length) return setError("That file has no rows we can read. Use the template below.");
    if (parsed.length > limit) return setError(`Up to ${limit} rows at a time; this file has ${parsed.length}.`);
    setRows(parsed);
  };

  const create = () =>
    start(async () => {
      const r = await bulkCreateAction(rows);
      if (!r.ok) return setError(r.error);
      setCreated(r.data ?? []);
      setRows([]);
    });

  const zip = async () => {
    if (!created) return;
    setZipping(true);
    try {
      const { zipSync, strToU8 } = await import("fflate");
      const files: Record<string, Uint8Array> = {};
      const used = new Set<string>();
      for (const c of created) {
        const { svg } = await artworkSvg(c.shortUrl, DEFAULT_DESIGN);
        let base = (c.name || c.slug).replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || c.slug;
        if (used.has(base)) base = `${base}-${c.slug}`;
        used.add(base);
        files[`${base}.svg`] = strToU8(svg);
      }
      const csv = ["name,short_link", ...created.map((c) => `"${c.name.replace(/"/g, '""')}",${c.shortUrl}`)].join("\n");
      files["short-links.csv"] = strToU8(csv);
      const blob = new Blob([zipSync(files, { level: 6 }) as BlobPart], { type: "application/zip" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `stayqr-codes-${new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="max-w-[860px] pb-16">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-fg">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M10 3L5 8l5 5" /></svg>
        All codes
      </Link>
      <h1 className="mt-3 font-display text-h4 font-semibold text-fg sm:text-[26px]">Bulk create from CSV</h1>
      <p className="mt-1 max-w-[62ch] text-fg-muted">
        One dynamic code per row, up to {limit} at a time. Columns: <span className="font-mono text-[13px]">name</span>, <span className="font-mono text-[13px]">destination</span> and an optional <span className="font-mono text-[13px]">folder</span>.
      </p>

      {created ? (
        <section className="mt-6 rounded-md border border-line bg-bg-raised p-6" aria-live="polite">
          <h2 className="text-[20px] font-semibold text-fg">{created.length} codes created</h2>
          <p className="mt-1 text-fg-muted">Download every code as a print-ready SVG, with a CSV of the short links. You can restyle any code later.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button size="sm" onClick={zip} disabled={zipping}>{zipping ? "Preparing ZIP" : "Download ZIP"}</Button>
            <ButtonLink href="/dashboard" size="sm" variant="secondary">Go to codes</ButtonLink>
          </div>
        </section>
      ) : (
        <section className="mt-6 rounded-md border border-line bg-bg-raised p-6">
          <input ref={input} type="file" accept=".csv,text/csv" className="sr-only" id="csv" onChange={(e) => load(e.target.files?.[0])} />
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" variant="secondary" onClick={() => input.current?.click()}>{fileName ? "Choose another file" : "Choose CSV file"}</Button>
            <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(SAMPLE)}`} download="stayqr-template.csv" className="font-medium text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">
              Download template
            </a>
            {fileName && <span className="font-mono text-[12px] text-fg-subtle">{fileName} · {rows.length} rows</span>}
          </div>
          {error && <p role="alert" className="mt-4 rounded-sm bg-danger/[0.08] px-3 py-2.5 text-fg">{error}</p>}

          {rows.length > 0 && (
            <>
              <div className="mt-6 overflow-x-auto rounded-sm border border-line">
                <table className="w-full min-w-[520px] text-left">
                  <thead className="bg-bg-overlay font-mono text-[11px] uppercase tracking-[0.08em] text-fg-subtle">
                    <tr><th className="px-3 py-2 font-normal">#</th><th className="px-3 py-2 font-normal">Name</th><th className="px-3 py-2 font-normal">Destination</th><th className="px-3 py-2 font-normal">Folder</th></tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {rows.slice(0, 10).map((r, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 font-mono text-[12px] text-fg-subtle">{i + 1}</td>
                        <td className="max-w-[180px] truncate px-3 py-2 text-fg">{r.name || <span className="text-fg-subtle">Untitled</span>}</td>
                        <td className="max-w-[300px] truncate px-3 py-2 font-mono text-[12px] text-fg-muted">{r.destination}</td>
                        <td className="px-3 py-2 text-fg-muted">{r.folder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {rows.length > 10 && <p className="mt-2 text-[12px] text-fg-subtle">…and {rows.length - 10} more rows.</p>}
              <Button className="mt-5" onClick={create} disabled={busy}>{busy ? "Creating codes" : `Create ${rows.length} codes`}</Button>
            </>
          )}
        </section>
      )}
    </div>
  );
}
