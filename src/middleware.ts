import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { RoleName, roleRouteMap } from "@/config/roles";
import { slidingWindowRateLimit } from "@/lib/rate-limit";

/**
 * احجزلي — Edge middleware (route protection).
 *
 * Lightweight on purpose: it imports only `getToken` (jose-based) instead of
 * the full NextAuth instance, keeping the Edge bundle far below Vercel's 1 MB
 * free-plan limit.
 *
 * Important: Auth.js derives the JWE encryption salt from the session cookie
 * NAME. On HTTPS the cookie is `__Secure-authjs.session-token`, on plain HTTP
 * it is `authjs.session-token`. We therefore detect the request protocol and
 * pass `secureCookie` so decoding always matches the cookie that was issued.
 *
 * Responsibilities:
 *  - Protect role-scoped routes (customer / business / admin).
 *  - Redirect guests to sign-in (preserving the destination).
 *  - Redirect authenticated users to a custom 403 page on role mismatch.
 *  - Keep authenticated users out of the auth pages (login/register).
 *  - Apply a sliding-window rate limit to auth endpoints.
 */

const AUTH_PAGES = ["/login", "/register", "/forgot-password", "/reset-password"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- Rate limiting for auth endpoints ---
  if (pathname.startsWith("/api/auth/") && !pathname.includes("session")) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { success } = slidingWindowRateLimit(`auth:${ip}`, 10, 60_000);
    if (!success) {
      return NextResponse.json(
        { error: "too_many_requests", message: "Too many attempts. Try again later." },
        { status: 429 }
      );
    }
  }

  // Detect whether Auth.js used secure cookies (HTTPS → "__Secure-" prefix).
  const isHttps =
    req.headers.get("x-forwarded-proto") === "https" || req.nextUrl.protocol === "https:";

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: isHttps,
  });

  const primaryRole = token?.role as RoleName | undefined;

  // Authenticated users should not sit on auth pages → send them home.
  if (token && AUTH_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    const home = roleRouteMap[primaryRole as RoleName]?.[0] ?? "/dashboard";
    return NextResponse.redirect(new URL(home, req.url));
  }

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/business") ||
    pathname.startsWith("/admin");

  if (!isProtected) return NextResponse.next();

  if (!token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const namespace = pathname.startsWith("/admin")
    ? "/admin"
    : pathname.startsWith("/business")
      ? "/business"
      : "/dashboard";

  const allowed =
    primaryRole && roleRouteMap[primaryRole]?.some((prefix) => namespace.startsWith(prefix));

  if (!allowed) {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/business/:path*",
    "/admin/:path*",
    "/login",
    "/register/:path*",
    "/forgot-password",
    "/reset-password",
    "/api/auth/:path*",
  ],
};
