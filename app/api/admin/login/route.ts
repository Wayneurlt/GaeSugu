import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, SESSION_HOURS, adminConfigured, checkCredentials, createSession } from "@/lib/admin/auth";
import { sameOrigin } from "@/lib/admin/guard";

/** Failed attempts per visitor, to slow down password guessing. Best effort: resets when the server restarts. */
const failures = new Map<string, { count: number; until: number }>();
const MAX_FAILURES = 8;
const LOCK_MINUTES = 15;

function clientKey(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Please sign in from the admin page." }, { status: 403 });
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "Admin sign-in is not set up yet. Add ADMIN_EMAIL and ADMIN_PASSWORD to the environment variables." },
      { status: 503 },
    );
  }

  const key = clientKey(request);
  const record = failures.get(key);
  if (record && record.count >= MAX_FAILURES && record.until > Date.now()) {
    const minutes = Math.ceil((record.until - Date.now()) / 60000);
    return NextResponse.json({ error: `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.` }, { status: 429 });
  }

  const body = (await request.json().catch(() => ({}))) as { email?: unknown; password?: unknown };
  const email = typeof body.email === "string" ? body.email : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!(await checkCredentials(email, password))) {
    const next = { count: (record && record.until > Date.now() ? record.count : 0) + 1, until: Date.now() + LOCK_MINUTES * 60000 };
    failures.set(key, next);
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "That email and password do not match." }, { status: 401 });
  }

  failures.delete(key);
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
