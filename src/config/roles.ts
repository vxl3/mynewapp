/**
 * RBAC — role & permission definitions.
 * Single source of truth for authorization checks used by middleware,
 * API handlers and UI gating.
 */

export enum RoleName {
  CUSTOMER = "CUSTOMER",
  BUSINESS_OWNER = "BUSINESS_OWNER",
  SUPER_ADMIN = "SUPER_ADMIN",
}

/** Route prefixes each role is allowed to access. */
export const roleRouteMap: Record<RoleName, string[]> = {
  [RoleName.CUSTOMER]: ["/dashboard"],
  [RoleName.BUSINESS_OWNER]: ["/dashboard", "/business"],
  [RoleName.SUPER_ADMIN]: ["/dashboard", "/business", "/admin"],
};

/** Permission keys used across the platform. */
export const permissions = {
  // Customer
  "bookings:create": "Create a booking",
  "bookings:read": "Read own bookings",
  "bookings:cancel": "Cancel own bookings",
  "reviews:create": "Create reviews",
  "messages:send": "Send messages",
  // Business owner
  "business:manage": "Manage business profile",
  "services:manage": "Manage services",
  "employees:manage": "Manage employees",
  "schedule:manage": "Manage schedule",
  "bookings:manage": "Manage incoming bookings",
  "gallery:manage": "Manage gallery",
  "subscription:manage": "Manage subscription",
  "analytics:view": "View analytics",
  // Super admin
  "admin:users": "Manage users",
  "admin:businesses": "Manage businesses",
  "admin:categories": "Manage categories",
  "admin:subscriptions": "Manage subscriptions",
  "admin:coupons": "Manage coupons",
  "admin:settings": "Manage global settings",
  "admin:reports": "Access reports",
  "admin:audit": "Access audit logs",
  "admin:permissions": "Manage permissions",
  "admin:ai": "Manage AI settings",
  "admin:notifications": "Send notifications",
} as const;

export type PermissionKey = keyof typeof permissions;

export const rolePermissions: Record<RoleName, PermissionKey[]> = {
  [RoleName.CUSTOMER]: [
    "bookings:create",
    "bookings:read",
    "bookings:cancel",
    "reviews:create",
    "messages:send",
  ],
  [RoleName.BUSINESS_OWNER]: [
    "bookings:read",
    "messages:send",
    "business:manage",
    "services:manage",
    "employees:manage",
    "schedule:manage",
    "bookings:manage",
    "gallery:manage",
    "subscription:manage",
    "analytics:view",
  ],
  [RoleName.SUPER_ADMIN]: [
    "bookings:read",
    "messages:send",
    "business:manage",
    "analytics:view",
    "admin:users",
    "admin:businesses",
    "admin:categories",
    "admin:subscriptions",
    "admin:coupons",
    "admin:settings",
    "admin:reports",
    "admin:audit",
    "admin:permissions",
    "admin:ai",
    "admin:notifications",
  ],
};

/** Highest role for a set of roles (used to resolve UI precedence). */
export function resolvePrimaryRole(roles: string[]): RoleName | null {
  if (roles.includes(RoleName.SUPER_ADMIN)) return RoleName.SUPER_ADMIN;
  if (roles.includes(RoleName.BUSINESS_OWNER)) return RoleName.BUSINESS_OWNER;
  if (roles.includes(RoleName.CUSTOMER)) return RoleName.CUSTOMER;
  return null;
}

/** Dashboard home path for a given role (client- and server-safe). */
export function roleHome(role?: string | null): string {
  switch (role) {
    case RoleName.SUPER_ADMIN:
      return "/admin";
    case RoleName.BUSINESS_OWNER:
      return "/business";
    default:
      return "/dashboard";
  }
}
