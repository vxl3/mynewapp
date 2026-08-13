import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, sanitizeText } from "@/lib/security";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  firstName: z.string().min(1).max(60),
  lastName: z.string().min(1).max(60),
});

/**
 * POST /api/auth/register — create a customer account.
 * Returns 201 with a sanitized user, or a normalized error.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json", message: "Invalid request body" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", message: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 422 }
    );
  }

  const { email, password, firstName, lastName } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json(
      { error: "email_taken", message: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      firstName: sanitizeText(firstName),
      lastName: sanitizeText(lastName),
      name: `${sanitizeText(firstName)} ${sanitizeText(lastName)}`,
      status: "PENDING",
      roles: {
        create: [{ role: { connect: { name: "CUSTOMER" } } }],
      },
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ user }, { status: 201 });
}
