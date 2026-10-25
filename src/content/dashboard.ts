/** Realistic fake data for the dashboard mockups (one owner: a small restaurant + hospitality group). */
import type { QrDesign } from "@/lib/qr-design";

export const USER = { name: "Maria Lopez", email: "maria@osteria.co", initials: "ML", company: "Osteria Rossa Group" };

export type Folder = { id: string; name: string };
export const FOLDERS: Folder[] = [
  { id: "osteria", name: "Osteria Rossa" },
  { id: "harbour", name: "Harbour Hotel" },
  { id: "spring", name: "Spring campaign" },
  { id: "events", name: "Events" },
  { id: "archive", name: "Archive" },
];

export type QrCode = {
  id: string;
  name: string;
  folder: string;
  destination: string;
  shortUrl: string;
  status: "active" | "paused";
  scans30: number;
  delta: number; // % vs previous 30 days
  spark: number[]; // last 14 days
  updated: string;
  created: string;
  smart?: { ios: string; android: string };
  design: QrDesign;
};

const D = (fg: string, dots: QrDesign["dots"] = "rounded", corners: QrDesign["corners"] = "extra-rounded", bg = "#FFFFFF"): QrDesign => ({ fg, bg, dots, corners });

function spark(seed: number, base: number, trend = 0) {
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: 14 }, (_, i) => Math.max(0, Math.round(base * (0.7 + r() * 0.6) * (1 + (trend * i) / 14))));
}

export const CODES: QrCode[] = [
  { id: "k3xb9", name: "Table tent · dinner menu", folder: "osteria", destination: "https://osteria.co/menu/winter", shortUrl: "stayqr.com/r/k3xb9", status: "active", scans30: 12408, delta: 18, spark: spark(3, 410, 0.3), updated: "2 hours ago", created: "12 Mar 2026", design: D("#0B0D12") },
  { id: "p7mw2", name: "Receipt · leave a review", folder: "osteria", destination: "https://g.page/r/osteria-rossa/review", shortUrl: "stayqr.com/r/p7mw2", status: "active", scans30: 3121, delta: 6, spark: spark(7, 104), updated: "3 days ago", created: "12 Mar 2026", design: D("#9F1239", "dots", "dot") },
  { id: "t4qa8", name: "Window · order online", folder: "osteria", destination: "https://order.osteria.co", shortUrl: "stayqr.com/r/t4qa8", status: "active", scans30: 2287, delta: -4, spark: spark(11, 76, -0.1), updated: "1 week ago", created: "2 Apr 2026", design: D("#0B0D12", "square", "square") },
  { id: "w9re1", name: "Brunch menu (Sundays)", folder: "osteria", destination: "https://osteria.co/menu/brunch", shortUrl: "stayqr.com/r/w9re1", status: "paused", scans30: 640, delta: -31, spark: spark(13, 40, -0.6), updated: "yesterday", created: "20 Apr 2026", design: D("#7C2D12") },
  { id: "h2rm5", name: "Room cards · guest info", folder: "harbour", destination: "https://stay.harbourhotel.com/room-info", shortUrl: "stayqr.com/r/h2rm5", status: "active", scans30: 9874, delta: 24, spark: spark(17, 330, 0.25), updated: "5 hours ago", created: "8 May 2026", smart: { ios: "https://apps.apple.com/app/harbour-hotel", android: "https://play.google.com/store/apps/details?id=com.harbourhotel" }, design: D("#1E3A8A", "classy", "extra-rounded") },
  { id: "h8sp3", name: "Spa booking", folder: "harbour", destination: "https://stay.harbourhotel.com/spa", shortUrl: "stayqr.com/r/h8sp3", status: "active", scans30: 1932, delta: 41, spark: spark(19, 64, 0.5), updated: "4 days ago", created: "8 May 2026", design: D("#1E3A8A") },
  { id: "h5wf0", name: "Wi-Fi · lobby", folder: "harbour", destination: "WIFI:T:WPA;S:Harbour Guest;P:••••••••;;", shortUrl: "static", status: "active", scans30: 4410, delta: 2, spark: spark(23, 147), updated: "2 weeks ago", created: "9 May 2026", design: D("#0B0D12", "extra-rounded", "dot") },
  { id: "s1fl6", name: "Flyer · spring tasting", folder: "spring", destination: "https://osteria.co/events/spring-tasting", shortUrl: "stayqr.com/r/s1fl6", status: "active", scans30: 3510, delta: 112, spark: spark(29, 117, 0.9), updated: "6 days ago", created: "1 Sep 2026", design: D("#065F46", "dots", "dot", "#ECFCCB") },
  { id: "s6po4", name: "Poster · bus shelter", folder: "spring", destination: "https://osteria.co/events/spring-tasting?src=poster", shortUrl: "stayqr.com/r/s6po4", status: "active", scans30: 2044, delta: 87, spark: spark(31, 68, 0.8), updated: "6 days ago", created: "1 Sep 2026", design: D("#065F46") },
  { id: "s9ig7", name: "Instagram story sticker", folder: "spring", destination: "https://osteria.co/events/spring-tasting?src=ig", shortUrl: "stayqr.com/r/s9ig7", status: "active", scans30: 1186, delta: 15, spark: spark(37, 40), updated: "1 week ago", created: "3 Sep 2026", design: D("#5B21B6", "rounded", "dot") },
  { id: "e3bd2", name: "Food fair badge", folder: "events", destination: "https://osteria.co/fair-2026", shortUrl: "stayqr.com/r/e3bd2", status: "active", scans30: 2730, delta: 9, spark: spark(41, 91), updated: "3 weeks ago", created: "14 Jun 2026", design: D("#0B0D12", "classy", "square") },
  { id: "e7wk9", name: "Wine evening RSVP", folder: "events", destination: "https://lu.ma/osteria-wine", shortUrl: "stayqr.com/r/e7wk9", status: "paused", scans30: 312, delta: -58, spark: spark(43, 21, -0.8), updated: "4 days ago", created: "2 Oct 2026", design: D("#9F1239") },
  { id: "a2sm1", name: "Summer menu 2025", folder: "archive", destination: "https://osteria.co/menu/summer-2025", shortUrl: "stayqr.com/r/a2sm1", status: "active", scans30: 214, delta: -12, spark: spark(47, 7), updated: "3 months ago", created: "2 May 2025", design: D("#0B0D12", "square", "square") },
  { id: "a6ch8", name: "Christmas set menu 2025", folder: "archive", destination: "https://osteria.co/menu/christmas", shortUrl: "stayqr.com/r/a6ch8", status: "active", scans30: 98, delta: -3, spark: spark(53, 3), updated: "10 months ago", created: "20 Nov 2025", design: D("#9F1239", "dots", "dot") },
];

export const codeById = (id: string) => CODES.find((c) => c.id === id);
export const folderName = (id: string) => FOLDERS.find((f) => f.id === id)?.name ?? "No folder";

// ── Analytics ─────────────────────────────────────────────────────────
export type Range = 7 | 30 | 90;

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

/**
 * Daily scans ending 25 Oct 2026, with a weekend lift (restaurants!) and a gentle upward trend.
 * Scaled so the last 30 days add up to the codes' own 30-day totals, so every page agrees.
 */
export function scanSeries(days: Range, codeId = "all") {
  const r = seeded(days * 31 + codeId.length * 7 + 5);
  const monthly = codeId === "all" ? CODES.reduce((s, c) => s + c.scans30, 0) : (codeById(codeId)?.scans30 ?? 1000);
  const end = Date.UTC(2026, 9, 25);
  const out: { date: string; label: string; current: number; previous: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const t = end - i * 86400000;
    const d = new Date(t);
    const dow = d.getUTCDay();
    const weekend = dow === 5 || dow === 6 ? 1.45 : dow === 0 ? 1.25 : 1;
    const trend = 1 + ((days - i) / days) * 0.22;
    const cur = 1380 * weekend * trend * (0.86 + r() * 0.28);
    const prev = 1180 * weekend * (0.86 + r() * 0.28);
    out.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }),
      current: Math.round(cur),
      previous: Math.round(prev),
    });
  }
  // scale so the most recent 30 days (or the whole range, pro rata) match the codes' 30-day totals
  const window = Math.min(days, 30);
  const recent = out.slice(-window).reduce((s, d) => s + d.current, 0);
  const k = (monthly * (window / 30)) / Math.max(1, recent);
  for (const d of out) {
    d.current = Math.round(d.current * k);
    d.previous = Math.round(d.previous * k);
  }
  return out;
}

export const DEVICES = [
  { name: "iPhone", share: 0.57 },
  { name: "Android", share: 0.38 },
  { name: "Other", share: 0.05 },
];

export const CITIES = [
  { name: "London", country: "GB", share: 0.41 },
  { name: "Manchester", country: "GB", share: 0.13 },
  { name: "Brighton", country: "GB", share: 0.09 },
  { name: "Paris", country: "FR", share: 0.06 },
  { name: "New York", country: "US", share: 0.04 },
  { name: "Other", country: "", share: 0.27 },
];

/** Scans by weekday (Mon..Sun) × hour (0..23), 0–1 relative intensity: lunch and dinner peaks, busier weekends. */
export function heatmap() {
  const r = seeded(99);
  return Array.from({ length: 7 }, (_, day) =>
    Array.from({ length: 24 }, (_, h) => {
      const lunch = Math.exp(-((h - 13) ** 2) / 3);
      const dinner = Math.exp(-((h - 20) ** 2) / 4) * 1.25;
      const breakfast = day >= 5 ? Math.exp(-((h - 11) ** 2) / 3) * 0.7 : 0.1 * Math.exp(-((h - 8) ** 2) / 2);
      const night = h < 6 ? 0.02 : 0;
      const weekend = day >= 4 ? 1.3 : 1;
      return Math.min(1, (lunch * 0.7 + dinner + breakfast + night) * weekend * (0.85 + r() * 0.3) * 0.72);
    }),
  );
}

export const INVOICES = [
  { id: "INV-2026-0314", date: "14 Mar 2026", description: "StayQR Pro · yearly", amount: "$29.00", status: "Paid" },
  { id: "INV-2026-0214", date: "14 Feb 2026", description: "StayQR Pro · monthly", amount: "$3.99", status: "Paid" },
  { id: "INV-2026-0114", date: "14 Jan 2026", description: "StayQR Pro · monthly", amount: "$3.99", status: "Paid" },
  { id: "INV-2025-1214", date: "14 Dec 2025", description: "StayQR Pro · monthly", amount: "$3.99", status: "Paid" },
  { id: "INV-2025-1114", date: "14 Nov 2025", description: "StayQR Pro · monthly", amount: "$3.99", status: "Paid" },
];
