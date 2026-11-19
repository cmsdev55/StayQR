import type { Metadata } from "next";
import Link from "next/link";
import { ACTION_LABEL, detailText, td, th, tableWrap, thead, when } from "@/components/admin/format";
import { adminLog } from "@/lib/server/admin";

export const metadata: Metadata = { title: "Activity log" };

export default async function AdminActivity() {
  const log = await adminLog(300);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] font-semibold tracking-tight">Activity log</h1>
        <p className="mt-1 text-body-sm text-fg-muted">Every change made from the admin panel, newest first (last 300).</p>
      </div>
      <div className={tableWrap}>
        <table className="w-full min-w-[760px] text-left text-body-sm">
          <thead className={thead}><tr><th className={th}>When</th><th className={th}>Action</th><th className={th}>Account</th><th className={th}>By</th></tr></thead>
          <tbody className="divide-y divide-line">
            {log.map((l) => (
              <tr key={l.id}>
                <td className={`${td} whitespace-nowrap text-fg-muted`}>{when(l.created_at)}</td>
                <td className={td}>{ACTION_LABEL[l.action] ?? l.action}{detailText(l.details) && <span className="block text-fg-subtle">{detailText(l.details)}</span>}</td>
                <td className={td}>
                  {l.target_user && l.action !== "account.delete"
                    ? <Link href={`/admin/users/${l.target_user}`} className="hover:underline">{l.target_email ?? l.target_user}</Link>
                    : <span className="text-fg-muted">{l.target_email ?? "—"}</span>}
                </td>
                <td className={`${td} text-fg-muted`}>{l.admin_email}</td>
              </tr>
            ))}
            {!log.length && <tr><td className={td} colSpan={4}>No admin actions yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
