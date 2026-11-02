"use client";

import { useMemo, useState } from "react";
import { QrSvg } from "@/components/qr/qr-svg";
import { Button, ButtonLink } from "@/components/ui/button";
import { qrMatrix } from "@/lib/qr";
import { SITE_HOST } from "@/lib/site";

export const PENDING_DESTINATION_KEY = "endureqr-pending-destination";

/**
 * Tool-first start for the dynamic-code page: type a destination, see the code you'd print, then continue to an
 * account with the destination carried over (the new-code editor picks it up from localStorage).
 */
export function DynamicTry() {
  const [dest, setDest] = useState("");
  const shortLink = `https://${SITE_HOST}/r/yourcode`;
  const matrix = useMemo(() => qrMatrix(shortLink, 0), [shortLink]);
  const clean = dest.trim();
  const valid = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(clean);

  const go = () => {
    try {
      localStorage.setItem(PENDING_DESTINATION_KEY, clean);
    } catch {}
    window.location.href = "/signup?plan=pro-yearly&from=dynamic-try";
  };

  return (
    <div className="glass mt-10 grid gap-6 rounded-xl p-5 sm:p-8 md:grid-cols-[minmax(0,1fr)_200px] md:items-center">
      <div>
        <label htmlFor="dyn-dest" className="text-body font-semibold text-fg">Where should your code go?</label>
        <p className="mt-1 text-body-sm text-fg-muted">Type a link. You can change it any time after printing.</p>
        <input
          id="dyn-dest"
          type="url"
          inputMode="url"
          value={dest}
          onChange={(e) => setDest(e.target.value)}
          placeholder="yourwebsite.com/menu"
          className="mt-4 h-12 w-full rounded-sm border border-line bg-bg-raised px-4 text-body text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none"
          spellCheck={false}
        />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button onClick={go} disabled={!valid} size="lg">Create this dynamic code</Button>
          <ButtonLink href="/qr-code-generator/url" variant="secondary" size="lg">Make a free static one</ButtonLink>
        </div>
        <p className="mt-3 text-[12px] text-fg-subtle">Pro from $29 a year · 14-day money-back guarantee · codes keep working if you cancel</p>
      </div>
      <figure className="flex flex-col items-center gap-3">
        <span className="grid size-[176px] place-items-center rounded-lg bg-white p-3 text-[#0B0D12] shadow-md">
          <QrSvg m={matrix} shape="rounded" className="size-full" />
        </span>
        <figcaption className="text-center font-mono text-[11px] text-fg-subtle">
          {SITE_HOST}/r/… → <span className="text-fg-muted">{valid ? clean.replace(/^https?:\/\//, "").slice(0, 28) : "your link"}</span>
        </figcaption>
      </figure>
    </div>
  );
}
