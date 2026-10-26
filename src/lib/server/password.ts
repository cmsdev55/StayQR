import "server-only";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

/** scrypt (built into Node): "scrypt$N$r$p$salt$hash", base64url. N=2^15 ≈ 32 MB per hash, roughly 50–100 ms. */
const N = 32768, R = 8, P = 1, KEYLEN = 64;
const MAXMEM = 64 * 1024 * 1024;

const derive = (password: string, salt: Buffer, n: number, r: number, p: number) =>
  new Promise<Buffer>((res, rej) => scrypt(password.normalize("NFKC"), salt, KEYLEN, { N: n, r, p, maxmem: MAXMEM }, (e, k) => (e ? rej(e) : res(k))));

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await derive(password, salt, N, R, P);
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64url")}$${key.toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string | null | undefined) {
  if (!stored) return false;
  const [alg, n, r, p, salt, hash] = stored.split("$");
  if (alg !== "scrypt" || !salt || !hash) return false;
  const key = await derive(password, Buffer.from(salt, "base64url"), Number(n), Number(r), Number(p));
  const want = Buffer.from(hash, "base64url");
  return key.length === want.length && timingSafeEqual(key, want);
}

/** A fixed hash to compare against when the email doesn't exist, so response time doesn't reveal accounts. */
export const DUMMY_HASH = "scrypt$32768$8$1$c3RheXFyLWR1bW15LXNhbHQ$" + "A".repeat(86);

export const PASSWORD_MIN = 8;
export function passwordProblem(pw: string) {
  if (pw.length < PASSWORD_MIN) return `Use at least ${PASSWORD_MIN} characters.`;
  if (pw.length > 200) return "That password is too long.";
  if (/^(.)\1+$/.test(pw) || ["password", "12345678", "qwertyui", "endureqr123"].includes(pw.toLowerCase())) return "Pick a less common password.";
  return null;
}
