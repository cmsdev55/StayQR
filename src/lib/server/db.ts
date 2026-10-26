import "server-only";
import postgres from "postgres";
import { env } from "./env";

/**
 * One pooled connection per server instance. `prepare: false` keeps it compatible with Supabase's
 * transaction pooler (port 6543), which serverless functions should use.
 */
const g = globalThis as unknown as { __stayqrSql?: postgres.Sql };

export function db() {
  if (!env.databaseUrl) throw new Error("DATABASE_URL is not set. Run scripts/db-local.sh for a local database.");
  return (g.__stayqrSql ??= postgres(env.databaseUrl, { prepare: false, max: 5, idle_timeout: 20, connect_timeout: 10, onnotice: () => {} }));
}
