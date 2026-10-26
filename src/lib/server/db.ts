import "server-only";
import postgres from "postgres";
import { env } from "./env";

/**
 * A small pool per server instance (serverless functions run many instances, so keep `max` low against Postgres'
 * connection limit). `prepare: false` keeps it compatible with PgBouncer-style poolers if one is added later.
 */
const g = globalThis as unknown as { __stayqrSql?: postgres.Sql };

export function db() {
  if (!env.databaseUrl) throw new Error("DATABASE_URL is not set. Run scripts/db-local.sh for a local database.");
  return (g.__stayqrSql ??= postgres(env.databaseUrl, { prepare: false, max: 3, idle_timeout: 20, connect_timeout: 10, onnotice: () => {} }));
}
