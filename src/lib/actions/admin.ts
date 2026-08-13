"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { writeAuditLog } from "@/lib/audit";
import {
  categorySchema,
  countrySchema,
  citySchema,
  couponSchema,
  broadcastSchema,
} from "@/lib/validations";
import type { ActionResult } from "@/lib/actions/profile";

async function requireAdmin() {
  return requireRole(RoleName.SUPER_ADMIN);
}

// ------------------------------------------------------------
// Users & roles
// ------------------------------------------------------------

export async function setUserStatus(input: { userId: string; status: "ACTIVE" | "SUSPENDED" | "LOCKED" }): Promise<ActionResult> {
  const admin = await requireAdmin();
  await prisma.user.update({ where: { id: input.userId }, data: { status: input.status } });
  await writeAuditLog({
    userId: admin.id,
    action: "UPDATE",
    entity: "User",
    entityId: input.userId,
    metadata: { status: input.status },
  });
  revalidatePath("/admin/users");
  revalidatePath("/admin/business-owners");
  return { ok: true };
}

export async function setUserRole(input: { userId: string; role: RoleName; grant: boolean }): Promise<ActionResult> {
  const admin = await requireAdmin();
  const role = await prisma.role.findUnique({ where: { name: input.role } });
  if (!role) return { ok: false, error: "Role not found" };

  if (input.grant) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: input.userId, roleId: role.id } },
      update: {},
      create: { userId: input.userId, roleId: role.id },
    });
  } else {
    await prisma.userRole.deleteMany({ where: { userId: input.userId, roleId: role.id } });
  }

  await writeAuditLog({
    userId: admin.id,
    action: input.grant ? "CREATE" : "DELETE",
    entity: "UserRole",
    entityId: input.userId,
    metadata: { role: input.role },
  });
  revalidatePath("/admin/users");
  revalidatePath("/admin/business-owners");
  return { ok: true };
}

export async function processDeletionRequest(input: { userId: string; action: "PROCESSED" | "CANCELLED" }): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (input.action === "PROCESSED") {
    await prisma.$transaction([
      prisma.user.update({ where: { id: input.userId }, data: { status: "DELETED" } }),
      prisma.accountDeletionRequest.update({
        where: { userId: input.userId },
        data: { status: "PROCESSED", processedAt: new Date() },
      }),
    ]);
  } else {
    await prisma.accountDeletionRequest.update({
      where: { userId: input.userId },
      data: { status: "CANCELLED", processedAt: new Date() },
    });
  }

  await writeAuditLog({
    userId: admin.id,
    action: input.action === "PROCESSED" ? "DELETE" : "REJECT",
    entity: "AccountDeletionRequest",
    entityId: input.userId,
  });
  revalidatePath("/admin/users");
  return { ok: true };
}

// ------------------------------------------------------------
// Businesses
// ------------------------------------------------------------

export async function setBusinessStatus(input: { businessId: string; status: "ACTIVE" | "SUSPENDED" | "CLOSED" }): Promise<ActionResult> {
  const admin = await requireAdmin();
  await prisma.business.update({ where: { id: input.businessId }, data: { status: input.status } });
  await writeAuditLog({
    userId: admin.id,
    action: "UPDATE",
    entity: "Business",
    entityId: input.businessId,
    metadata: { status: input.status },
  });
  revalidatePath("/admin/businesses");
  return { ok: true };
}

// ------------------------------------------------------------
// Catalog
// ------------------------------------------------------------

export async function createCategory(input: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  try {
    await prisma.category.create({ data: { ...parsed.data } });
  } catch {
    return { ok: false, error: "Slug already exists" };
  }
  await writeAuditLog({ userId: admin.id, action: "CREATE", entity: "Category" });
  revalidatePath("/admin/categories");
  return { ok: true };
}

export async function toggleCategory(categoryId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) return { ok: false, error: "Category not found" };
  await prisma.category.update({ where: { id: categoryId }, data: { isActive: !category.isActive } });
  await writeAuditLog({ userId: admin.id, action: "UPDATE", entity: "Category", entityId: categoryId });
  revalidatePath("/admin/categories");
  return { ok: true };
}

export async function deleteCategory(categoryId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  try {
    await prisma.category.delete({ where: { id: categoryId } });
  } catch {
    return { ok: false, error: "Cannot delete: category is in use" };
  }
  await writeAuditLog({ userId: admin.id, action: "DELETE", entity: "Category", entityId: categoryId });
  revalidatePath("/admin/categories");
  return { ok: true };
}

export async function createCountry(input: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = countrySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  try {
    await prisma.country.create({ data: { ...parsed.data } });
  } catch {
    return { ok: false, error: "Country code already exists" };
  }
  await writeAuditLog({ userId: admin.id, action: "CREATE", entity: "Country" });
  revalidatePath("/admin/countries");
  return { ok: true };
}

export async function createCity(input: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = citySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  await prisma.city.create({ data: { ...parsed.data } });
  await writeAuditLog({ userId: admin.id, action: "CREATE", entity: "City" });
  revalidatePath("/admin/cities");
  return { ok: true };
}

export async function toggleLanguage(code: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  const language = await prisma.language.findUnique({ where: { code } });
  if (!language) return { ok: false, error: "Language not found" };
  await prisma.language.update({ where: { code }, data: { isActive: !language.isActive } });
  await writeAuditLog({ userId: admin.id, action: "UPDATE", entity: "Language", entityId: code });
  revalidatePath("/admin/languages");
  return { ok: true };
}

// ------------------------------------------------------------
// Coupons
// ------------------------------------------------------------

export async function createCoupon(input: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = couponSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const data = parsed.data;
  try {
    await prisma.coupon.create({
      data: {
        code: data.code,
        type: data.type,
        scope: data.scope,
        value: data.value,
        maxUses: data.maxUses ?? undefined,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });
  } catch {
    return { ok: false, error: "Coupon code already exists" };
  }
  await writeAuditLog({ userId: admin.id, action: "CREATE", entity: "Coupon" });
  revalidatePath("/admin/coupons");
  return { ok: true };
}

export async function toggleCoupon(couponId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
  if (!coupon) return { ok: false, error: "Coupon not found" };
  await prisma.coupon.update({ where: { id: couponId }, data: { isActive: !coupon.isActive } });
  await writeAuditLog({ userId: admin.id, action: "UPDATE", entity: "Coupon", entityId: couponId });
  revalidatePath("/admin/coupons");
  return { ok: true };
}

// ------------------------------------------------------------
// Permissions
// ------------------------------------------------------------

export async function togglePermission(input: { roleId: string; permissionKey: string; grant: boolean }): Promise<ActionResult> {
  const admin = await requireAdmin();
  const permission = await prisma.permission.findUnique({ where: { key: input.permissionKey } });
  if (!permission) return { ok: false, error: "Permission not found" };

  if (input.grant) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: input.roleId, permissionId: permission.id } },
      update: {},
      create: { roleId: input.roleId, permissionId: permission.id },
    });
  } else {
    await prisma.rolePermission.deleteMany({
      where: { roleId: input.roleId, permissionId: permission.id },
    });
  }

  await writeAuditLog({
    userId: admin.id,
    action: input.grant ? "CREATE" : "DELETE",
    entity: "RolePermission",
    metadata: { roleId: input.roleId, permission: input.permissionKey },
  });
  revalidatePath("/admin/roles");
  revalidatePath("/admin/permissions");
  return { ok: true };
}

// ------------------------------------------------------------
// Settings (global / AI)
// ------------------------------------------------------------

export async function saveGlobalSettings(input: Record<string, string>): Promise<ActionResult> {
  const admin = await requireAdmin();
  for (const [key, value] of Object.entries(input)) {
    const existing = await prisma.setting.findFirst({
      where: { key, scope: "GLOBAL", userId: null, businessId: null },
    });
    if (existing) {
      await prisma.setting.update({ where: { id: existing.id }, data: { value: { value } } });
    } else {
      await prisma.setting.create({ data: { key, value: { value }, scope: "GLOBAL" } });
    }
  }
  await writeAuditLog({ userId: admin.id, action: "UPDATE", entity: "Setting" });
  revalidatePath("/admin/settings");
  revalidatePath("/admin/ai-settings");
  return { ok: true };
}

// ------------------------------------------------------------
// Notifications broadcast
// ------------------------------------------------------------

export async function broadcastNotification(input: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = broadcastSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const where = {
    ALL: undefined,
    CUSTOMERS: { roles: { some: { role: { name: RoleName.CUSTOMER } } } },
    BUSINESS_OWNERS: { roles: { some: { role: { name: RoleName.BUSINESS_OWNER } } } },
  }[parsed.data.audience];

  const users = await prisma.user.findMany({
    where,
    select: { id: true },
  });

  await prisma.notification.createMany({
    data: users.map((u) => ({
      userId: u.id,
      type: parsed.data.type,
      title: parsed.data.title,
      body: parsed.data.body,
    })),
  });

  await writeAuditLog({
    userId: admin.id,
    action: "CREATE",
    entity: "Notification",
    metadata: { audience: parsed.data.audience, recipients: users.length },
  });
  revalidatePath("/admin/notifications");
  return { ok: true };
}
