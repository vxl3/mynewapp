import { NextResponse } from "next/server";

export const runtime = "edge";

/**
 * GET /api/diag — deployment diagnostics (booleans only, no secrets).
 * Helps confirm whether environment variables reach the Edge runtime.
 */
export async function GET() {
  return NextResponse.json({
    edge: true,
    hasAuthSecret:
      typeof process.env.AUTH_SECRET === "string" && process.env.AUTH_SECRET.length > 0,
    hasDbUrl: typeof process.env.DATABASE_URL === "string" && process.env.DATABASE_URL.length > 0,
  });
}
