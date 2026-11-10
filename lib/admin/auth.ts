/**
 * Admin sign-in. Credentials come from environment variables, never from the
 * code, so they are not visible in the GitHub repo:
 *
 *   ADMIN_EMAIL     the admin's email address
 *   ADMIN_PASSWORD  the admin's password
 *   AUTH_SECRET     optional; signs the session cookie (defaults to a value
 *                   derived from the credentials, so changing the password
 *                   signs everyone out)
 *
 * Uses Web Crypto only, so it runs in middleware and in route handlers.
 */

export const SESSION_COOKIE = "gae_admin";
export const SESSION_HOURS = 12;

const encoder = new TextEncoder();

export function adminConfigured() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);
}

function secret() {
  const { AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (AUTH_SECRET) return AUTH_SECRET;
  if (ADMIN_EMAIL && ADMIN_PASSWORD) return `gae-admin:${ADMIN_EMAIL.toLowerCase()}:${ADMIN_PASSWORD}`;
  return null;
}

function toBase64Url(bytes: ArrayBuffer) {
  let binary = "";
  for (const b of new Uint8Array(bytes)) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(data: string, key: string) {
  const cryptoKey = await crypto.subtle.importKey("raw", encoder.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toBase64Url(await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data)));
}

/** Compares two strings in time that does not depend on where they differ. */
function sameString(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function checkCredentials(email: string, password: string) {
  const key = secret();
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!key || !ADMIN_EMAIL || !ADMIN_PASSWORD) return false;
  // Compare signatures rather than the raw values, so lengths leak nothing.
  const [a, b, c, d] = await Promise.all([
    sign(email.trim().toLowerCase(), key),
    sign(ADMIN_EMAIL.trim().toLowerCase(), key),
    sign(password, key),
    sign(ADMIN_PASSWORD, key),
  ]);
  return sameString(a, b) && sameString(c, d);
}

export async function createSession() {
  const key = secret();
  if (!key) throw new Error("Admin is not configured");
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  return `${expires}.${await sign(`admin|${expires}`, key)}`;
}

export async function verifySession(token: string | undefined) {
  const key = secret();
  if (!key || !token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || !(Number(expires) > Date.now())) return false;
  return sameString(signature, await sign(`admin|${expires}`, key));
}
