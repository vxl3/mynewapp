"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";
import { messageSchema } from "@/lib/validations";
import type { ActionResult } from "@/lib/actions/profile";

/** Toggle a business in the authenticated user's favorites. */
export async function toggleFavorite(businessId: string): Promise<{ ok: true; added: boolean } | { ok: false; error: string }> {
  const user = await requireUser();
  const existing = await prisma.favorite.findUnique({
    where: { userId_businessId: { userId: user.id, businessId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    revalidatePath("/dashboard/favorites");
    return { ok: true, added: false };
  }

  await prisma.favorite.create({ data: { userId: user.id, businessId } });
  revalidatePath("/dashboard/favorites");
  return { ok: true, added: true };
}

/** Remove a business from favorites. */
export async function removeFavorite(businessId: string): Promise<ActionResult> {
  const user = await requireUser();
  await prisma.favorite.deleteMany({ where: { userId: user.id, businessId } });
  revalidatePath("/dashboard/favorites");
  return { ok: true };
}

/** Mark a single notification as read. */
export async function markNotificationRead(notificationId: string): Promise<ActionResult> {
  const user = await requireUser();
  await prisma.notification.updateMany({
    where: { id: notificationId, userId: user.id },
    data: { isRead: true, readAt: new Date() },
  });
  revalidatePath("/dashboard/notifications");
  return { ok: true };
}

/** Mark every notification as read. */
export async function markAllNotificationsRead(): Promise<ActionResult> {
  const user = await requireUser();
  await prisma.notification.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
  revalidatePath("/dashboard/notifications");
  return { ok: true };
}

/** Send a direct message to another user. */
export async function sendMessage(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = messageSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  await prisma.message.create({
    data: {
      senderId: user.id,
      recipientId: parsed.data.recipientId,
      subject: parsed.data.subject || null,
      body: parsed.data.body,
    },
  });

  revalidatePath("/dashboard/messages");
  revalidatePath("/business/messages");
  return { ok: true };
}
