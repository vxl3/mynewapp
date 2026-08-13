import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth-utils";

/** GET /api/v1/me/notifications — current user's notifications + unread count. */
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: { id: true, type: true, title: true, body: true, isRead: true, createdAt: true },
  });

  const unread = await prisma.notification.count({
    where: { userId: user.id, isRead: false },
  });

  return NextResponse.json({ notifications, unread });
}
