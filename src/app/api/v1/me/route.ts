import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth-utils";

/** GET /api/v1/me — authenticated user profile (REST contract for mobile apps). */
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      name: true,
      phone: true,
      avatarUrl: true,
      bio: true,
      address: true,
      country: { select: { id: true, name: true, nameAr: true } },
      city: { select: { id: true, name: true, nameAr: true } },
      preferredLanguage: true,
      preferredTheme: true,
      notificationSettings: true,
      referralCode: true,
      status: true,
      createdAt: true,
    },
  });

  if (!profile) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json({ user: profile });
}
