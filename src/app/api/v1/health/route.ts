import { NextResponse } from "next/server";

/**
 * GET /api/v1/health — versioned REST health check.
 * The /api/v1 namespace is the stable contract consumed by the future
 * Android & iOS applications.
 */
export async function GET() {
  return NextResponse.json({
    api: "v1",
    status: "ok",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
}
