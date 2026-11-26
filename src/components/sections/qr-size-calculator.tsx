"use client";

/**
 * QR code size calculator. Counts the real modules for the user's content (qrcode-generator, level M, or H
 * with a logo) and combines two limits, both from /guides/qr-code-size-for-printing:
 *   - distance: the code is at least 1/10 of the scanning distance (10:1 rule)
 *   - module floor: 0.8 mm per module for everyday printing, 0.4 mm (GS1's 0.396 mm) for sharp professional print
 * Everything runs in the browser.
 */
import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { fieldClass } from "@/components/ui/input";
import { qrMatrix } from "@/lib/qr";
import { cn } from "@/lib/utils";

type Unit = "cm" | "m" | "in" | "ft";
const TO_MM: Record<Unit, number> = { cm: 10, m: 1000, in: 25.4, ft: 304.8 };

const PRESETS: { label: string; text: string }[] = [
  { label: "Website link", text: "https://www.example.com" },
  { label: "Page link with a path", text: "https://www.example.com/menu/autumn-specials" },
  { label: "WiFi login", text: "WIFI:T:WPA;S:Cafe Guest;P:coffee2026;;" },
  { label: "Contact card", text: "BEGIN:VCARD\nVERSION:3.0\nN:Example;Jane\nFN:Jane Example\nTEL:+15555550100\nEMAIL:jane@example.com\nURL:https://example.com\nEND:VCARD" },
];

const PLACES: { label: string; mm: number }[] = [
  { label: "Business card (20 cm)", mm: 200 },
  { label: "Flyer or packaging (30 cm)", mm: 300 },
  { label: "Table tent or menu (50 cm)", mm: 500 },
  { label: "Poster at eye level (1 m)", mm: 1000 },
  { label: "Large poster or stand (2 m)", mm: 2000 },
  { label: "Banner or sign (5 m)", mm: 5000 },
];

const cm = (mm: number) => (mm >= 1000 ? `${(mm / 1000).toFixed(2).replace(/\.?0+$/, "")} m` : `${(mm / 10).toFixed(mm < 100 ? 1 : 0)} cm`);
const inch = (mm: number) => `${(mm / 25.4).toFixed(mm / 25.4 < 10 ? 2 : 1).replace(/\.?0+$/, "")} in`;

export function QrSizeCalculator() {
  const uid = useId();
  const [text, setText] = useState(PRESETS[0].text);
  const [distance, setDistance] = useState("50");
  const [unit, setUnit] = useState<Unit>("cm");
  const [logo, setLogo] = useState(false);
  const [pro, setPro] = useState(false);

  const modules = useMemo(() => {
    if (!text.trim()) return 0;
    try {
      return qrMatrix(text, 0, logo ? "H" : "M").length;
    } catch {
      return -1; // too long for a QR code
    }
  }, [text, logo]);

  const d = Number(distance.replace(",", "."));
  const distMm = Number.isFinite(d) && d > 0 ? d * TO_MM[unit] : 0;
  const moduleFloor = pro ? 0.4 : 0.8;
  const byDistance = distMm / 10;
  const byModules = modules > 0 ? modules * moduleFloor : 0;
  const width = Math.max(byDistance, byModules, pro ? 10 : 20);
  const ruled = byModules > byDistance ? "modules" : "distance";
  const moduleMm = modules > 0 ? width / modules : 0;
  const withMargin = modules > 0 ? (width * (modules + 8)) / modules : width;
  const px300 = Math.ceil((width / 25.4) * 300);
  const ready = modules > 0 && distMm > 0;

  const label = "text-body-sm font-medium text-fg";
  const chip = (on: boolean) =>
    cn("rounded-sm border px-3 py-2 text-body-sm transition-colors", on ? "border-accent bg-glass-strong text-fg" : "border-line text-fg-muted hover:border-line-strong hover:text-fg");

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-12">
      <div className="glass flex flex-col gap-6 rounded-lg p-5 sm:p-7">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${uid}-text`} className={label}>What will the code hold?</label>
          <textarea
            id={`${uid}-text`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Paste your link or text"
            className={cn(fieldClass, "resize-y px-4 py-3 font-mono text-body-sm")}
          />
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button key={p.label} type="button" onClick={() => setText(p.text)} aria-pressed={text === p.text} className={chip(text === p.text)}>
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-[13px] text-fg-subtle">Paste your real link for an exact answer: longer content makes a denser code that needs more space.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${uid}-dist`} className={label}>How far away will people scan it?</label>
          <div className="flex gap-2">
            <input id={`${uid}-dist`} inputMode="decimal" value={distance} onChange={(e) => setDistance(e.target.value)} className={cn(fieldClass, "h-11 w-32 px-4 text-body-sm")} />
            <select aria-label="Distance unit" value={unit} onChange={(e) => setUnit(e.target.value as Unit)} className={cn(fieldClass, "h-11 w-24 px-3 text-body-sm")}>
              <option value="cm">cm</option>
              <option value="m">m</option>
              <option value="in">in</option>
              <option value="ft">ft</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            {PLACES.map((p) => {
              const on = Math.abs(distMm - p.mm) < 1;
              return (
                <button
                  key={p.label}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    const u: Unit = unit === "in" || unit === "ft" ? (p.mm >= 1000 ? "ft" : "in") : p.mm >= 1000 ? "m" : "cm";
                    setUnit(u);
                    setDistance(String(Math.round((p.mm / TO_MM[u]) * 10) / 10));
                  }}
                  className={chip(on)}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className={label}>Options</legend>
          <label className="flex items-start gap-3 text-body-sm text-fg-muted">
            <input type="checkbox" checked={logo} onChange={(e) => setLogo(e.target.checked)} className="mt-1 size-4 accent-accent" />
            <span><span className="text-fg">The code has a logo in the middle.</span> Logos need high error correction (level H), which adds modules.</span>
          </label>
          <label className="flex items-start gap-3 text-body-sm text-fg-muted">
            <input type="checkbox" checked={pro} onChange={(e) => setPro(e.target.checked)} className="mt-1 size-4 accent-accent" />
            <span><span className="text-fg">Sharp professional printing</span> (a print shop or label printer). Allows modules down to 0.4 mm instead of 0.8 mm.</span>
          </label>
        </fieldset>
      </div>

      <div className="flex flex-col gap-4" aria-live="polite">
        {modules === -1 ? (
          <div className="glass rounded-lg p-6 text-body text-fg">That's too much content for one QR code. Shorten it, or put the text on a web page and link to it.</div>
        ) : !ready ? (
          <div className="glass rounded-lg p-6 text-body text-fg-muted">Add your content and a scanning distance to see the size.</div>
        ) : (
          <div className="glass rounded-lg p-6 sm:p-7">
            <p className="eyebrow">Minimum print size</p>
            <p className="mt-3 font-display text-display-md font-semibold text-fg">
              {cm(width)} <span className="text-fg-muted">({inch(width)})</span>
            </p>
            <p className="mt-2 text-body-sm text-fg-muted">wide and tall, for the code itself. Bigger is fine; smaller risks failed scans.</p>
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-body-sm">
              <div>
                <dt className="text-fg-subtle">With the white margin</dt>
                <dd className="mt-1 font-medium text-fg">{cm(withMargin)} ({inch(withMargin)})</dd>
              </div>
              <div>
                <dt className="text-fg-subtle">Modules per side</dt>
                <dd className="mt-1 font-medium text-fg">{modules} × {modules}{logo ? " (level H)" : " (level M)"}</dd>
              </div>
              <div>
                <dt className="text-fg-subtle">Each module</dt>
                <dd className="mt-1 font-medium text-fg">{moduleMm.toFixed(2)} mm</dd>
              </div>
              <div>
                <dt className="text-fg-subtle">PNG at 300 DPI</dt>
                <dd className="mt-1 font-medium text-fg">{px300} × {px300} px</dd>
              </div>
            </dl>
            <p className="mt-6 border-t border-line pt-4 text-body-sm text-fg-muted">
              {ruled === "distance"
                ? `Set by the distance: a code should be at least a tenth as wide as the scanning distance (${cm(distMm)} ÷ 10).`
                : `Set by the content: ${modules} modules at ${moduleFloor} mm each. Shorter content would let you print it smaller.`}
              {width === (pro ? 10 : 20) && byDistance < width && byModules < width ? ` We don't go below ${pro ? "1 cm" : "2 cm"}, the practical floor for ${pro ? "professional" : "everyday"} printing.` : ""}
            </p>
          </div>
        )}
        <p className="text-[13px] text-fg-subtle">
          Ready to make it? Use the <Link href="/qr-code-generator" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">free QR code generator</Link> and download SVG or PDF, which stay sharp at any size. Then print one test copy and scan it from where people will stand.
        </p>
      </div>
    </div>
  );
}
