import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, SESSION_HOURS, adminConfigured, checkCredentials, createSession } from "@/lib/admin/auth";
import { sameOrigin } from "@/lib/admin/guard";
import { clearLoginFailures, hasDatabase, loginLockMinutes, recordLoginFailure } from "@/lib/db";

const MAX_FAILURES = 8;
const LOCK_MINUTES = 15;

function clientKey(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
}

/**
 * Failed attempts per visitor, to slow down password guessing. With the database
 * the count is shared by every server (Vercel runs several); without it, it is
 * kept in this server's memory.
 */
const memory = new Map<string, { count: number; until: number }>();
const attempts = {
  async lockedMinutes(key: string) {
    if (hasDatabase()) return loginLockMinutes(key, MAX_FAILURES);
    const r = memory.get(key);
    return r && r.count >= MAX_FAILURES && r.until > Date.now() ? Math.ceil((r.until - Date.now()) / 60000) : 0;
  },
  async fail(key: string) {
    if (hasDatabase()) return recordLoginFailure(key, LOCK_MINUTES);
    const r = memory.get(key);
    memory.set(key, { count: (r && r.until > Date.now() ? r.count : 0) + 1, until: Date.now() + LOCK_MINUTES * 60000 });
  },
  async clear(key: string) {
    if (hasDatabase()) return clearLoginFailures(key);
    memory.delete(key);
  },
};

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Please sign in from the admin page." }, { status: 403 });
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "Admin sign-in is not set up yet. Add ADMIN_EMAIL and ADMIN_PASSWORD to the environment variables." },
      { status: 503 },
    );
  }

  const key = clientKey(request);
  const minutes = await attempts.lockedMinutes(key);
  if (minutes > 0) {
    return NextResponse.json({ error: `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.` }, { status: 429 });
  }

  const body = (await request.json().catch(() => ({}))) as { email?: unknown; password?: unknown };
  const email = typeof body.email === "string" ? body.email : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!(await checkCredentials(email, password))) {
    await attempts.fail(key);
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "That email and password do not match." }, { status: 401 });
  }

  await attempts.clear(key);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, await createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
  return response;
}
