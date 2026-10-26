import { getUser } from "@/lib/server/auth";
import { listCodes } from "@/lib/server/codes";

export const dynamic = "force-dynamic";

/** CSV of every code: name, folder, short link, destination, status and 30-day scans. */
export async function GET() {
  const user = await getUser();
  if (!user) return new Response("Sign in first", { status: 401 });
  const codes = await listCodes(user.id, user.timezone);
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    const guarded = /^[=+\-@]/.test(s) ? `'${s}` : s;
    return /[",\n']/.test(guarded) ? `"${guarded.replace(/"/g, '""')}"` : guarded;
  };
  const rows = codes.map((c) => [c.name, c.folderName ?? "", `https://${c.shortUrl}`, c.destination, c.iosUrl ?? "", c.androidUrl ?? "", c.paused ? "paused" : "active", c.scans30, c.created].map(esc).join(","));
  const csv = ["name,folder,short_link,destination,ios_link,android_link,status,scans_30_days,created", ...rows].join("\n");
  return new Response(csv, {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="stayqr-codes-${new Date().toISOString().slice(0, 10)}.csv"`, "cache-control": "no-store" },
  });
}
