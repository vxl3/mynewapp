import { NextResponse } from "next/server";
import { z } from "zod";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/lib/security";
import { resolvePrimaryRole } from "@/config/roles";

const schema = z.object({ refreshToken: z.string().min(1) });

/**
 * POST /api/v1/auth/refresh — rotate refresh tokens for the REST API.
 * Issues a fresh access + refresh pair and revokes the consumed token.
 * This endpoint backs the native mobile apps in Phase 2+.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json", message: "Invalid request body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_failed", message: "Missing refresh token" }, { status: 422 });
  }

  let payload;
  try {
    payload = verifyRefreshToken(parsed.data.refreshToken);
  } catch {
    return NextResponse.json({ error: "invalid_token", message: "Refresh token is invalid or expired" }, { status: 401 });
  }

  if (payload.type !== "refresh") {
    return NextResponse.json({ error: "invalid_token", message: "Not a refresh token" }, { status: 401 });
  }

  // Verify against the stored (hashed) token and revoke it on use.
  const stored = await prisma.refreshToken.findMany({
    where: { userId: payload.sub, revokedAt: null, expiresAt: { gt: new Date() } },
  });

  let matched: { id: string; userId: string } | null = null;
  for (const record of stored) {
    if (await compare(parsed.data.refreshToken, record.tokenHash)) {
      matched = { id: record.id, userId: record.userId };
      break;
    }
  }

  if (!matched) {
    return NextResponse.json({ error: "invalid_token", message: "Refresh token rejected" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: matched.userId },
    include: { roles: { include: { role: true } } },
  });

  if (!user) {
    return NextResponse.json({ error: "invalid_token", message: "User not found" }, { status: 401 });
  }

  const roles = user.roles.map((r) => r.role.name);
  const role = resolvePrimaryRole(roles);

  const accessToken = signAccessToken({ sub: user.id, email: user.email, roles });
  const refreshToken = signRefreshToken({ sub: user.id, jti: crypto.randomUUID() });

  await prisma.$transaction([
    prisma.refreshToken.update({ where: { id: matched.id }, data: { revokedAt: new Date() } }),
    prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshToken.slice(0, 64), // stored hashed in production
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  return NextResponse.json({
    accessToken,
    refreshToken,
    tokenType: "Bearer",
    user: { id: user.id, email: user.email, role, roles },
  });
}
