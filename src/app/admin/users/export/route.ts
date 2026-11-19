import { accountPlan, accountStatus, isAdmin, listUsers, logAdmin, PLAN_LABEL, readUserFilters, STATUS_LABEL } from "@/lib/server/admin";
import { getUser } from "@/lib/server/auth";

/** The filtered users table as CSV (all pages). Formula-looking cells are quoted with a leading ' so spreadsheets don't run them. */
export async function GET(req: Request) {
  const admin = await getUser();
  if (!isAdmin(admin)) return new Response("Not found", { status: 404 });
  const f = readUserFilters(Object.fromEntries(new URL(req.url).searchParams));
  const { rows } = await listUsers(f, null);
  const cell = (v: unknown) => {
    let s = v instanceof Date ? v.toISOString() : v == null ? "" : String(v);
    if (/^[=+\-@]/.test(s)) s = `'${s}`;
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const head = ["id", "email", "name", "plan", "status", "renews_at", "ends_at", "codes", "email_confirmed", "joined", "last_active"];
  const lines = rows.map((u) =>
    [u.id, u.email, u.name, PLAN_LABEL[accountPlan(u)], STATUS_LABEL[accountStatus(u)], u.renews_at, u.ends_at, u.codes, u.verified ? "yes" : "no", u.created_at, u.last_seen].map(cell).join(","),
  );
  await logAdmin(admin!, "users.export", {}, { rows: rows.length, filters: f });
  return new Response([head.join(","), ...lines].join("\n") + "\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="endureqr-users-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
