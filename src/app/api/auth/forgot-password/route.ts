import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "node:crypto";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const schema = z.object({ email: z.string().email() });

/**
 * POST /api/auth/forgot-password — issue a password-reset token.
 * Always returns 200 (never reveals whether the email exists).
 * Phase 2 wires the token into an email; the token is stored hashed.
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
    return NextResponse.json({ error: "validation_failed", message: "Invalid email" }, { status: 422 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = await hash(rawToken, 10);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    // Phase 2: send `rawToken` via email using the configured SMTP transport.
  }

  return NextResponse.json({
    message: "If an account exists for this email, a reset link has been sent.",
  });
}
