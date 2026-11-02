// Auth flows on a local dev server. Emails are printed to the dev log (no RESEND_API_KEY), so links are read from
// DEV_LOG. See README.md.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const req = createRequire(process.cwd() + "/package.json");
const { chromium } = req("playwright");
const postgres = req("postgres");
const BASE = process.env.BASE ?? "http://localhost:3100";
const LOG = process.env.DEV_LOG;
if (!LOG) throw new Error("Set DEV_LOG to the dev server's log file");
const sql = postgres(process.env.DATABASE_URL ?? "postgres://localhost:54329/endureqr", { onnotice: () => {} });
const vis = (l) => l.waitFor({ state: "visible", timeout: 8000 }).then(() => true, () => false);
const ok = (c, m) => { console.log(c ? "• ok  " + m : "✗ FAIL: " + m); if (!c) process.exitCode = 1; };
const lastLink = async (kind) => {
  await new Promise((r) => setTimeout(r, 800));
  const m = [...readFileSync(LOG, "utf8").matchAll(new RegExp(`(https?://[^\\s]+/auth/${kind}\\?token=[\\w-]+)`, "g"))];
  return m.at(-1)?.[1]?.replace(/^https?:\/\/[^/]+/, BASE);
};
const email = `auth+${Date.now()}@example.com`;
const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
const submit = () => page.click('form button[type="submit"]:has-text("Create account"), form button[type="submit"]:has-text("Log in")');

await page.goto(`${BASE}/signup`);
await page.fill('input[name="email"]', email);
await page.fill('input[name="password"]', "password");
await submit();
ok(await vis(page.getByText("Pick a less common password.")), "common password rejected");
await page.fill('input[name="password"]', "first-password-1");
await Promise.all([page.waitForURL(/\/auth\/check-email/), submit()]);
ok(await vis(page.getByRole("heading", { name: "Check your inbox" })), "sign-up lands on check-your-inbox");
ok(!(await ctx.cookies()).some((c) => c.name === "endureqr_session"), "no session before the email is confirmed");

await page.goto(`${BASE}/login`);
await page.fill('input[name="email"]', email);
await page.fill('input[name="password"]', "first-password-1");
await Promise.all([page.waitForURL(/\/auth\/check-email.*reason=login/), submit()]);
ok(await vis(page.getByRole("heading", { name: "Confirm your email to log in" })), "logging in unconfirmed sends a new link instead of a session");
ok(!(await ctx.cookies()).some((c) => c.name === "endureqr_session"), "still no session");

const verify = await lastLink("verify");
ok(!!verify, "confirmation email produced a link");
await page.goto(verify);
ok(await vis(page.getByRole("heading", { name: "Email verified" })), "link shows the email-verified page");
await Promise.all([page.waitForURL(/\/login\?verified=1/), page.click('a:has-text("Log in to your account")')]);
ok((await page.inputValue('input[name="email"]')) === email && (await vis(page.getByText("Email verified. Log in to continue."))), "login is pre-filled after verifying");
await page.fill('input[name="password"]', "first-password-1");
await Promise.all([page.waitForURL(/\/dashboard/), submit()]);
await page.waitForTimeout(500);
ok(!(await page.getByText("Confirm your email").isVisible()), "verified account logs in with no confirm banner");

const cookie = (await ctx.cookies()).find((c) => c.name === "endureqr_session");
const [s] = await sql`select id from public.sessions where id = ${createHash("sha256").update(cookie.value).digest("hex")}`;
const [raw] = await sql`select count(*)::int as n from public.sessions where id = ${cookie.value}`;
ok(cookie.httpOnly && s && raw.n === 0, "session cookie is httpOnly and stored only as a hash");

const scanner = await (await browser.newContext()).newPage();
await scanner.goto(verify);
ok(await vis(scanner.getByRole("heading", { name: "Email verified" })), "a used link still shows verified (mail scanners open links first)");
await scanner.goto(`${BASE}/auth/verify?token=not-a-real-token`);
ok(await vis(scanner.getByRole("heading", { name: "This link has expired" })), "unknown link offers a new one");

const p2 = await (await browser.newContext()).newPage();
await p2.goto(`${BASE}/signup`);
await p2.fill('input[name="email"]', email.toUpperCase());
await p2.fill('input[name="password"]', "another-password-1");
await p2.click('button:has-text("Create account")');
ok(await vis(p2.getByText(/already an account/)), "duplicate email (any case) rejected");

await page.goto(`${BASE}/dashboard/settings`);
await Promise.all([page.waitForURL(`${BASE}/`), page.click('button[aria-label="Log out"]')]);
ok((await sql`select count(*)::int as n from public.sessions s join public.profiles p on p.id = s.user_id where p.email = ${email}`)[0].n === 0, "log out deletes the session");
await page.goto(`${BASE}/dashboard`);
ok(page.url().includes("/login"), "dashboard needs a session");
await page.fill('input[name="email"]', email);
await page.fill('input[name="password"]', "wrong-password-1");
await submit();
ok(await vis(page.getByText("That email and password don't match.")), "wrong password rejected");
await page.fill('input[name="password"]', "first-password-1");
await Promise.all([page.waitForURL(/\/dashboard/), submit()]);
ok(true, "correct password signs in");

const other = await (await browser.newContext()).newPage();
await other.goto(`${BASE}/login`);
await other.fill('input[name="email"]', email);
await other.fill('input[name="password"]', "first-password-1");
await Promise.all([other.waitForURL(/\/dashboard/), other.click('button:has-text("Log in")')]);
const anon = await (await browser.newContext()).newPage();
await anon.goto(`${BASE}/login`);
await anon.fill('input[name="email"]', email);
await anon.click('button:has-text("Forgot password?")');
ok(await vis(anon.getByText(/If that email has an account/)), "reset request gives a neutral answer");
const reset = await lastLink("reset");
await anon.goto(reset);
await anon.fill('input[name="password"]', "second-password-2");
await Promise.all([anon.waitForURL(/\/dashboard/), anon.click('button:has-text("Save password")')]);
await other.goto(`${BASE}/dashboard`);
ok(other.url().includes("/login"), "reset signs out other devices");
await anon.goto(reset);
await anon.fill('input[name="password"]', "third-password-3");
await anon.click('button:has-text("Save password")');
ok(await vis(anon.getByText(/expired or was already used/)), "reset link works only once");

const t = await (await browser.newContext()).newPage();
await t.goto(`${BASE}/login`);
let slowed = false;
for (let i = 0; i < 12 && !slowed; i++) {
  await t.fill('input[name="email"]', email);
  await t.fill('input[name="password"]', `nope-${i}-xxxxx`);
  await t.click('button:has-text("Log in")');
  await t.waitForTimeout(500);
  slowed = await t.getByText("Too many attempts").isVisible();
}
ok(slowed, "repeated wrong passwords are throttled");
ok((await fetch(`${BASE}/auth/signout`, { method: "POST", headers: { origin: "https://evil.example" }, redirect: "manual" })).status === 403, "sign-out from another site refused");
await browser.close();
await sql.end();
