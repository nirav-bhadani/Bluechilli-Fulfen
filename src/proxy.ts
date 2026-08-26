import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * HTTP Basic Auth over the whole site while it is in client review.
 * Credentials come from SITE_AUTH_USER / SITE_AUTH_PASSWORD (set in Vercel).
 * robots.txt is deliberately left public so crawlers can still read Disallow: /.
 * TODO(go-live): delete this file when the site goes public.
 */
export function proxy(request: NextRequest) {
  const user = process.env.SITE_AUTH_USER;
  const password = process.env.SITE_AUTH_PASSWORD;

  // Fail closed: never serve the site unprotected because a var is missing.
  if (!user || !password) {
    return unauthorized("Password protection is not configured.", 503);
  }

  const header = request.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      const separator = decoded.indexOf(":");
      if (
        separator !== -1 &&
        decoded.slice(0, separator) === user &&
        decoded.slice(separator + 1) === password
      ) {
        return NextResponse.next();
      }
    } catch {
      // Malformed base64 — fall through to the challenge below.
    }
  }

  return unauthorized("Authentication required.", 401);
}

function unauthorized(message: string, status: number) {
  return new NextResponse(message, {
    status,
    headers: {
      "WWW-Authenticate": 'Basic realm="Restricted", charset="UTF-8"',
      "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex",
      "Cache-Control": "no-store",
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"],
};
