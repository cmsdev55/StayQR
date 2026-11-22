"use client";

/**
 * Free QR code scanner for images: upload, drop or paste a screenshot/photo and read the code in the browser
 * (jsQR). Nothing is uploaded. The camera stays off (the site's Permissions-Policy disables it), so this is
 * the "scan a QR code from an image or screenshot" tool, not a live camera scanner.
 */
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Short-link domains we have verified belong to QR services (see /guides/free-qr-code-generators-tested). */
const SHORT_LINKS: { host: RegExp; name: string }[] = [
  { host: /(^|\.)endureqr\.com$/, name: "EndureQR" },
  { host: /(^|\.)qrs\.ly$/, name: "QRStuff" },
  { host: /(^|\.)opn\.to$/, name: "Unitag" },
  { host: /(^|\.)q\.me-qr\.com$/, name: "ME-QR" },
  { host: /(^|\.)scnv\.io$/, name: "Scanova" },
  { host: /(^|\.)flowcode\.com$/, name: "Flowcode" },
  { host: /(^|\.)canvaqr\.com$/, name: "Canva" },
  { host: /(^|\.)bit\.ly$/, name: "Bitly" },
];

type Result =
  | { kind: "url"; raw: string; url: URL; via?: string }
  | { kind: "wifi"; raw: string; ssid: string; security: string; password: string; hidden: boolean }
  | { kind: "contact"; raw: string; name: string }
  | { kind: "email" | "phone" | "sms" | "location" | "event" | "text"; raw: string };

function unescapeWifi(s: string) {
  return s.replace(/\\([\\;,:"])/g, "$1");
}

function classify(raw: string): Result {
  const t = raw.trim();
  if (/^https?:\/\//i.test(t)) {
    try {
      const url = new URL(t);
      const short = SHORT_LINKS.find((s) => s.host.test(url.hostname));
      const via = short && !(short.name === "EndureQR" && !url.pathname.startsWith("/r/")) ? short.name : undefined;
      return { kind: "url", raw: t, url, via };
    } catch {
      /* fall through to text */
    }
  }
  if (/^WIFI:/i.test(t)) {
    const field = (k: string) => {
      const m = t.match(new RegExp(`[:;]${k}:((?:\\\\.|[^;])*)`, "i"));
      return m ? unescapeWifi(m[1]) : "";
    };
    return { kind: "wifi", raw: t, ssid: field("S"), security: field("T") || "None", password: field("P"), hidden: /[:;]H:true/i.test(t) };
  }
  if (/^BEGIN:VCARD/i.test(t) || /^MECARD:/i.test(t)) {
    const fn = t.match(/^FN[^:\n]*:(.+)$/im)?.[1] ?? t.match(/^MECARD:N:([^;]+)/i)?.[1] ?? "";
    return { kind: "contact", raw: t, name: fn.trim() };
  }
  if (/^(mailto:|MATMSG:)/i.test(t)) return { kind: "email", raw: t };
  if (/^tel:/i.test(t)) return { kind: "phone", raw: t };
  if (/^(sms:|smsto:)/i.test(t)) return { kind: "sms", raw: t };
  if (/^geo:/i.test(t)) return { kind: "location", raw: t };
  if (/BEGIN:VEVENT/i.test(t)) return { kind: "event", raw: t };
  return { kind: "text", raw: t };
}

const LABEL: Record<Result["kind"], string> = {
  url: "Website link",
  wifi: "WiFi network",
  contact: "Contact card",
  email: "Email",
  phone: "Phone number",
  sms: "Text message",
  location: "Location",
  event: "Calendar event",
  text: "Plain text",
};

/** Decode a QR code from an image: try the full image, then smaller copies with a white border (helps tight crops and huge photos). */
async function decodeImage(file: Blob): Promise<string | null> {
  const jsQR = (await import("jsqr")).default;
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  const longest = Math.max(bitmap.width, bitmap.height);
  const sizes = [Math.min(longest, 1600), 1000, 600, 2400].filter((v, i, a) => v <= Math.max(longest, 600) * 1.5 && a.indexOf(v) === i);
  for (const size of sizes) {
    for (const pad of [0, 0.08]) {
      const scale = size / longest;
      const w = Math.round(bitmap.width * scale);
      const h = Math.round(bitmap.height * scale);
      const p = Math.round(Math.max(w, h) * pad);
      canvas.width = w + p * 2;
      canvas.height = h + p * 2;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, p, p, w, h);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const res = jsQR(data.data, data.width, data.height, { inversionAttempts: "attemptBoth" });
      if (res?.data) {
        bitmap.close();
        return res.data;
      }
    }
  }
  bitmap.close();
  return null;
}

export function QrScanner() {
  const [state, setState] = useState<"idle" | "busy" | "done" | "none" | "error">("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const handle = useCallback(async (file: Blob | null | undefined) => {
    if (!file || !file.type.startsWith("image/")) {
      setState("error");
      return;
    }
    setState("busy");
    setResult(null);
    setCopied(false);
    setShowPw(false);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
    try {
      const text = await decodeImage(file);
      if (text) {
        setResult(classify(text));
        setState("done");
      } else setState("none");
    } catch {
      setState("error");
    }
  }, []);

  // Paste a screenshot anywhere on the page (Ctrl/Cmd+V)
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const item = [...(e.clipboardData?.items ?? [])].find((i) => i.type.startsWith("image/"));
      if (item) {
        e.preventDefault();
        void handle(item.getAsFile());
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handle]);

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.raw);
      setCopied(true);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void handle(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "glass flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-6 text-center transition-colors duration-fast ease-stay sm:p-8",
          drag ? "border-accent" : "border-line-strong",
        )}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="The image you chose" className="max-h-56 max-w-full rounded-md object-contain" />
        ) : (
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-fg-subtle" aria-hidden>
            <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
            <rect x="7" y="7" width="4" height="4" rx="0.5" />
            <rect x="13" y="7" width="4" height="4" rx="0.5" />
            <rect x="7" y="13" width="4" height="4" rx="0.5" />
            <path d="M14 14h3v3" />
          </svg>
        )}
        <div>
          <p className="font-display text-h4 font-semibold text-fg">Drop an image with a QR code</p>
          <p className="mt-1 text-body-sm text-fg-muted">Or paste a screenshot (Ctrl/⌘+V), or choose a file. PNG, JPEG, WebP, HEIC.</p>
        </div>
        <input
          ref={input}
          type="file"
          accept="image/*"
          className="sr-only"
          id="qr-scan-input"
          aria-label="Choose an image with a QR code"
          onChange={(e) => {
            void handle(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <Button type="button" onClick={() => input.current?.click()}>Choose image</Button>
        <p className="text-[12px] text-fg-subtle">The image stays on your device. Nothing is uploaded.</p>
      </div>

      <div className="glass flex min-h-[300px] flex-col rounded-xl p-6 sm:p-8" aria-live="polite">
        {state === "idle" && (
          <div className="m-auto max-w-[36ch] text-center text-body-sm text-fg-muted">
            The result appears here: what the code contains, and whether it opens a link directly or goes through a QR company&apos;s short link.
          </div>
        )}
        {state === "busy" && <p className="m-auto text-body-sm text-fg-muted">Reading the code…</p>}
        {state === "none" && (
          <div className="m-auto max-w-[40ch] text-center">
            <p className="font-display text-h4 font-semibold text-fg">No QR code found</p>
            <p className="mt-2 text-body-sm text-fg-muted">
              Try a sharper or closer image, crop around the code, or make sure the whole code and its white border are in the picture. Our{" "}
              <Link href="/guides/qr-code-not-scanning" className="text-fg underline decoration-line-strong underline-offset-4">QR code not scanning</Link> checklist can help.
            </p>
          </div>
        )}
        {state === "error" && <p className="m-auto text-body-sm text-fg-muted">That file isn&apos;t an image this browser can read. Try a PNG or JPEG.</p>}
        {state === "done" && result && (
          <div className="flex flex-col gap-4">
            <p className="eyebrow">{LABEL[result.kind]}</p>

            {result.kind === "url" && (
              <>
                <p className="break-all font-mono text-body-sm text-fg">{result.raw}</p>
                <p className="text-body-sm text-fg-muted">
                  Opens <span className="font-semibold text-fg">{result.url.hostname}</span>. Check this is the site you expect before you tap: a QR code can point anywhere.
                </p>
                {result.via ? (
                  <div className="rounded-md border border-line bg-bg-raised p-4 text-body-sm text-fg-muted">
                    <span className="font-semibold text-fg">Dynamic code ({result.via}).</span> It opens {result.via}&apos;s short link first, which then forwards to the real page, so it only works while {result.via} keeps that link switched on.
                    {result.via === "EndureQR" ? " EndureQR's dynamic codes keep redirecting even if the owner cancels." : " Some services switch dynamic codes off when a trial or plan ends."}{" "}
                    <Link href="/guides/free-qr-code-generators-tested" className="text-fg underline decoration-line-strong underline-offset-4">What we found testing 20 generators</Link>
                  </div>
                ) : (
                  <div className="rounded-md border border-line bg-bg-raised p-4 text-body-sm text-fg-muted">
                    If <span className="font-semibold text-fg">{result.url.hostname}</span> is the page&apos;s own website, this is a <span className="font-semibold text-fg">direct (static) code</span>: it keeps working as long as that page exists. If it&apos;s a short link from another company, the code depends on that company.{" "}
                    <Link href="/guides/do-qr-codes-expire" className="text-fg underline decoration-line-strong underline-offset-4">Do QR codes expire?</Link>
                  </div>
                )}
                <div className="flex flex-wrap gap-3">
                  <a href={result.url.href} target="_blank" rel="noopener noreferrer nofollow" className={buttonVariants({})}>Open link</a>
                  <Button type="button" variant="secondary" onClick={copy}>{copied ? "Copied" : "Copy"}</Button>
                </div>
              </>
            )}

            {result.kind === "wifi" && (
              <>
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-body-sm">
                  <dt className="text-fg-muted">Network</dt>
                  <dd className="break-all font-medium text-fg">{result.ssid || "(no name)"}{result.hidden ? " (hidden)" : ""}</dd>
                  <dt className="text-fg-muted">Security</dt>
                  <dd className="text-fg">{result.security}</dd>
                  {result.password && (
                    <>
                      <dt className="text-fg-muted">Password</dt>
                      <dd className="break-all font-mono text-fg">
                        {showPw ? result.password : "•".repeat(Math.min(result.password.length, 16))}{" "}
                        <button type="button" className="ml-1 text-[12px] text-fg-muted underline underline-offset-2" onClick={() => setShowPw((v) => !v)}>{showPw ? "Hide" : "Show"}</button>
                      </dd>
                    </>
                  )}
                </dl>
                <p className="text-body-sm text-fg-muted">On a phone, scanning this code with the camera joins the network without typing the password.</p>
                <Button type="button" variant="secondary" onClick={copy}>{copied ? "Copied" : "Copy raw text"}</Button>
              </>
            )}

            {result.kind !== "url" && result.kind !== "wifi" && (
              <>
                {result.kind === "contact" && result.name && <p className="font-display text-h4 font-semibold text-fg">{result.name}</p>}
                <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-all rounded-md border border-line bg-bg-raised p-4 font-mono text-[13px] text-fg">{result.raw}</pre>
                <p className="text-body-sm text-fg-muted">
                  This code stores its content directly in the pattern, so it works offline and doesn&apos;t depend on any service.
                </p>
                <Button type="button" variant="secondary" onClick={copy}>{copied ? "Copied" : "Copy"}</Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
