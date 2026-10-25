import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Mono eyebrow + display heading + optional intro (DESIGN.md §7). Server component:
 * the words are real text; each slides out of its own mask when RevealObserver marks it in.
 * Wrap a word in *asterisks* to set it in the accent text colour.
 * `immediate` plays the mask on load instead (for headings at the top of a page).
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  as: Tag = "h2",
  id,
  immediate,
  size = "lg",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  id?: string;
  immediate?: boolean;
  size?: "lg" | "xl";
  className?: string;
}) {
  const words = title.split(" ");
  return (
    <div className={cn("flex flex-col", align === "center" ? "items-center text-center" : "items-start", className)}>
      {eyebrow && (
        <p className={cn("eyebrow", immediate ? "fade-up" : undefined)} data-reveal={immediate ? undefined : ""}>
          {eyebrow}
        </p>
      )}
      <Tag
        id={id}
        data-reveal={immediate ? undefined : "words"}
        className={cn(
          "mt-4 max-w-[18ch] font-display font-semibold text-fg [text-wrap:balance]",
          size === "xl" ? "text-display-xl" : "text-display-lg",
          align === "center" && "mx-auto",
        )}
      >
        {words.map((w, i) => {
          const accent = w.startsWith("*") && w.replace(/[.,!?]$/, "").endsWith("*");
          const clean = accent ? w.replace(/\*/g, "") : w;
          return (
            <span key={i}>
              <span className={immediate ? "mask-word" : "reveal-word"}>
                <span style={{ ["--i" as string]: i }} className={accent ? "text-accent-text" : undefined}>
                  {clean}
                </span>
              </span>
              {i < words.length - 1 ? " " : null}
            </span>
          );
        })}
      </Tag>
      {intro && (
        <p
          className={cn("mt-5 max-w-[56ch] text-body-lg text-fg-muted sm:mt-6", immediate && "fade-up")}
          data-reveal={immediate ? undefined : ""}
          style={{ ["--stagger" as string]: 3, ["--d" as string]: "300ms" }}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
