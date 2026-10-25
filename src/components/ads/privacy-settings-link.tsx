"use client";

/** Reopens Google's consent message (Funding Choices). Shown only when AdSense is configured. */
export function PrivacySettingsLink({ className }: { className?: string }) {
  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT) return null;
  const open = () => {
    const w = window as Window & { googlefc?: { callbackQueue?: unknown[]; showRevocationMessage?: () => void } };
    w.googlefc = w.googlefc || {};
    (w.googlefc.callbackQueue = w.googlefc.callbackQueue || []).push(() => w.googlefc?.showRevocationMessage?.());
  };
  return (
    <button type="button" onClick={open} className={className}>
      Privacy settings
    </button>
  );
}
