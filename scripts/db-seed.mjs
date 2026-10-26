// Local demo data: one account (demo@stayqr.local, sign in with the dev login) with folders, codes and 90 days of scans.
// Usage: DATABASE_URL=postgres://localhost:54329/stayqr node scripts/db-seed.mjs   (refuses non-local databases)
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
const postgres = createRequire(import.meta.url)("postgres");
const url = process.env.DATABASE_URL ?? "postgres://localhost:54329/stayqr";
if (!/@?(localhost|127\.0\.0\.1)[:/]/.test(url)) throw new Error("Refusing to seed a non-local database");
const sql = postgres(url, { onnotice: () => {} });

const email = "demo@stayqr.local";
await sql`delete from auth.users where email = ${email}`;
const id = randomUUID();
await sql`insert into auth.users (id, email) values (${id}, ${email})`;
await sql`insert into public.profiles (id, email, name) values (${id}, ${email}, 'Demo Owner')`;
const renews = new Date(Date.now() + 140 * 864e5);
await sql`insert into public.subscriptions (id, user_id, customer_id, variant_id, plan, status, renews_at, card_brand, card_last_four)
          values (${`seed-${id.slice(0, 8)}`}, ${id}, 'seed', 'seed', 'pro-yearly', 'active', ${renews}, 'visa', '4242')`;
await sql`insert into public.invoices (id, user_id, description, total_cents, currency, status, created_at)
          values (${`seed-inv-${id.slice(0, 8)}`}, ${id}, 'StayQR Pro · yearly', 2900, 'USD', 'paid', ${new Date(Date.now() - 225 * 864e5)})`;

const folders = {};
for (const name of ["Restaurant", "Hotel", "Spring campaign"]) {
  folders[name] = (await sql`insert into public.folders (user_id, name) values (${id}, ${name}) returning id`)[0].id;
}
const D = (fg, dots = "rounded", corners = "extra-rounded", bg = "#FFFFFF") => ({ fg, bg, dots, corners });
const codes = [
  ["Table tent · dinner menu", "https://example.com/menu", "Restaurant", D("#0B0D12"), 120],
  ["Receipt · leave a review", "https://example.com/review", "Restaurant", D("#9F1239", "dots", "dot"), 35],
  ["Window · order online", "https://example.com/order", "Restaurant", D("#0B0D12", "square", "square"), 25],
  ["Room cards · guest info", "https://example.com/rooms", "Hotel", D("#1E3A8A", "classy"), 90],
  ["Spa booking", "https://example.com/spa", "Hotel", D("#1E3A8A"), 18],
  ["Flyer · spring tasting", "https://example.com/spring", "Spring campaign", D("#065F46", "dots", "dot", "#ECFCCB"), 40],
  ["Poster · bus shelter", "https://example.com/spring?src=poster", "Spring campaign", D("#065F46"), 22],
];
const CITIES = [["London", "GB", 40], ["Manchester", "GB", 14], ["Brighton", "GB", 9], ["Paris", "FR", 6], ["New York", "US", 4], [null, null, 27]];
const OS = [["ios", "mobile", "Safari", 56], ["android", "mobile", "Chrome", 38], ["windows", "desktop", "Edge", 3], ["macos", "desktop", "Chrome", 3]];
const pick = (list) => { let r = Math.random() * list.reduce((s, x) => s + x.at(-1), 0); for (const x of list) if ((r -= x.at(-1)) < 0) return x; return list[0]; };
let total = 0;
for (const [i, [name, dest, folder, design, perDay]] of codes.entries()) {
  const slug = `demo${i}x`.slice(0, 6) + String.fromCharCode(97 + i);
  const [c] = await sql`insert into public.codes (user_id, slug, name, destination, folder_id, design, created_at, updated_at)
    values (${id}, ${slug}, ${name}, ${dest}, ${folders[folder]}, ${sql.json(design)}, now() - interval '100 days', now() - ${`${i * 3 + 2} hours`}::interval) returning id`;
  const rows = [];
  for (let d = 0; d < 90; d++) {
    const day = new Date(Date.now() - d * 864e5);
    const dow = day.getUTCDay();
    const n = Math.round(perDay * (dow === 5 || dow === 6 ? 1.4 : 1) * (1 - d / 300) * (0.75 + Math.random() * 0.5));
    for (let k = 0; k < n; k++) {
      const hour = pick([[12, 3], [13, 4], [19, 4], [20, 5], [21, 3], [9, 1], [16, 1], [23, 0.5]])[0];
      const t = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), hour, Math.floor(Math.random() * 60)));
      if (t > new Date()) continue;
      const [city, country] = pick(CITIES);
      const [os, device, browser] = pick(OS);
      rows.push({ code_id: c.id, scanned_at: t, city, country, os, device, browser });
    }
  }
  for (let j = 0; j < rows.length; j += 2000) await sql`insert into public.scans ${sql(rows.slice(j, j + 2000))}`;
  total += rows.length;
}
console.log(`seeded ${email}: ${codes.length} codes, ${total} scans`);
await sql.end();
