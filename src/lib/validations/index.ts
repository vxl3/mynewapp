import { z } from "zod";

/** Shared Zod schemas — used by both server actions and client forms. */

export const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[0-9]/, "Password must contain a number");

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(60),
  lastName: z.string().min(1, "Last name is required").max(60),
  phone: z.string().max(30).optional().or(z.literal("")),
  bio: z.string().max(500, "Bio is too long").optional().or(z.literal("")),
  address: z.string().max(200).optional().or(z.literal("")),
  countryId: z.string().optional().or(z.literal("")),
  cityId: z.string().optional().or(z.literal("")),
  avatarUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  preferredLanguage: z.enum(["ar", "en"]),
  preferredTheme: z.enum(["light", "dark", "system"]),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordField,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const notificationSettingsSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  sms: z.boolean(),
});

export const deletionRequestSchema = z.object({
  reason: z.string().max(500).optional().or(z.literal("")),
});

export const businessSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Business name is required").max(120),
  nameAr: z.string().max(120).optional().or(z.literal("")),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and dashes")
    .min(2)
    .max(120),
  description: z.string().max(2000).optional().or(z.literal("")),
  categoryId: z.string().optional().or(z.literal("")),
  countryId: z.string().optional().or(z.literal("")),
  cityId: z.string().optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  address: z.string().max(200).optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
  coverUrl: z.string().url().optional().or(z.literal("")),
});

export const branchSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Branch name is required").max(120),
  nameAr: z.string().max(120).optional().or(z.literal("")),
  address: z.string().max(200).optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  cityId: z.string().optional().or(z.literal("")),
  isMain: z.boolean().default(false),
});

export const workingHoursSchema = z.object({
  businessId: z.string().min(1),
  hours: z.array(
    z.object({
      dayOfWeek: z.number().int().min(0).max(6),
      opensAt: z.string().max(5),
      closesAt: z.string().max(5),
      isClosed: z.boolean(),
    })
  ),
});

export const categorySchema = z.object({
  name: z.string().min(2).max(120),
  nameAr: z.string().min(2).max(120),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and dashes")
    .min(2)
    .max(120),
  description: z.string().max(500).optional().or(z.literal("")),
  icon: z.string().max(60).optional().or(z.literal("")),
});

export const countrySchema = z.object({
  code: z.string().min(2).max(3).toUpperCase(),
  name: z.string().min(2).max(120),
  nameAr: z.string().min(2).max(120),
  phoneCode: z.string().max(10),
  currency: z.string().max(6),
});

export const citySchema = z.object({
  countryId: z.string().min(1, "Country is required"),
  name: z.string().min(2).max(120),
  nameAr: z.string().min(2).max(120),
});

export const couponSchema = z.object({
  code: z.string().min(2).max(40).toUpperCase(),
  type: z.enum(["PERCENT", "FIXED"]),
  scope: z.enum(["PLATFORM", "BUSINESS"]),
  value: z.coerce.number().positive(),
  maxUses: z.coerce.number().int().positive().optional().nullable(),
  expiresAt: z.string().optional().or(z.literal("")),
});

export const broadcastSchema = z.object({
  type: z.enum(["SYSTEM", "PROMOTION"]).default("SYSTEM"),
  title: z.string().min(2).max(120),
  body: z.string().min(2).max(2000),
  audience: z.enum(["ALL", "CUSTOMERS", "BUSINESS_OWNERS"]),
});

export const messageSchema = z.object({
  recipientId: z.string().min(1),
  subject: z.string().max(120).optional().or(z.literal("")),
  body: z.string().min(1).max(2000),
});
