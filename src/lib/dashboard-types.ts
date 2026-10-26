/** Shapes shared by the dashboard's server loaders and client components. */
import type { QrDesign } from "@/lib/qr-design";

export type Folder = { id: string; name: string; count: number };

export type DashCode = {
  id: string;
  slug: string;
  name: string;
  folderId: string | null;
  folderName: string | null;
  destination: string;
  shortUrl: string; // "stayqr.com/r/k3xb9"
  iosUrl: string | null;
  androidUrl: string | null;
  paused: boolean;
  pauseMessage: string | null;
  pauseUntil: string | null; // yyyy-mm-dd
  disabled: boolean;
  scans30: number;
  delta: number; // % vs previous 30 days
  spark: number[]; // last 14 days
  created: string; // "12 Mar 2026"
  updated: string; // "2 hours ago"
  design: QrDesign;
};

export type Plan = {
  tier: "free" | "pro" | "lifetime";
  plan: "pro-monthly" | "pro-yearly" | "lifetime" | null;
  status: string | null; // Lemon Squeezy status for subscriptions
  renewsAt: string | null;
  endsAt: string | null;
  /** May create and edit dynamic codes. */
  canEdit: boolean;
  /** Had a plan that has ended: codes keep working, editing is paused. */
  lapsed: boolean;
};

export type Range = 7 | 30 | 90;

export type Analytics = {
  range: Range;
  code: string; // "all" or a code id
  series: { date: string; label: string; current: number; previous: number }[];
  total: number;
  previousTotal: number;
  codesScanned: number;
  devices: { label: string; value: number }[];
  cities: { label: string; sub?: string; value: number }[];
  heatmap: number[][]; // [Mon..Sun][0..23], 0–1
  top: { id: string; name: string; shortUrl: string; design: QrDesign; scans: number }[];
  /** Plan ended: numbers stop at this date. */
  until: string | null;
};
