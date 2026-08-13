import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword, sanitizeText } from "@/lib/security";
import { RoleName } from "@/config/roles";
import { sendEmail } from "@/lib/email";
import { absoluteUrl } from "@/lib/utils";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  firstName: z.string().min(1).max(60),
  lastName: z.string().min(1).max(60),
  role: z.enum(["CUSTOMER", "BUSINESS_OWNER"]).default("CUSTOMER"),
  // Optional business payload for BUSINESS_OWNER registration.
  business: z
    .object({
      name: z.string().min(2).max(120),
      slug: z.string().regex(/^[a-z0-9-]+$/).min(2).max(120),
      categoryId: z.string().optional(),
      phone: z.string().max(30).optional(),
    })
    .optional(),
});

/**
 * POST /api/auth/register — create a Customer or Business Owner account.
 *
 * SUPER_ADMIN can never be registered here (seed-only). The account starts
 * PENDING until the email is verified; a verification link is emailed (or
 * logged / returned in development).
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

  const { email, password, firstName, lastName, role, business } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json(
      { error: "email_taken", message: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const roleRecord = await prisma.role.findUnique({ where: { name: role } });
  if (!roleRecord) {
    return NextResponse.json({ error: "invalid_role", message: "Role not allowed" }, { status: 422 });
  }

  const passwordHash = await hashPassword(password);
  const referralCode = await generateUniqueReferralCode();

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      firstName: sanitizeText(firstName),
      lastName: sanitizeText(lastName),
      name: `${sanitizeText(firstName)} ${sanitizeText(lastName)}`,
      referralCode,
      status: "PENDING",
      roles: { create: [{ roleId: roleRecord.id }] },
    },
  });

  // Business Owner: create their first business draft in the same transaction.
  if (role === RoleName.BUSINESS_OWNER && business) {
    const categoryExists = business.categoryId
      ? await prisma.category.findUnique({ where: { id: business.categoryId } })
      : null;
    await prisma.business.create({
      data: {
        ownerId: user.id,
        name: sanitizeText(business.name),
        slug: business.slug,
        phone: business.phone ?? null,
        categoryId: categoryExists?.id ?? null,
        status: "PENDING",
      },
    });
  }

  // Email verification token.
  const token = crypto.randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: {
      identifier: normalizedEmail,
      token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  const verifyUrl = absoluteUrl(`/verify-email?token=${token}`);
  const { devLink } = await sendEmail({
    to: normalizedEmail,
    subject: "احجزلي — Verify your email",
    text: `Verify your email: ${verifyUrl}`,
    devLink: verifyUrl,
  });

  return NextResponse.json(
    {
      user: { id: user.id, email: user.email, role },
      message: "Account created. Verify your email to continue.",
      // Development only — enables end-to-end testing without SMTP.
      ...(process.env.NODE_ENV !== "production" ? { devVerificationUrl: devLink } : {}),
    },
    { status: 201 }
  );
}

async function generateUniqueReferralCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = crypto.randomBytes(4).toString("hex").toUpperCase();
    const existing = await prisma.user.findUnique({ where: { referralCode: code } });
    if (!existing) return code;
  }
  return crypto.randomBytes(6).toString("hex").toUpperCase();
}
