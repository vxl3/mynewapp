"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { writeAuditLog } from "@/lib/audit";
import { businessSchema, branchSchema, workingHoursSchema } from "@/lib/validations";
import type { ActionResult } from "@/lib/actions/profile";

const emptyToUndefined = (v: string | undefined | null) => (v && v.trim() ? v.trim() : undefined);

/** Ensure the caller is a business owner. */
async function requireBusinessOwner() {
  return requireRole(RoleName.BUSINESS_OWNER);
}

/** Create or update a business owned by the authenticated user. */
export async function upsertBusiness(input: unknown): Promise<{ ok: true; id?: string } | { ok: false; error: string }> {
  const user = await requireBusinessOwner();
  const parsed = businessSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;

  try {
    if (data.id) {
      const business = await prisma.business.update({
        where: { id: data.id, ownerId: user.id },
        data: {
          name: data.name,
          nameAr: emptyToUndefined(data.nameAr),
          slug: data.slug,
          description: emptyToUndefined(data.description),
          categoryId: emptyToUndefined(data.categoryId),
          countryId: emptyToUndefined(data.countryId),
          cityId: emptyToUndefined(data.cityId),
          phone: emptyToUndefined(data.phone),
          email: emptyToUndefined(data.email),
          website: emptyToUndefined(data.website),
          address: emptyToUndefined(data.address),
          logoUrl: emptyToUndefined(data.logoUrl),
          coverUrl: emptyToUndefined(data.coverUrl),
        },
      });
      await writeAuditLog({ userId: user.id, action: "UPDATE", entity: "Business", entityId: business.id });
      revalidatePath("/business");
      revalidatePath("/business/profile");
      revalidatePath("/business/my-businesses");
      return { ok: true, id: business.id };
    }

    const business = await prisma.business.create({
      data: {
        ownerId: user.id,
        name: data.name,
        nameAr: emptyToUndefined(data.nameAr),
        slug: data.slug,
        description: emptyToUndefined(data.description),
        categoryId: emptyToUndefined(data.categoryId),
        countryId: emptyToUndefined(data.countryId),
        cityId: emptyToUndefined(data.cityId),
        phone: emptyToUndefined(data.phone),
        email: emptyToUndefined(data.email),
        website: emptyToUndefined(data.website),
        address: emptyToUndefined(data.address),
        logoUrl: emptyToUndefined(data.logoUrl),
        coverUrl: emptyToUndefined(data.coverUrl),
      },
    });
    await writeAuditLog({ userId: user.id, action: "CREATE", entity: "Business", entityId: business.id });
    revalidatePath("/business");
    revalidatePath("/business/profile");
    revalidatePath("/business/my-businesses");
    return { ok: true, id: business.id };
  } catch (error) {
    const code = (error as { code?: string }).code;
    const message = code === "P2002" ? "This slug is already in use" : "Could not save business";
    return { ok: false, error: message };
  }
}

/** Create a branch for a business the user owns. */
export async function createBranch(input: unknown): Promise<ActionResult> {
  const user = await requireBusinessOwner();
  const parsed = branchSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const businessId = (input as { businessId?: string }).businessId;
  if (!businessId) return { ok: false, error: "Business is required" };

  const business = await prisma.business.findFirst({ where: { id: businessId, ownerId: user.id } });
  if (!business) return { ok: false, error: "Business not found" };

  const data = parsed.data;
  await prisma.branch.create({
    data: {
      businessId,
      name: data.name,
      nameAr: emptyToUndefined(data.nameAr),
      address: emptyToUndefined(data.address),
      phone: emptyToUndefined(data.phone),
      cityId: emptyToUndefined(data.cityId),
      isMain: data.isMain,
    },
  });

  revalidatePath("/business/branches");
  return { ok: true };
}

/** Update a branch owned by the user. */
export async function updateBranch(input: unknown): Promise<ActionResult> {
  const user = await requireBusinessOwner();
  const parsed = branchSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  if (!parsed.data.id) return { ok: false, error: "Branch id is required" };

  const branch = await prisma.branch.findFirst({ where: { id: parsed.data.id }, include: { business: true } });
  if (!branch || branch.business.ownerId !== user.id) return { ok: false, error: "Branch not found" };

  const data = parsed.data;
  await prisma.branch.update({
    where: { id: branch.id },
    data: {
      name: data.name,
      nameAr: emptyToUndefined(data.nameAr),
      address: emptyToUndefined(data.address),
      phone: emptyToUndefined(data.phone),
      cityId: emptyToUndefined(data.cityId),
      isMain: data.isMain,
    },
  });

  revalidatePath("/business/branches");
  return { ok: true };
}

/** Delete a branch owned by the user. */
export async function deleteBranch(branchId: string): Promise<ActionResult> {
  const user = await requireBusinessOwner();
  const branch = await prisma.branch.findFirst({ where: { id: branchId }, include: { business: true } });
  if (!branch || branch.business.ownerId !== user.id) return { ok: false, error: "Branch not found" };

  await prisma.branch.delete({ where: { id: branchId } });
  revalidatePath("/business/branches");
  return { ok: true };
}

/** Persist weekly working hours for a business. */
export async function saveWorkingHours(input: unknown): Promise<ActionResult> {
  const user = await requireBusinessOwner();
  const parsed = workingHoursSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid hours" };

  const { businessId, hours } = parsed.data;
  const business = await prisma.business.findFirst({ where: { id: businessId, ownerId: user.id } });
  if (!business) return { ok: false, error: "Business not found" };

  await prisma.$transaction(
    hours.map((hour) =>
      prisma.businessHour.upsert({
        where: {
          id: `${businessId}-${hour.dayOfWeek}`,
        },
        update: {
          opensAt: hour.opensAt,
          closesAt: hour.closesAt,
          isClosed: hour.isClosed,
        },
        create: {
          id: `${businessId}-${hour.dayOfWeek}`,
          businessId,
          dayOfWeek: hour.dayOfWeek,
          opensAt: hour.opensAt,
          closesAt: hour.closesAt,
          isClosed: hour.isClosed,
        },
      })
    )
  );

  revalidatePath("/business/hours");
  return { ok: true };
}

/** Persist per-business preference toggles (scope BUSINESS). */
export async function saveBusinessSettings(input: {
  businessId: string;
  values: Record<string, string>;
}): Promise<ActionResult> {
  const user = await requireBusinessOwner();
  const business = await prisma.business.findFirst({
    where: { id: input.businessId, ownerId: user.id },
  });
  if (!business) return { ok: false, error: "Business not found" };

  for (const [key, value] of Object.entries(input.values)) {
    const existing = await prisma.setting.findFirst({
      where: { key, scope: "BUSINESS", userId: null, businessId: business.id },
    });
    if (existing) {
      await prisma.setting.update({ where: { id: existing.id }, data: { value: { value } } });
    } else {
      await prisma.setting.create({
        data: { key, value: { value }, scope: "BUSINESS", businessId: business.id },
      });
    }
  }

  revalidatePath("/business/settings");
  return { ok: true };
}
