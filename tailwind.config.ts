import type { Config } from "tailwindcss";

/**
 * Implements DESIGN.md. Colours resolve to CSS variables (see src/app/globals.css)
 * so dark/light switch by changing [data-theme] on <html>.
 */
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "16px", sm: "24px" },
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        bg: { DEFAULT: v("bg"), raised: v("bg-raised"), overlay: v("bg-overlay") },
        fg: { DEFAULT: v("text"), muted: v("text-muted"), subtle: v("text-subtle") },
        accent: { DEFAULT: v("accent"), ink: v("accent-ink"), text: v("accent-text") },
        depth: v("depth"),
        danger: v("danger"),
        warning: v("warning"),
        glass: "var(--glass)",
        "glass-strong": "var(--glass-strong)",
        line: "var(--border)",
        "line-strong": "var(--border-strong)",
      },
      fontFamily: {
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-2xl": ["clamp(3.25rem, 1.9rem + 5.2vw, 6rem)", { lineHeight: "0.92", letterSpacing: "-0.045em" }],
        "display-xl": ["clamp(2.75rem, 1.6rem + 4.4vw, 5rem)", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
        "display-lg": ["clamp(2.25rem, 1.5rem + 3vw, 3.75rem)", { lineHeight: "1", letterSpacing: "-0.035em" }],
        "display-md": ["clamp(1.875rem, 1.4rem + 1.8vw, 2.75rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        h3: ["clamp(1.375rem, 1.2rem + 0.6vw, 1.75rem)", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        h4: ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "body-lg": ["clamp(1.125rem, 1.08rem + 0.2vw, 1.25rem)", { lineHeight: "1.55" }],
        body: ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        label: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.08em" }],
      },
      borderRadius: { xs: "8px", sm: "12px", md: "16px", lg: "20px", xl: "24px" },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,.4)",
        md: "0 8px 24px -8px rgba(0,0,0,.5)",
        lg: "0 24px 64px -16px rgba(0,0,0,.6)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,.06), inset 0 0 0 1px var(--border)",
        "glow-accent": "0 0 0 1px rgb(var(--accent) / .35), 0 0 24px rgb(var(--accent) / .28), 0 0 64px rgb(var(--accent) / .12)",
      },
      transitionTimingFunction: { stay: "cubic-bezier(0.22, 1, 0.36, 1)" },
      transitionDuration: { micro: "120ms", fast: "200ms", base: "400ms", slow: "700ms", hero: "1400ms" },
      spacing: { 18: "4.5rem", 30: "7.5rem", 40: "10rem" },
      maxWidth: { container: "1200px", wide: "1360px" },
    },
  },
  plugins: [],
};

export default config;
