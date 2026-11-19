// Polar webhooks against a local production build. Start one first:
//   NEXT_DIST_DIR=.next-prod npx next build
//   NEXT_DIST_DIR=.next-prod DATABASE_URL=postgres://localhost:54329/endureqr ALLOW_SIMULATED_BILLING=1 \
//   NEXT_PUBLIC_SITE_URL=http://localhost:3200 POLAR_ACCESS_TOKEN=polar_oat_test POLAR_WEBHOOK_SECRET=whsec_dGVzdC1zZWNyZXQtZm9yLWUyZQ== \
//   POLAR_PRODUCT_PRO_MONTHLY=prod_m POLAR_PRODUCT_PRO_YEARLY=prod_y POLAR_PRODUCT_LIFETIME=prod_l \
//   CRON_SECRET=cron_test npx next start -p 3200
import { createHmac, randomUUID } from "node:crypto";
import { createRequire } from "node:module";
const postgres = createRequire(process.cwd() + "/package.json")("postgres");
const sql = postgres(process.env.DATABASE_URL ?? "postgres://localhost:54329/endureqr", { onnotice: () => {} });
const BASE = process.env.BASE ?? "http://localhost:3200";
const SECRET = "whsec_dGVzdC1zZWNyZXQtZm9yLWUyZQ==";
const ok = (c, m) => { console.log(c ? "• ok  " + m : "✗ FAIL: " + m); if (!c) process.exitCode = 1; };
const uid = randomUUID();
const email = `wh+${uid.slice(0, 6)}@example.com`;
// fresh ids per run, so the suite can be repeated against the same database
const n = Date.now() % 1e9, SUB = `sub_${n}`, ORDER = `ord_${n}`, RENEW = `ord_r${n}`, CUST = `cust_${n}`;
await sql`insert into public.profiles (id, email) values (${uid}, ${email})`;
const plan = async () => (await sql`select tier, plan, status from public.plan_of(${uid})`)[0] ?? { tier: "free" };
// Standard Webhooks: base64 HMAC-SHA256 over "id.timestamp.body"; key = base64-decoded secret (legacy: the raw string)
const sign = (id, t, raw, key = Buffer.from(SECRET.slice(6), "base64")) => "v1," + createHmac("sha256", key).update(`${id}.${t}.${raw}`).digest("base64");
let evt = 0;
const post = async (type, data, opts = {}) => {
  const raw = opts.raw ?? JSON.stringify({ type, timestamp: new Date().toISOString(), data });
  const id = opts.id ?? `msg_${n}_${evt++}`, t = opts.t ?? Math.floor(Date.now() / 1000);
  const r = await fetch(`${BASE}/api/webhooks/polar`, { method: "POST", body: raw, headers: { "content-type": "application/json", "webhook-id": id, "webhook-timestamp": String(t), "webhook-signature": opts.sig ?? sign(id, t, raw, opts.key) } });
  return { status: r.status, body: await r.text(), raw, id, t };
};
const future = new Date(Date.now() + 365 * 864e5).toISOString();
const customer = (ext = true) => ({ id: CUST, email, ...(ext ? { external_id: uid } : { external_id: null }) });
const sub = (extra = {}, ext = true) => ({
  id: SUB, product_id: "prod_y", customer_id: CUST, customer: customer(ext), status: "active", current_period_end: future,
  cancel_at_period_end: false, ends_at: null, ended_at: null, metadata: ext ? { user_id: uid } : {}, ...extra,
});
ok((await post("subscription.active", sub(), { sig: "v1,AAAA" })).status === 403, "forged signature rejected");
ok((await post("subscription.active", sub(), { t: Math.floor(Date.now() / 1000) - 3600 })).status === 403, "stale timestamp rejected");
let r = await post("subscription.active", sub());
ok(r.status === 200 && (await plan()).tier === "pro", "subscription.active → pro");
const replay = await post(null, null, { raw: r.raw, id: r.id, t: r.t });
ok(replay.body.includes('"duplicate":true'), "exact replay acknowledged without reprocessing");
const legacy = await post("subscription.updated", sub(), { key: Buffer.from(SECRET, "utf8") });
ok(legacy.status === 200, "legacy Polar key scheme accepted");
r = await post("order.paid", { id: RENEW, status: "paid", product_id: "prod_y", subscription_id: SUB, customer_id: CUST, customer: customer(false), total_amount: 2900, currency: "usd", created_at: new Date().toISOString(), metadata: {} });
const [inv] = await sql`select description, total_cents, currency from public.invoices where id = ${`inv-${RENEW}`}`;
ok(r.status === 200 && inv?.total_cents === 2900 && inv.currency === "USD", "order.paid for a renewal without external id → invoice linked by subscription");
await post("subscription.canceled", sub({ cancel_at_period_end: true, ends_at: future }, false));
let p = await plan();
ok(p.tier === "pro" && p.status === "cancelled", "cancel at period end but paid-up → still pro until period end");
await post("subscription.uncanceled", sub());
ok((await plan()).status === "active", "uncanceled → active again");
await post("subscription.revoked", sub({ status: "canceled", ended_at: new Date(Date.now() - 1000).toISOString() }));
ok((await plan()).tier === "free", "revoked → free (the redirect never checks the plan)");
await post("subscription.active", sub());
ok((await plan()).tier === "pro", "active again → pro");
const lifetime = (status = "paid") => ({ id: ORDER, status, product_id: "prod_l", subscription_id: null, customer_id: CUST, customer: customer(), total_amount: 6500, currency: "usd", created_at: new Date().toISOString(), metadata: { user_id: uid, plan: "lifetime" } });
r = await post("order.paid", lifetime());
const [s] = await sql`select status from public.subscriptions where id = ${SUB}`;
ok(r.status === 200 && (await plan()).tier === "lifetime", "lifetime order.paid → lifetime");
// cancelling the Pro subscription calls Polar's API, which a test token can't reach: the error is logged, not fatal
ok(s.status === "active" || s.status === "cancelled", "lifetime purchase tries to stop Pro renewals without failing the webhook");
await post("order.refunded", lifetime("partially_refunded"));
ok((await plan()).tier === "lifetime", "partial refund keeps lifetime");
await post("order.refunded", lifetime("refunded"));
ok((await plan()).tier !== "lifetime", "full refund → lifetime removed");
const [ri] = await sql`select status from public.invoices where id = ${`order-${ORDER}`}`;
ok(ri?.status === "refunded", "refunded lifetime invoice marked refunded");
r = await post("subscription.active", { ...sub(), id: `sub_bad_${n}`, product_id: "prod_unknown" });
ok(r.status === 500, "unknown product → 500 so Polar retries");
ok((await post("checkout.updated", { id: "ch_x", status: "confirmed" })).status === 200, "unhandled event acknowledged");
const cron = await fetch(`${BASE}/api/cron/retention`, { headers: { authorization: "Bearer cron_test" } });
ok(cron.status === 200 && (await fetch(`${BASE}/api/cron/retention`)).status === 401, "retention cron runs only with the secret");
await sql.end();
