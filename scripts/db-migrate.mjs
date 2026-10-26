// Applies db/migrations/*.sql in order, once each, inside a transaction per file.
// Usage: DATABASE_URL=postgres://… node scripts/db-migrate.mjs   (Supabase: use the direct or session-pooler URL)
import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
const postgres = createRequire(import.meta.url)("postgres");

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");
const sql = postgres(url, { max: 1, onnotice: () => {} });

await sql`create table if not exists public._migrations (name text primary key, applied_at timestamptz not null default now())`;
const done = new Set((await sql`select name from public._migrations`).map((r) => r.name));
const files = readdirSync(new URL("../db/migrations/", import.meta.url)).filter((f) => f.endsWith(".sql")).sort();
for (const f of files) {
  if (done.has(f)) continue;
  const body = readFileSync(new URL(`../db/migrations/${f}`, import.meta.url), "utf8");
  await sql.begin(async (tx) => {
    await tx.unsafe(body);
    await tx`insert into public._migrations (name) values (${f})`;
  });
  console.log("applied", f);
}
console.log("migrations up to date");
await sql.end();
