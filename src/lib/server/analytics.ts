import "server-only";
import type { Analytics, Range } from "@/lib/dashboard-types";
import { cleanDesign } from "./codes";
import { db } from "./db";
import { shortHost } from "./env";

const OS_LABEL: Record<string, string> = { ios: "iPhone and iPad", android: "Android", windows: "Windows", macos: "Mac", linux: "Linux", other: "Other" };

/**
 * Everything the Analytics page shows, for one range and either all codes or one code, in the user's time zone.
 * `until` (a lapsed plan's end date) stops the numbers there: new analytics pause until the plan resumes.
 */
export async function getAnalytics(userId: string, opts: { range: Range; code: string; tz: string; until: string | null }): Promise<Analytics> {
  const sql = db();
  const { range, tz } = opts;
  const code = opts.code !== "all" && /^[0-9a-f-]{36}$/i.test(opts.code) ? opts.code : "all";
  const end = opts.until ? new Date(opts.until) : new Date();
  // [start, end) is the current window, [prevStart, start) the one before it, both in whole local days
  const scope = code === "all" ? sql`c.user_id = ${userId}` : sql`c.user_id = ${userId} and c.id = ${code}`;
  const win = sql`(${end}::timestamptz at time zone ${tz})::date`;

  const series = await sql<{ day: Date; cur: number; prev: number }[]>`
    with days as (select generate_series(${win} - ${range - 1}::int, ${win}, interval '1 day')::date as day),
    s as (
      select (sc.scanned_at at time zone ${tz})::date as day, count(*)::int as n
        from public.scans sc join public.codes c on c.id = sc.code_id
       where ${scope} and sc.scanned_at < ${end}::timestamptz
         and (sc.scanned_at at time zone ${tz})::date > ${win} - ${range * 2}::int
       group by 1
    )
    select d.day, coalesce(cur.n, 0) as cur, coalesce(prev.n, 0) as prev
      from days d
      left join s cur on cur.day = d.day
      left join s prev on prev.day = d.day - ${range}::int
     order by d.day`;

  const inWindow = sql`sc.scanned_at < ${end}::timestamptz and (sc.scanned_at at time zone ${tz})::date > ${win} - ${range}::int`;

  const [devices, cities, heat, top, scanned] = await Promise.all([
    sql<{ os: string; n: number }[]>`
      select sc.os, count(*)::int as n from public.scans sc join public.codes c on c.id = sc.code_id
       where ${scope} and ${inWindow} group by 1 order by 2 desc`,
    sql<{ city: string | null; country: string | null; n: number }[]>`
      select sc.city, sc.country, count(*)::int as n from public.scans sc join public.codes c on c.id = sc.code_id
       where ${scope} and ${inWindow} group by 1, 2 order by 3 desc limit 6`,
    sql<{ dow: number; hour: number; n: number }[]>`
      select extract(isodow from sc.scanned_at at time zone ${tz})::int - 1 as dow,
             extract(hour from sc.scanned_at at time zone ${tz})::int as hour, count(*)::int as n
        from public.scans sc join public.codes c on c.id = sc.code_id
       where ${scope} and ${inWindow} group by 1, 2`,
    sql<{ id: string; name: string; slug: string; design: object; n: number }[]>`
      select c.id, c.name, c.slug, c.design, count(*)::int as n from public.scans sc join public.codes c on c.id = sc.code_id
       where c.user_id = ${userId} and ${inWindow} group by c.id order by n desc limit 5`,
    sql<{ n: number }[]>`
      select count(distinct sc.code_id)::int as n from public.scans sc join public.codes c on c.id = sc.code_id
       where ${scope} and ${inWindow}`,
  ]);

  const total = series.reduce((s, d) => s + d.cur, 0);
  // devices: phones first, everything else folded into "Other"
  const byOs = new Map(devices.map((d) => [d.os, d.n]));
  const deviceList = [
    { label: OS_LABEL.ios, value: byOs.get("ios") ?? 0 },
    { label: OS_LABEL.android, value: byOs.get("android") ?? 0 },
    { label: "Computers and other", value: devices.filter((d) => d.os !== "ios" && d.os !== "android").reduce((s, d) => s + d.n, 0) },
  ];
  const cityList = cities.slice(0, 5).map((c) => ({ label: c.city || "Unknown location", sub: c.country ?? undefined, value: c.n }));
  const other = total - cityList.reduce((s, c) => s + c.value, 0);
  if (other > 0) cityList.push({ label: "Other", sub: undefined, value: other });

  const grid = Array.from({ length: 7 }, () => Array<number>(24).fill(0));
  for (const h of heat) grid[h.dow][h.hour] = h.n;
  const peak = Math.max(1, ...grid.flat());

  return {
    range,
    code,
    series: series.map((d) => ({
      date: d.day.toISOString().slice(0, 10),
      label: d.day.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }),
      current: d.cur,
      previous: d.prev,
    })),
    total,
    previousTotal: series.reduce((s, d) => s + d.prev, 0),
    codesScanned: scanned[0]?.n ?? 0,
    devices: deviceList,
    cities: cityList,
    heatmap: grid.map((row) => row.map((n) => n / peak)),
    top: top.map((t) => ({ id: t.id, name: t.name, shortUrl: `${shortHost()}/r/${t.slug}`, design: cleanDesign(t.design), scans: t.n })),
    until: opts.until,
  };
}

/** Raw scans as CSV rows (no personal data is stored, so this is safe to hand to clients). */
export async function scansCsv(userId: string, code: string, days: number) {
  const sql = db();
  const scope = code !== "all" && /^[0-9a-f-]{36}$/i.test(code) ? sql`and c.id = ${code}` : sql``;
  const rows = await sql<{ scanned_at: Date; name: string; slug: string; country: string | null; city: string | null; device: string; os: string; browser: string | null }[]>`
    select sc.scanned_at, c.name, c.slug, sc.country, sc.city, sc.device, sc.os, sc.browser
      from public.scans sc join public.codes c on c.id = sc.code_id
     where c.user_id = ${userId} ${scope} and sc.scanned_at >= now() - make_interval(days => ${days})
     order by sc.scanned_at desc limit 200000`;
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) || /^[=+\-@]/.test(s) ? `"${(/^[=+\-@]/.test(s) ? "'" : "") + s.replace(/"/g, '""')}"` : s;
  };
  const head = "scanned_at_utc,code_name,short_link,country,city,device,os,browser";
  return [head, ...rows.map((r) => [r.scanned_at.toISOString(), r.name, `${shortHost()}/r/${r.slug}`, r.country, r.city, r.device, r.os, r.browser].map(esc).join(","))].join("\n");
}
