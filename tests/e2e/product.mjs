// Product flow on a local dev server (simulated checkout). See README.md.
import { createRequire } from "node:module";
const req = createRequire(process.cwd() + "/package.json");
const { chromium } = req("playwright");
const postgres = req("postgres");
const BASE = process.env.BASE ?? "http://localhost:3100";
const sql = postgres(process.env.DATABASE_URL ?? "postgres://localhost:54329/endureqr", { onnotice: () => {} });
const vis = (l) => l.waitFor({ state: "visible", timeout: 8000 }).then(() => true, () => false);
const ok = (c, m) => { console.log(c ? "• ok  " + m : "✗ FAIL: " + m); if (!c) process.exitCode = 1; };

const email = `e2e+${Date.now()}@example.com`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

/** Sign up, confirm the address directly in the database (auth.mjs covers the emailed link), then log in. */
const join = async (p, addr, query = "") => {
  await p.goto(`${BASE}/signup${query}`);
  await p.fill('input[name="name"]', "Test Owner");
  await p.fill('input[name="email"]', addr);
  await p.fill('input[name="password"]', "correct horse");
  await Promise.all([p.waitForURL(/auth\/check-email/, { timeout: 60000 }), p.click('button[type="submit"]')]);
  await sql`update public.profiles set email_verified_at = now() where email = ${addr}`;
  await p.goto(`${BASE}/login${query}`);
  await p.fill('input[name="email"]', addr);
  await p.fill('input[name="password"]', "correct horse");
  await p.click('button[type="submit"]');
};

await join(page, email, "?plan=pro-yearly");
await page.waitForURL(/dashboard\/billing/, { timeout: 60000 });
ok(await vis(page.getByRole("heading", { name: "Pro · yearly" })), "signup + checkout → Pro yearly active");

await page.goto(`${BASE}/dashboard`);
ok(await vis(page.getByText("Make your first dynamic code")), "empty state for a new account");
await page.goto(`${BASE}/dashboard/codes/new`);
await page.getByLabel("Link").fill("example.com/menu");
await page.getByLabel("Name").fill("Table tent");
await Promise.all([page.waitForURL(/codes\/[0-9a-f-]{36}/, { timeout: 60000 }), page.getByRole("button", { name: "Create code" }).click()]);
const codeId = page.url().match(/codes\/([0-9a-f-]{36})/)[1];
const [code] = await sql`select slug, destination from public.codes where id = ${codeId}`;
ok(code?.destination === "https://example.com/menu", `code saved with normalised destination (${code?.destination})`);

await page.getByLabel("Link").fill("javascript:alert(1)");
await page.getByRole("button", { name: "Save changes" }).click();
ok(await vis(page.getByText(/must start with https/)), "javascript: destination rejected");
await page.getByRole("button", { name: "Discard" }).click();

const UA = {
  iphone: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  android: "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36",
  desktop: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
  bot: "WhatsApp/2.23.20.0",
};
const hit = async (ua, extra = {}) => {
  const r = await fetch(`${BASE}/r/${code.slug}`, { redirect: "manual", headers: { "user-agent": ua, ...extra } });
  return { status: r.status, location: r.headers.get("location") };
};
await sql`update public.codes set ios_url = 'https://apps.apple.com/app/x', android_url = 'https://play.google.com/store/apps/details?id=x' where id = ${codeId}`;
const ri = await hit(UA.iphone, { "x-vercel-ip-city": "London", "x-vercel-ip-country": "GB" });
const ra = await hit(UA.android, { "x-vercel-ip-city": "S%C3%A3o%20Paulo", "x-vercel-ip-country": "BR" });
ok(ri.status === 302 && ri.location === "https://apps.apple.com/app/x", "iPhone → App Store");
ok(ra.location === "https://play.google.com/store/apps/details?id=x", "Android → Google Play");
ok((await hit(UA.desktop)).location === "https://example.com/menu", "desktop → destination");
ok((await hit(UA.bot)).location === "https://example.com/menu", "bot still redirected");
await new Promise((r) => setTimeout(r, 1500));
const scans = await sql`select city, country from public.scans where code_id = ${codeId}`;
ok(scans.length === 3, `3 scans recorded, bot ignored (got ${scans.length})`);
ok(scans.some((s) => s.city === "São Paulo" && s.country === "BR"), "city decoded from geo header");
ok((await fetch(`${BASE}/r/zzzzzz`, { redirect: "manual" })).status === 404, "unknown slug → 404 page");

await sql`update public.codes set paused = true, pause_message = 'while we print the new menu', pause_until = '2026-11-03' where id = ${codeId}`;
ok((await hit(UA.iphone)).location === `/p/${code.slug}`, "paused code → /p/ page");
await page.goto(`${BASE}/p/${code.slug}`);
ok(await vis(page.getByText("while we print the new menu")), "paused page shows owner's message");
await sql`update public.codes set paused = false where id = ${codeId}`;

await page.goto(`${BASE}/dashboard/analytics?range=7`);
const tile = await page.locator("p.text-\\[24px\\]").first().innerText();
ok(tile.trim() === "4", `analytics total = 4, the paused scan counts too (got ${tile})`);
await page.goto(`${BASE}/dashboard`);
ok(await vis(page.getByRole("link", { name: "Table tent" }).first()), "code appears in list");
const csv = await (await page.request.get(`${BASE}/api/export/scans`)).text();
ok(csv.split("\n").length === 5 && csv.startsWith("scanned_at_utc"), "scans CSV export");

await page.goto(`${BASE}/dashboard/billing`);
await page.getByRole("button", { name: "Cancel plan…" }).click();
await page.getByRole("button", { name: "Cancel at period end" }).click();
await page.waitForTimeout(2000);
await page.reload();
ok(await vis(page.getByText(/^Ends /).first()), "cancelled plan shows end date");
// a second code, so the lapsed account is over the free allowance and goes read-only
await page.goto(`${BASE}/dashboard/codes/new`);
await page.getByLabel("Link").fill("example.com/second");
await page.getByLabel("Name").fill("Second");
await Promise.all([page.waitForURL(/codes\/[0-9a-f-]{36}/, { timeout: 60000 }), page.getByRole("button", { name: "Create code" }).click()]);
const [user] = await sql`select id from public.profiles where email = ${email}`;
await sql`update public.subscriptions set ends_at = now() - interval '1 day', status = 'expired' where user_id = ${user.id}`;
ok((await hit(UA.desktop)).location === "https://example.com/menu", "after the plan ended the code still redirects");
await page.goto(`${BASE}/dashboard/codes/${codeId}`);
ok(await vis(page.getByText(/Your plan ended/)), "editor shows plan-ended notice");
ok((await page.locator("fieldset[disabled]").count()) === 1, "editor is read-only after lapse");
await page.goto(`${BASE}/dashboard/codes/new`);
await page.waitForURL(/dashboard\/billing/, { timeout: 15000 }).catch(() => {});
ok(page.url().includes("/dashboard/billing"), "new code blocked without a plan");
await page.goto(`${BASE}/api/checkout?plan=lifetime`);
await page.waitForURL(/billing/);
await page.reload();
ok(await vis(page.getByRole("heading", { name: "Lifetime" })), "lifetime purchase restores editing");
// Free account: one dynamic code with editing, no second code, no bulk
const free = await browser.newPage({ viewport: { width: 1280, height: 900 } });
free.on("pageerror", (e) => errors.push(e.message));
await join(free, `free+${Date.now()}@example.com`);
await free.waitForURL(/dashboard/, { timeout: 60000 });
ok(await vis(free.getByText("Make your free dynamic code")), "free account is offered one dynamic code");
await free.goto(`${BASE}/dashboard/codes/new`);
await free.getByLabel("Link").fill("example.com/free");
await free.getByLabel("Name").fill("Free one");
await Promise.all([free.waitForURL(/codes\/[0-9a-f-]{36}/, { timeout: 60000 }), free.getByRole("button", { name: "Create code" }).click()]);
ok((await free.locator("fieldset[disabled]").count()) === 0, "free code is editable");
await free.goto(`${BASE}/dashboard`);
ok(await vis(free.getByText("Your free dynamic code is in use")), "free allowance notice after the first code");
ok((await free.getByRole("link", { name: "New code" }).count()) === 0 && (await free.getByRole("link", { name: "Bulk create" }).count()) === 0, "no New code or Bulk create on free");
await free.goto(`${BASE}/dashboard/codes/new`);
await free.waitForURL(/dashboard\/billing/, { timeout: 15000 }).catch(() => {});
ok(free.url().includes("/dashboard/billing"), "second free code blocked");
ok(errors.length === 0, `no page errors ${errors.join(" | ")}`);
await browser.close();
await sql.end();
