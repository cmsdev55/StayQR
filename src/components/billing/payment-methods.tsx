import { cn } from "@/lib/utils";

/** "Pay by card" reassurance: accepted cards and who processes the payment. */
export function PaymentMethods({ className, align = "left" }: { className?: string; align?: "left" | "center" }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] text-fg-subtle", align === "center" && "justify-center", className)}>
      <span className="inline-flex items-center gap-1.5 font-medium text-fg-muted">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
        Pay by card
      </span>
      <span className="flex items-center gap-1.5">
        <span className="sr-only">Visa, Mastercard and American Express accepted.</span>
        {["VISA", "Mastercard", "AMEX"].map((c) => (
          <span key={c} aria-hidden className="inline-flex h-6 items-center rounded-[5px] border border-line bg-bg-raised px-2 font-mono text-[10px] font-semibold tracking-[0.06em] text-fg">
            {c}
          </span>
        ))}
      </span>
      <span>Secure checkout by Lemon Squeezy. We never see your card number.</span>
    </div>
  );
}
