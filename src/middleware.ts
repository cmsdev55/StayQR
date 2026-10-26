import { NextResponse, type NextRequest } from "next/server";

/**
 * Cheap gate for /dashboard: no session cookie → straight to login, without touching the database. The dashboard
 * layout still validates the session itself. Short links (/r/…) and marketing pages never run this.
 */
export function middleware(req: NextRequest) {
  if (!req.cookies.get("stayqr_session")?.value) {
    const to = req.nextUrl.clone();
    to.pathname = "/login";
    to.search = `?next=${encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)}`;
    return NextResponse.redirect(to);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
