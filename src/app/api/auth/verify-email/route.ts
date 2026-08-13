import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ token: z.string().min(1) });

/**
 * POST /api/auth/verify-email — verify an email address using an Auth.js
 * verification token. Marks the user ACTIVE (email verified).
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
    return NextResponse.json({ error: "validation_failed", message: "Invalid token" }, { status: 422 });
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token: parsed.data.token },
  });

  if (!record || record.expires < new Date()) {
    return NextResponse.json(
      { error: "invalid_token", message: "Verification token is invalid or expired" },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { email: record.identifier },
      data: { emailVerified: new Date(), status: "ACTIVE" },
    }),
    prisma.verificationToken.delete({ where: { token: parsed.data.token } }),
  ]);

  return NextResponse.json({ message: "Email verified successfully" });
}
