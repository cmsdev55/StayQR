// Creem webhooks against a local production build. Start one first:
//   NEXT_DIST_DIR=.next-prod npx next build
//   NEXT_DIST_DIR=.next-prod DATABASE_URL=postgres://localhost:54329/endureqr ALLOW_SIMULATED_BILLING=1 \
//   NEXT_PUBLIC_SITE_URL=http://localhost:3200 CREEM_WEBHOOK_SECRET=whsec_test \
//   CREEM_PRODUCT_PRO_MONTHLY=prod_m CREEM_PRODUCT_PRO_YEARLY=prod_y CREEM_PRODUCT_LIFETIME=prod_l \
//   CRON_SECRET=cron_test npx next start -p 3200
import { createHmac, randomUUID } from "node:crypto";
import { createRequire } from "node:module";
const postgres = createRequire(process.cwd() + "/package.json")("postgres");
const sql = postgres(process.env.DATABASE_URL ?? "postgres://localhost:54329/endureqr", { onnotice: () => {} });
const BASE = process.env.BASE ?? "http://localhost:3200";
const ok = (c, m) => { console.log(c ? "• ok  " + m : "✗ FAIL: " + m); if (!c) process.exitCode = 1; };
const uid = randomUUID();
// fresh ids per run, so the suite can be repeated against the same database
const n = Date.now() % 1e9, SUB = `sub_${n}`, ORDER = `ord_${n}`, TRAN = `tran_${n}`, CUST = `cust_${n}`;
await sql`insert into public.profiles (id, email) values (${uid}, ${`wh+${uid.slice(0, 6)}@example.com`})`;
const plan = async () => (await sql`select tier, plan, status from public.plan_of(${uid})`)[0] ?? { tier: "free" };
let evt = 0;
const post = async (eventType, object, sig) => {
  const raw = JSON.stringify({ id: `evt_${n}_${evt++}`, eventType, created_at: Date.now(), object });
  const s = sig ?? createHmac("sha256", "whsec_test").update(raw).digest("hex");
  const r = await fetch(`${BASE}/api/webhooks/creem`, { method: "POST", body: raw, headers: { "content-type": "application/json", "creem-signature": s } });
  return { status: r.status, body: await r.text(), raw };
};
const future = new Date(Date.now() + 365 * 864e5).toISOString();
const sub = (extra = {}, meta = true) => ({
  id: SUB, object: "subscription", product: { id: "prod_y" }, customer: { id: CUST, email: `wh+${uid.slice(0, 6)}@example.com` }, status: "active",
  current_period_end_date: future, next_transaction_date: future, canceled_at: null, ...(meta ? { metadata: { user_id: uid } } : {}), ...extra,
});
ok((await post("subscription.active", sub(), "deadbeef")).status === 401, "forged signature rejected");
let r = await post("subscription.active", sub());
ok(r.status === 200 && (await plan()).tier === "pro", "subscription.active → pro");
const replay = await fetch(`${BASE}/api/webhooks/creem`, { method: "POST", body: r.raw, headers: { "content-type": "application/json", "creem-signature": createHmac("sha256", "whsec_test").update(r.raw).digest("hex") } });
ok((await replay.text()).includes('"duplicate":true'), "exact replay acknowledged without reprocessing");
r = await post("subscription.paid", sub({ last_transaction: { id: TRAN, amount_paid: 2900, currency: "USD", created_at: Date.now() } }, false));
const [inv] = await sql`select description, total_cents from public.invoices where user_id = ${uid}`;
ok(r.status === 200 && inv?.total_cents === 2900, "subscription.paid without metadata → invoice linked by subscription");
await post("subscription.scheduled_cancel", sub({ status: "scheduled_cancel" }, false));
let p = await plan();
ok(p.tier === "pro" && p.status === "cancelled", "scheduled cancel but paid-up → still pro until period end");
await post("subscription.canceled", sub({ status: "canceled", canceled_at: new Date(Date.now() - 1000).toISOString() }));
ok((await plan()).tier === "free", "canceled → free (the redirect never checks the plan)");
await post("subscription.active", sub());
ok((await plan()).tier === "pro", "active again → pro");
const checkout = (status = "paid") => ({
  id: `ch_${n}`, object: "checkout", status: "completed", product: { id: "prod_l" }, customer: { id: CUST }, metadata: { user_id: uid },
  order: { id: ORDER, object: "order", product: "prod_l", amount_paid: 6500, currency: "USD", status, type: "onetime", created_at: new Date().toISOString() },
});
r = await post("checkout.completed", checkout());
const [s] = await sql`select status from public.subscriptions where id = ${SUB}`;
ok(r.status === 200 && (await plan()).tier === "lifetime", "lifetime checkout → lifetime");
ok(s.status === "cancelled", "lifetime purchase stops Pro renewals");
await post("refund.created", { id: `ref_${n}`, object: "refund", status: "succeeded", transaction: { id: `tran_l${n}`, order: ORDER, status: "refunded" } });
ok((await plan()).tier !== "lifetime", "refunded lifetime → lifetime removed");
r = await post("subscription.active", { ...sub(), id: `sub_bad_${n}`, product: { id: "prod_unknown" } });
ok(r.status === 500, "unknown product → 500 so Creem retries");
const cron = await fetch(`${BASE}/api/cron/retention`, { headers: { authorization: "Bearer cron_test" } });
ok(cron.status === 200 && (await fetch(`${BASE}/api/cron/retention`)).status === 401, "retention cron runs only with the secret");
await sql.end();
