import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { RoleName, roleRouteMap } from "@/config/roles";
import { slidingWindowRateLimit } from "@/lib/rate-limit";

/**
 * احجزلي — Edge middleware.
 *
 * Responsibilities:
 *  - Protect role-scoped routes (customer / business / admin).
 *  - Redirect unauthenticated users to the sign-in page.
 *  - Apply a lightweight sliding-window rate limit to auth endpoints
 *    (defense in depth against credential stuffing / abuse).
 */

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

async function redirectToLogin(req: NextRequest, callbackUrl: string) {
  const url = new URL("/login", req.url);
  url.searchParams.set("callbackUrl", callbackUrl);
  return NextResponse.redirect(url);
}

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
  const roles: string[] = (token?.roles as string[]) ?? [];
  const primaryRole = token?.role as RoleName | undefined;

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/business") ||
    pathname.startsWith("/admin");

  if (!isProtected) return NextResponse.next();

  // Not authenticated → sign in, preserving the intended destination.
  if (!token) return redirectToLogin(req, pathname);

  // Resolve which namespace is being requested.
  const namespace = pathname.startsWith("/admin")
    ? "/admin"
    : pathname.startsWith("/business")
      ? "/business"
      : "/dashboard";

  const allowed =
    primaryRole && roleRouteMap[primaryRole]?.some((prefix) => namespace.startsWith(prefix));

  if (!allowed) {
    // Authenticated but insufficient role → route to their home dashboard.
    const fallback = roleRouteMap[primaryRole as RoleName]?.[0] ?? "/dashboard";
    return NextResponse.redirect(new URL(fallback, req.url));
  }

  void roles;
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/business/:path*",
    "/admin/:path*",
    "/api/auth/:path*",
  ],
};
