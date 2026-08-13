import { NextResponse } from "next/server";
import { z } from "zod";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/security";

const schema = z.object({
  token: z.string().min(32),
  password: z.string().min(8).max(128),
});

/**
 * POST /api/auth/reset-password — consume a reset token and set a new password.
 * The token is single-use and expires after one hour.
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
    return NextResponse.json({ error: "validation_failed", message: "Invalid input" }, { status: 422 });
  }

  const { token, password } = parsed.data;

  // Find an unused, unexpired token that matches (constant-time compare below).
  const tokens = await prisma.passwordResetToken.findMany({
    where: { usedAt: null, expiresAt: { gt: new Date() } },
    include: { user: true },
  });

  let matchedUserId: string | null = null;
  for (const record of tokens) {
    if (await compare(token, record.tokenHash)) {
      matchedUserId = record.userId;
      break;
    }
  }

  if (!matchedUserId) {
    return NextResponse.json(
      { error: "invalid_token", message: "Reset token is invalid or expired" },
      { status: 400 }
    );
  }

  const newHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: matchedUserId },
      data: { passwordHash: newHash, failedLoginAttempts: 0, lockedUntil: null },
    }),
    prisma.passwordResetToken.updateMany({
      where: { userId: matchedUserId, usedAt: null },
      data: { usedAt: new Date() },
    }),
  ]);

  // Invalidate existing refresh tokens for this user (force re-auth everywhere).
  await prisma.refreshToken.deleteMany({ where: { userId: matchedUserId } });

  return NextResponse.json({ message: "Password has been reset successfully" });
}
