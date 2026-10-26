import "server-only";
import type { DashCode, Folder } from "@/lib/dashboard-types";
import { CORNER_STYLES, DEFAULT_DESIGN, DOT_STYLES, ECL_LEVELS, FRAME_STYLES, type QrDesign } from "@/lib/qr-design";
import { newSlug } from "@/lib/slug";
import { db } from "./db";
import { env, shortHost } from "./env";

type CodeRow = {
  id: string;
  slug: string;
  name: string;
  destination: string;
  ios_url: string | null;
  android_url: string | null;
  folder_id: string | null;
  folder_name: string | null;
  design: Partial<QrDesign>;
  paused: boolean;
  pause_message: string | null;
  pause_until: Date | null;
  disabled_at: Date | null;
  created_at: Date;
  updated_at: Date;
  cur: number;
  prev: number;
};

const rtf = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });
export function ago(d: Date, now = Date.now()) {
  const s = Math.round((d.getTime() - now) / 1000);
  const steps: [number, Intl.RelativeTimeFormatUnit][] = [[60, "second"], [3600, "minute"], [86400, "hour"], [604800, "day"], [2629800, "week"], [31557600, "month"], [Infinity, "year"]];
  const div = [1, 60, 3600, 86400, 604800, 2629800, 31557600];
  for (let i = 0; i < steps.length; i++) if (Math.abs(s) < steps[i][0]) return Math.abs(s) < 45 && i === 0 ? "just now" : rtf.format(Math.round(s / div[i]), steps[i][1]);
  return "";
}
export const dayLabel = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

const isoDate = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : null);

/** Fill unknown/old design fields with defaults so every renderer gets a complete design. */
export function cleanDesign(d: Partial<QrDesign> | null | undefined): QrDesign {
  const hex = (v: unknown, f: string) => (typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v) ? v : f);
  const oneOf = <T extends string>(v: unknown, list: { value: T }[], f: T) => (list.some((x) => x.value === v) ? (v as T) : f);
  const out: QrDesign = {
    dots: oneOf(d?.dots, DOT_STYLES, DEFAULT_DESIGN.dots),
    corners: oneOf(d?.corners, CORNER_STYLES, DEFAULT_DESIGN.corners),
    fg: hex(d?.fg, DEFAULT_DESIGN.fg),
    bg: hex(d?.bg, DEFAULT_DESIGN.bg),
  };
  if (typeof d?.logo === "string" && /^data:image\/(png|jpeg|webp|svg\+xml);base64,/.test(d.logo) && d.logo.length <= 300_000) {
    out.logo = d.logo;
    out.logoSize = typeof d.logoSize === "number" ? Math.min(0.35, Math.max(0.15, d.logoSize)) : 0.28;
  }
  if (d?.frame && d.frame !== "none") {
    out.frame = oneOf(d.frame, FRAME_STYLES, "none");
    out.frameLabel = typeof d.frameLabel === "string" ? d.frameLabel.slice(0, 28) : "Scan me";
  }
  if (d?.ecl) out.ecl = oneOf(d.ecl, ECL_LEVELS, "M");
  if (typeof d?.quietZone === "number") out.quietZone = Math.min(8, Math.max(2, Math.round(d.quietZone)));
  return out;
}

function toDash(r: CodeRow, spark: number[]): DashCode {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    folderId: r.folder_id,
    folderName: r.folder_name,
    destination: r.destination,
    shortUrl: `${shortHost()}/r/${r.slug}`,
    iosUrl: r.ios_url,
    androidUrl: r.android_url,
    paused: r.paused,
    pauseMessage: r.pause_message,
    pauseUntil: isoDate(r.pause_until),
    disabled: !!r.disabled_at,
    scans30: Number(r.cur),
    delta: Number(r.prev) ? Math.round(((Number(r.cur) - Number(r.prev)) / Number(r.prev)) * 100) : Number(r.cur) ? 100 : 0,
    spark,
    created: dayLabel(r.created_at),
    updated: ago(r.updated_at),
    design: cleanDesign(r.design),
  };
}

/** Codes with 30-day totals, change vs the 30 days before, and a 14-day sparkline. */
export async function listCodes(userId: string, tz = "UTC", only?: string): Promise<DashCode[]> {
  const sql = db();
  const rows = await sql<CodeRow[]>`
    select c.*, f.name as folder_name, coalesce(s.cur, 0)::int as cur, coalesce(s.prev, 0)::int as prev
      from public.codes c
      left join public.folders f on f.id = c.folder_id
      left join lateral (
        select count(*) filter (where scanned_at >= now() - interval '30 days') as cur,
               count(*) filter (where scanned_at <  now() - interval '30 days') as prev
          from public.scans where code_id = c.id and scanned_at >= now() - interval '60 days'
      ) s on true
     where c.user_id = ${userId} ${only ? sql`and c.id = ${only}` : sql``}
     order by c.created_at desc`;
  if (!rows.length) return [];
  const days = await sql<{ code_id: string; ago: number; n: number }[]>`
    select code_id, (now() at time zone ${tz})::date - (scanned_at at time zone ${tz})::date as ago, count(*)::int as n
      from public.scans
     where code_id = any(${rows.map((r) => r.id)}::uuid[]) and scanned_at >= now() - interval '15 days'
     group by 1, 2`;
  const spark = new Map(rows.map((r) => [r.id, Array<number>(14).fill(0)]));
  for (const d of days) if (d.ago >= 0 && d.ago < 14) spark.get(d.code_id)![13 - d.ago] = d.n;
  return rows.map((r) => toDash(r, spark.get(r.id)!));
}

export async function getCode(userId: string, id: string, tz = "UTC") {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  return (await listCodes(userId, tz, id))[0] ?? null;
}

export async function listFolders(userId: string): Promise<Folder[]> {
  return db()<Folder[]>`
    select f.id, f.name, count(c.id)::int as count
      from public.folders f left join public.codes c on c.folder_id = f.id
     where f.user_id = ${userId} group by f.id order by f.name`;
}

// ── Writes ────────────────────────────────────────────────────────────────

export class InputError extends Error {}

/** Accepts "example.com/menu" or a full http(s) link; rejects everything else (javascript:, data:, our own short links). */
export function normaliseUrl(raw: string, label = "Link"): string {
  const v = raw.trim();
  if (!v) throw new InputError(`${label} is empty.`);
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(v) ? v : `https://${v}`;
  let u: URL;
  try {
    u = new URL(withScheme);
  } catch {
    throw new InputError(`${label} doesn't look like a web address.`);
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") throw new InputError(`${label} must start with https:// or http://.`);
  if (!u.hostname.includes(".") && u.hostname !== "localhost") throw new InputError(`${label} needs a full domain, like example.com.`);
  if (u.host === shortHost() && u.pathname.startsWith("/r/")) throw new InputError("A code can't point at another StayQR short link.");
  if (withScheme.length > 2048) throw new InputError(`${label} is longer than 2,048 characters.`);
  return u.toString();
}

/** Optional Google Safe Browsing check (set GOOGLE_SAFE_BROWSING_KEY). Fails open if Google can't be reached. */
async function assertSafe(urls: string[]) {
  if (!env.safeBrowsingKey) return;
  try {
    const res = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${env.safeBrowsingKey}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        client: { clientId: "stayqr", clientVersion: "1.0" },
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: urls.map((url) => ({ url })),
        },
      }),
      signal: AbortSignal.timeout(2500),
    });
    const body = (await res.json()) as { matches?: unknown[] };
    if (body.matches?.length) throw new InputError("Google Safe Browsing flags this link as unsafe, so it can't be used.");
  } catch (e) {
    if (e instanceof InputError) throw e;
  }
}

export type CodeInput = {
  name: string;
  destination: string;
  iosUrl?: string;
  androidUrl?: string;
  folderId?: string | null;
  paused?: boolean;
  pauseMessage?: string;
  pauseUntil?: string;
  design?: Partial<QrDesign>;
};

async function clean(userId: string, input: CodeInput) {
  const destination = normaliseUrl(input.destination, "Destination");
  const ios = input.iosUrl?.trim() ? normaliseUrl(input.iosUrl, "iPhone link") : null;
  const android = input.androidUrl?.trim() ? normaliseUrl(input.androidUrl, "Android link") : null;
  await assertSafe([destination, ios, android].filter((u): u is string => !!u));
  let folderId: string | null = null;
  if (input.folderId) {
    const [f] = await db()`select id from public.folders where id = ${input.folderId} and user_id = ${userId}`;
    folderId = f ? input.folderId : null;
  }
  const until = input.pauseUntil && /^\d{4}-\d{2}-\d{2}$/.test(input.pauseUntil) ? input.pauseUntil : null;
  return {
    name: (input.name ?? "").trim().slice(0, 120),
    destination,
    ios_url: ios,
    android_url: android,
    folder_id: folderId,
    paused: !!input.paused,
    pause_message: input.paused ? (input.pauseMessage ?? "").trim().slice(0, 160) || null : null,
    pause_until: input.paused ? until : null,
    design: cleanDesign(input.design),
  };
}

export async function createCode(userId: string, input: CodeInput) {
  const v = await clean(userId, input);
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const [row] = await db()<{ id: string }[]>`
        insert into public.codes (user_id, slug, name, destination, ios_url, android_url, folder_id, design, paused, pause_message, pause_until)
        values (${userId}, ${newSlug()}, ${v.name}, ${v.destination}, ${v.ios_url}, ${v.android_url}, ${v.folder_id}, ${db().json(v.design)}, ${v.paused}, ${v.pause_message}, ${v.pause_until})
        returning id`;
      return row.id;
    } catch (e) {
      if ((e as { code?: string }).code !== "23505") throw e; // slug collision: try another
    }
  }
  throw new Error("Couldn't allocate a short link. Please try again.");
}

export async function updateCode(userId: string, id: string, input: CodeInput) {
  const v = await clean(userId, input);
  const res = await db()`
    update public.codes set name = ${v.name}, destination = ${v.destination}, ios_url = ${v.ios_url}, android_url = ${v.android_url},
           folder_id = ${v.folder_id}, design = ${db().json(v.design)}, paused = ${v.paused}, pause_message = ${v.pause_message},
           pause_until = ${v.pause_until}, updated_at = now()
     where id = ${id} and user_id = ${userId}`;
  if (!res.count) throw new InputError("That code doesn't exist any more.");
}

export async function deleteCode(userId: string, id: string) {
  await db()`delete from public.codes where id = ${id} and user_id = ${userId}`;
}

export async function createFolder(userId: string, name: string) {
  const n = name.trim().slice(0, 60);
  if (!n) throw new InputError("Give the folder a name.");
  const [f] = await db()<{ id: string }[]>`
    insert into public.folders (user_id, name) values (${userId}, ${n})
    on conflict (user_id, name) do update set name = excluded.name returning id`;
  return f.id;
}

export async function renameFolder(userId: string, id: string, name: string) {
  const n = name.trim().slice(0, 60);
  if (!n) throw new InputError("Give the folder a name.");
  try {
    await db()`update public.folders set name = ${n} where id = ${id} and user_id = ${userId}`;
  } catch (e) {
    if ((e as { code?: string }).code === "23505") throw new InputError("You already have a folder with that name.");
    throw e;
  }
}

export async function deleteFolder(userId: string, id: string) {
  await db()`delete from public.folders where id = ${id} and user_id = ${userId}`; // codes move to "No folder"
}

export const BULK_LIMIT = 500;

/** Bulk create from parsed CSV rows. Validates everything first, then inserts in one transaction. */
export async function bulkCreate(userId: string, rows: { name: string; destination: string; folder?: string }[]) {
  if (!rows.length) throw new InputError("The file has no rows.");
  if (rows.length > BULK_LIMIT) throw new InputError(`Up to ${BULK_LIMIT} rows at a time; this file has ${rows.length}.`);
  const problems: string[] = [];
  const clean = rows.map((r, i) => {
    try {
      return { name: (r.name ?? "").trim().slice(0, 120), destination: normaliseUrl(r.destination ?? "", "Destination"), folder: (r.folder ?? "").trim().slice(0, 60) };
    } catch (e) {
      problems.push(`Row ${i + 2}: ${(e as Error).message}`);
      return null;
    }
  });
  if (problems.length) throw new InputError(problems.slice(0, 5).join(" ") + (problems.length > 5 ? ` …and ${problems.length - 5} more.` : ""));
  await assertSafe([...new Set(clean.map((r) => r!.destination))].slice(0, 500));
  return db().begin(async (tx) => {
    const folders = new Map<string, string>();
    for (const name of new Set(clean.map((r) => r!.folder).filter(Boolean))) {
      const [f] = await tx<{ id: string }[]>`
        insert into public.folders (user_id, name) values (${userId}, ${name})
        on conflict (user_id, name) do update set name = excluded.name returning id`;
      folders.set(name, f.id);
    }
    const created: { slug: string; name: string; shortUrl: string }[] = [];
    for (const r of clean) {
      const [row] = await tx<{ slug: string }[]>`
        insert into public.codes (user_id, slug, name, destination, folder_id, design)
        values (${userId}, ${newSlug(7)}, ${r!.name}, ${r!.destination}, ${folders.get(r!.folder) ?? null}, ${tx.json(DEFAULT_DESIGN)})
        returning slug`;
      created.push({ slug: row.slug, name: r!.name, shortUrl: `https://${shortHost()}/r/${row.slug}` });
    }
    return created;
  });
}
