import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "./auth";

/**
 * Checks an admin API request: a valid session, and for changes, that the
 * request came from this site's own pages (not a form on another website).
 * Returns an error response to send back, or null when the request may go on.
 */
export async function guard(request: NextRequest) {
  if (!(await verifySession(request.cookies.get(SESSION_COOKIE)?.value))) {
    return NextResponse.json({ error: "Your session has ended. Sign in again." }, { status: 401 });
  }
  if (request.method !== "GET" && !sameOrigin(request)) {
    return NextResponse.json({ error: "This request did not come from the admin." }, { status: 403 });
  }
  return null;
}

export function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function failure(error: unknown, status = 500) {
  const message = error instanceof Error ? error.message : String(error);
  console.error("[admin]", message);
  return NextResponse.json({ error: message }, { status });
}
