"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/security";
import { requireUser } from "@/lib/auth-utils";
import { writeAuditLog } from "@/lib/audit";
import {
  profileSchema,
  changePasswordSchema,
  notificationSettingsSchema,
  deletionRequestSchema,
} from "@/lib/validations";

export type ActionResult = { ok: true } | { ok: false; error: string };

const emptyToUndefined = (value: string | undefined | null): string | undefined =>
  value && value.trim() !== "" ? value.trim() : undefined;

/** Update the authenticated user's profile. */
export async function updateProfile(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const data = parsed.data;
  const name = `${data.firstName} ${data.lastName}`.trim();

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        name,
        phone: emptyToUndefined(data.phone),
        bio: emptyToUndefined(data.bio),
        address: emptyToUndefined(data.address),
        countryId: emptyToUndefined(data.countryId),
        cityId: emptyToUndefined(data.cityId),
        avatarUrl: emptyToUndefined(data.avatarUrl),
        preferredLanguage: data.preferredLanguage,
        preferredTheme: data.preferredTheme,
      },
    });

    await writeAuditLog({
      userId: user.id,
      action: "UPDATE",
      entity: "User",
      entityId: user.id,
    });

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard/settings");
    return { ok: true };
  } catch (error) {
    const message = (error as { code?: string }).code === "P2002" ? "Phone number is already in use" : "Could not save profile";
    return { ok: false, error: message };
  }
}

/** Change the authenticated user's password (requires current password). */
export async function changePassword(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const account = await prisma.user.findUnique({ where: { id: user.id } });
  if (!account?.passwordHash) {
    return { ok: false, error: "Password sign-in is not available for this account" };
  }

  const valid = await compare(parsed.data.currentPassword, account.passwordHash);
  if (!valid) return { ok: false, error: "Current password is incorrect" };

  const passwordHash = await hashPassword(parsed.data.newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, failedLoginAttempts: 0, lockedUntil: null },
    }),
    prisma.refreshToken.deleteMany({ where: { userId: user.id } }),
  ]);

  await writeAuditLog({ userId: user.id, action: "UPDATE", entity: "User", entityId: user.id });

  revalidatePath("/dashboard/security");
  return { ok: true };
}

/** Update notification preferences (email / push / sms). */
export async function updateNotificationSettings(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = notificationSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid settings" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { notificationSettings: parsed.data as unknown as object },
  });

  revalidatePath("/dashboard/settings");
  return { ok: true };
}

/** Submit an account deletion request (processed by admins). */
export async function requestDeletion(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = deletionRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid request" };
  }

  await prisma.accountDeletionRequest.upsert({
    where: { userId: user.id },
    update: { reason: parsed.data.reason ?? null, status: "PENDING", requestedAt: new Date() },
    create: { userId: user.id, reason: parsed.data.reason ?? null },
  });

  await writeAuditLog({ userId: user.id, action: "DELETE", entity: "AccountDeletionRequest" });

  revalidatePath("/dashboard/security");
  return { ok: true };
}

/** Cancel a pending deletion request. */
export async function cancelDeletion(): Promise<ActionResult> {
  const user = await requireUser();
  await prisma.accountDeletionRequest.deleteMany({ where: { userId: user.id, status: "PENDING" } });
  revalidatePath("/dashboard/security");
  return { ok: true };
}

/** Register the current browser/device after sign-in (connected devices list). */
export async function registerDevice(input?: { name?: string }): Promise<ActionResult> {
  const user = await requireUser();
  const h = await headers();
  const userAgent = h.get("user-agent") ?? undefined;
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined;

  const name =
    input?.name?.trim() ||
    describeUserAgent(userAgent) ||
    "Unknown device";

  try {
    await prisma.device.create({
      data: { userId: user.id, name, userAgent, ip },
    });
  } catch {
    // Device tracking is best-effort and must never break sign-in.
  }
  return { ok: true };
}

/** Revoke a connected device (sign it out). */
export async function revokeDevice(deviceId: string): Promise<ActionResult> {
  const user = await requireUser();
  await prisma.device.deleteMany({ where: { id: deviceId, userId: user.id } });
  revalidatePath("/dashboard/security");
  return { ok: true };
}

function describeUserAgent(ua: string | undefined): string {
  if (!ua) return "Unknown device";
  if (/iPhone|iPad|iPod/i.test(ua)) return "Apple iOS device";
  if (/Android/i.test(ua)) return "Android device";
  if (/Edg\//.test(ua)) return "Microsoft Edge";
  if (/Chrome\//.test(ua)) return "Google Chrome";
  if (/Firefox\//.test(ua)) return "Mozilla Firefox";
  if (/Safari\//.test(ua)) return "Apple Safari";
  return "Web browser";
}
