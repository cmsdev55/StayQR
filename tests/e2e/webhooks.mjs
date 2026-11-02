// Lemon Squeezy webhooks against a local production build. Start one first:
//   NEXT_DIST_DIR=.next-prod npx next build
//   NEXT_DIST_DIR=.next-prod DATABASE_URL=postgres://localhost:54329/endureqr ALLOW_SIMULATED_BILLING=1 \
//   NEXT_PUBLIC_SITE_URL=http://localhost:3200 LEMONSQUEEZY_WEBHOOK_SECRET=whsec_test \
//   LEMONSQUEEZY_VARIANT_PRO_MONTHLY=101 LEMONSQUEEZY_VARIANT_PRO_YEARLY=102 LEMONSQUEEZY_VARIANT_LIFETIME=103 \
//   CRON_SECRET=cron_test npx next start -p 3200
import { createHmac, randomUUID } from "node:crypto";
import { createRequire } from "node:module";
const postgres = createRequire(process.cwd() + "/package.json")("postgres");
const sql = postgres(process.env.DATABASE_URL ?? "postgres://localhost:54329/endureqr", { onnotice: () => {} });
const BASE = process.env.BASE ?? "http://localhost:3200";
const ok = (c, m) => { console.log(c ? "• ok  " + m : "✗ FAIL: " + m); if (!c) process.exitCode = 1; };
const uid = randomUUID();
// fresh ids per run, so the suite can be repeated against the same database
const n = Date.now() % 1e9, SUB = String(n), ORDER = String(n + 1), INV = String(n + 2), BAD = String(n + 3);
await sql`insert into public.profiles (id, email) values (${uid}, ${`wh+${uid.slice(0, 6)}@example.com`})`;
const plan = async () => (await sql`select tier, plan, status from public.plan_of(${uid})`)[0] ?? { tier: "free" };
const post = async (body, sig) => {
  const raw = JSON.stringify(body);
  const s = sig ?? createHmac("sha256", "whsec_test").update(raw).digest("hex");
  const r = await fetch(`${BASE}/api/webhooks/lemonsqueezy`, { method: "POST", body: raw, headers: { "content-type": "application/json", "x-signature": s } });
  return { status: r.status, body: await r.text() };
};
const future = new Date(Date.now() + 365 * 864e5).toISOString();
const sub = (event, attrs, custom = true) => ({
  meta: { event_name: event, ...(custom ? { custom_data: { user_id: uid } } : {}) },
  data: { type: "subscriptions", id: SUB, attributes: { customer_id: 77, variant_id: 102, status: "active", renews_at: future, ends_at: null, card_brand: "visa", card_last_four: "4242", urls: { customer_portal: "https://x/billing", update_payment_method: "https://x/upd" }, ...attrs } },
});
ok((await post(sub("subscription_created", {}), "deadbeef")).status === 401, "forged signature rejected");
let r = await post(sub("subscription_created", {}));
ok(r.status === 200 && (await plan()).tier === "pro", "subscription_created → pro");
ok((await post(sub("subscription_created", {}))).body.includes('"duplicate":true'), "exact replay acknowledged without reprocessing");
r = await post({ meta: { event_name: "subscription_payment_success" }, data: { type: "subscription-invoices", id: INV, attributes: { subscription_id: Number(SUB), customer_id: 77, status: "paid", total: 2900, currency: "USD", urls: { invoice_url: "https://x/inv" }, created_at: new Date().toISOString() } } });
const [inv] = await sql`select description, total_cents from public.invoices where user_id = ${uid}`;
ok(r.status === 200 && inv?.total_cents === 2900, "payment_success without custom data → invoice linked by subscription");
await post(sub("subscription_updated", { status: "cancelled", ends_at: future }, false));
let p = await plan();
ok(p.tier === "pro" && p.status === "cancelled", "cancelled but paid-up → still pro until ends_at");
await post(sub("subscription_expired", { status: "expired", ends_at: new Date(Date.now() - 1000).toISOString() }));
ok((await plan()).tier === "free", "expired → free (the redirect never checks the plan)");
await post(sub("subscription_resumed", { status: "active", ends_at: null, renews_at: future }));
ok((await plan()).tier === "pro", "resumed → pro");
const order = (event, extra = {}) => ({ meta: { event_name: event, custom_data: { user_id: uid } }, data: { type: "orders", id: ORDER, attributes: { status: "paid", total: 6500, currency: "USD", first_order_item: { variant_id: 103 }, urls: { receipt: "https://x/r" }, created_at: new Date().toISOString(), ...extra } } });
r = await post(order("order_created"));
const [s] = await sql`select status from public.subscriptions where id = ${SUB}`;
ok(r.status === 200 && (await plan()).tier === "lifetime", "lifetime order → lifetime");
ok(s.status === "cancelled", "lifetime purchase stops Pro renewals");
await post(order("order_refunded", { status: "refunded", refunded: true }));
ok((await plan()).tier !== "lifetime", "refunded lifetime → lifetime removed");
r = await post({ meta: { event_name: "subscription_created", custom_data: { user_id: uid } }, data: { type: "subscriptions", id: BAD, attributes: { customer_id: 1, variant_id: 999, status: "active" } } });
ok(r.status === 500, "unknown variant → 500 so Lemon Squeezy retries");
const cron = await fetch(`${BASE}/api/cron/retention`, { headers: { authorization: "Bearer cron_test" } });
ok(cron.status === 200 && (await fetch(`${BASE}/api/cron/retention`)).status === 401, "retention cron runs only with the secret");
await sql.end();
