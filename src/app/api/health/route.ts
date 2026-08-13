import { NextResponse } from "next/server";

/** GET /api/health — liveness probe for load balancers & uptime monitors. */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "ahjezli",
    timestamp: new Date().toISOString(),
  });
}
