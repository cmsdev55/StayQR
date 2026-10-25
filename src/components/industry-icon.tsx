/** Line icons for the eight industries (24px grid, currentColor). */
const PATHS: Record<string, string> = {
  restaurants: "M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2.2-3 5s1.3 4 3 4M17 3v18",
  "real-estate": "M3 11l9-7 9 7M5 9.5V20h14V9.5M10 20v-6h4v6",
  events: "M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4zM14 7v10",
  retail: "M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2",
  healthcare: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10zM12 9v5M9.5 11.5h5",
  hotels: "M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5M7 11.5h.01",
  education: "M2 9l10-5 10 5-10 5zM6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6",
  agencies: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5",
};

export function IndustryIcon({ slug, size = 20, className }: { slug: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={PATHS[slug] ?? PATHS.agencies} />
    </svg>
  );
}
