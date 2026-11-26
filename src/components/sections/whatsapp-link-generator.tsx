"use client";

/**
 * WhatsApp link generator: builds an official click-to-chat link (https://wa.me/<number>?text=<message>),
 * or a share link (https://wa.me/?text=<message>) that lets people pick the contact. Copy, test and get a QR
 * code for the same link. Runs in the browser; nothing is sent anywhere.
 */
import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { QrSvg } from "@/components/qr/qr-svg";
import { Button, buttonVariants } from "@/components/ui/button";
import { fieldClass } from "@/components/ui/input";
import { qrMatrix, qrRuns } from "@/lib/qr";
import { cn } from "@/lib/utils";

type Mode = "chat" | "share";

export function buildWaLink(mode: Mode, number: string, message: string) {
  const text = message.trim() ? `?text=${encodeURIComponent(message.trim())}` : "";
  if (mode === "share") return text ? `https://wa.me/${text}` : "";
  // international format, digits only: drop +, spaces, brackets, dashes and a leading 00
  const n = number.replace(/\D/g, "").replace(/^00/, "");
  return n ? `https://wa.me/${n}${text}` : "";
}

export function WhatsAppLinkGenerator() {
  const uid = useId();
  const [mode, setMode] = useState<Mode>("chat");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("Hi! I'd like to know more.");
  const [copied, setCopied] = useState(false);

  const link = buildWaLink(mode, number, message);
  const digits = number.replace(/\D/g, "").replace(/^00/, "");
  const warn =
    mode === "chat" && number.trim() && !number.trim().startsWith("+") && !number.trim().startsWith("00") && /^0/.test(digits)
      ? "This looks like a local number starting with 0. Use the international format: country code first, without the leading 0 (for example +92 300 1234567, not 0300 1234567)."
      : mode === "chat" && digits && (digits.length < 8 || digits.length > 15)
        ? "WhatsApp numbers are usually 8 to 15 digits including the country code. Check the number."
        : "";
  const m = useMemo(() => (link ? qrMatrix(link, 0) : null), [link]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the link is selectable in the box */
    }
  };

  const downloadSvg = () => {
    if (!m) return;
    const n = m.length;
    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 ${n + 8} ${n + 8}" width="1024" height="1024" shape-rendering="crispEdges"><rect x="-4" y="-4" width="${n + 8}" height="${n + 8}" fill="#fff"/><path d="${qrRuns(m)}" fill="none" stroke="#0B0D12" stroke-width="1" stroke-linecap="square"/></svg>`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    a.download = "whatsapp-qr-code.svg";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const chip = (on: boolean) =>
    cn("rounded-sm border px-3 py-2 text-body-sm transition-colors", on ? "border-accent bg-glass-strong text-fg" : "border-line text-fg-muted hover:border-line-strong hover:text-fg");

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-12">
      <div className="glass flex flex-col gap-6 rounded-lg p-5 sm:p-7">
        <fieldset>
          <legend className="text-body-sm font-medium text-fg">Link type</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => setMode("chat")} aria-pressed={mode === "chat"} className={chip(mode === "chat")}>Chat with my number</button>
            <button type="button" onClick={() => setMode("share")} aria-pressed={mode === "share"} className={chip(mode === "share")}>Share a message (no number)</button>
          </div>
          <p className="mt-3 text-[13px] text-fg-subtle">
            {mode === "chat" ? "Opens a chat with you, with the message ready to send." : "Opens WhatsApp with the message ready; people choose who to send it to."}
          </p>
        </fieldset>

        {mode === "chat" && (
          <div className="flex flex-col gap-2">
            <label htmlFor={`${uid}-num`} className="text-body-sm font-medium text-fg">WhatsApp number, with country code</label>
            <input id={`${uid}-num`} type="tel" inputMode="tel" autoComplete="off" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="+92 300 1234567" className={cn(fieldClass, "h-12 px-4 text-body")} />
            {warn && <p className="text-[13px] text-fg">{warn}</p>}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor={`${uid}-msg`} className="text-body-sm font-medium text-fg">Message {mode === "chat" ? "(optional)" : ""}</label>
          <textarea id={`${uid}-msg`} value={message} onChange={(e) => setMessage(e.target.value)} rows={3} maxLength={500} className={cn(fieldClass, "resize-y px-4 py-3 text-body-sm")} />
          <p className="text-[13px] text-fg-subtle">People can edit it before they send. Emoji and any language work.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${uid}-out`} className="text-body-sm font-medium text-fg">Your WhatsApp link</label>
          <input id={`${uid}-out`} readOnly value={link} placeholder={mode === "chat" ? "Add your number above" : "Add a message above"} onFocus={(e) => e.target.select()} className={cn(fieldClass, "h-12 px-4 font-mono text-body-sm")} />
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={copy} disabled={!link}>{copied ? "Copied" : "Copy link"}</Button>
            {link ? (
              <a href={link} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "secondary" })}>Test it</a>
            ) : (
              <Button type="button" variant="secondary" disabled>Test it</Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="glass w-full max-w-[340px] rounded-lg p-6">
          <div className="rounded-md bg-white p-4 text-[#0B0D12]">
            {m ? <QrSvg m={m} className="block aspect-square w-full" /> : <div className="grid aspect-square w-full place-items-center text-center text-body-sm text-[#4B5160]">Your QR code appears here</div>}
          </div>
          <p className="mt-4 text-center text-body-sm text-fg-muted">Scan to test: it opens the same link.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button type="button" variant="secondary" onClick={downloadSvg} disabled={!m}>Download QR (SVG)</Button>
        </div>
        <p className="max-w-[340px] text-center text-[13px] text-fg-subtle">
          Want your logo, colours, a frame or PNG and PDF files? Make it in the{" "}
          <Link href="/qr-code-generator/whatsapp" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">WhatsApp QR code generator</Link>.
        </p>
      </div>
    </div>
  );
}
