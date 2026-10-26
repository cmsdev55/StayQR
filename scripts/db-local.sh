#!/usr/bin/env bash
# Local Postgres for development (no Docker needed). Data lives in .pgdata (gitignored).
#   scripts/db-local.sh start | stop | reset
# Then: DATABASE_URL=postgres://localhost:54329/stayqr
set -euo pipefail
cd "$(dirname "$0")/.."
DATA=.pgdata PORT=54329 URL="postgres://localhost:${PORT}/stayqr"
cmd=${1:-start}
if [[ $cmd == stop ]]; then pg_ctl -D "$DATA" stop -m fast; exit 0; fi
if [[ $cmd == reset ]]; then pg_ctl -D "$DATA" stop -m fast 2>/dev/null || true; rm -rf "$DATA"; fi
if [[ ! -d $DATA ]]; then initdb -D "$DATA" -U "$(whoami)" --auth=trust >/dev/null; fi
pg_ctl -D "$DATA" -o "-p ${PORT} -k /tmp" -l "$DATA/log.txt" status >/dev/null 2>&1 || pg_ctl -D "$DATA" -o "-p ${PORT} -k /tmp" -l "$DATA/log.txt" start -w >/dev/null
psql -h localhost -p "$PORT" -d postgres -tAc "select 1 from pg_database where datname='stayqr'" | grep -q 1 || createdb -h localhost -p "$PORT" stayqr
psql -h localhost -p "$PORT" -d stayqr -q -f db/local/auth-stub.sql
DATABASE_URL=$URL node scripts/db-migrate.mjs
echo "ready: $URL"
