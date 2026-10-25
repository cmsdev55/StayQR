"use client";

import { forwardRef, useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type InputProps = Omit<ComponentProps<"input">, "size"> & {
  label: ReactNode;
  /** 48px on the marketing site, 40px in the dashboard (DESIGN.md §7). */
  size?: "md" | "sm";
  hint?: ReactNode;
  error?: ReactNode;
  /** Visually hide the label (it stays for screen readers). Use sparingly. */
  hideLabel?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
};

export const fieldClass =
  "w-full rounded-sm border border-line bg-glass-strong text-fg placeholder:text-fg-subtle transition-[border-color,box-shadow,background-color] duration-fast ease-stay hover:border-line-strong focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 [[data-theme=light]_&]:focus:border-accent-text [[data-theme=light]_&]:focus:ring-accent-text/20 disabled:opacity-50 aria-[invalid=true]:border-danger";

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, size = "md", hint, error, hideLabel, leading, trailing, className, id, ...props },
  ref,
) {
  const auto = useId();
  const inputId = id ?? auto;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={inputId} className={cn("text-body-sm font-medium text-fg", hideLabel && "sr-only")}>
        {label}
      </label>
      <div className="relative">
        {leading && <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-fg-subtle">{leading}</span>}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            fieldClass,
            size === "md" ? "h-12 px-4 text-body" : "h-10 px-3 text-body-sm",
            leading && (size === "md" ? "pl-11" : "pl-9"),
            trailing && "pr-11",
          )}
          {...props}
        />
        {trailing && <span className="absolute inset-y-0 right-1.5 flex items-center">{trailing}</span>}
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="text-body-sm text-danger">{error}</p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-body-sm text-fg-subtle">{hint}</p>
      ) : null}
    </div>
  );
});
