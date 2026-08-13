import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { RoleName, roleRouteMap } from "@/config/roles";
import { slidingWindowRateLimit } from "@/lib/rate-limit";

/**
 * احجزلي — Edge middleware.
 *
 * Responsibilities:
 *  - Protect role-scoped routes (customer / business / admin).
 *  - Redirect guests to sign-in (preserving the destination).
 *  - Redirect authenticated users to a custom 403 page on role mismatch.
 *  - Keep authenticated users out of the auth pages (login/register).
 *  - Apply a sliding-window rate limit to auth endpoints.
 */

const AUTH_PAGES = ["/login", "/register", "/forgot-password", "/reset-password"];

export async function middleware(req: NextRequest) {
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

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const primaryRole = token?.role as RoleName | undefined;
  const isAuthenticated = Boolean(token);

  // Authenticated users should not sit on auth pages → send them home.
  if (isAuthenticated && AUTH_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
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
