import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { RoleName, rolePermissions, roleHome, type PermissionKey } from "@/config/roles";

/** Returns the authenticated session user, or null for guests. */
export async function getSessionUser() {
  const session = await auth();
  return session?.user ?? null;
}

/** Resolve the dashboard home path for a given role. */
export function getRoleHome(role?: string | null): string {
  return roleHome(role);
}

/** Require an authenticated user; redirects guests to sign-in. */
export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

/** Require a specific role; redirects insufficient roles to /403. */
export async function requireRole(role: RoleName) {
  const user = await requireUser();
  if (user.role !== role) redirect("/403");
  return user;
}

/** Require one of several roles; redirects others to /403. */
export async function requireAnyRole(roles: RoleName[]) {
  const user = await requireUser();
  if (!roles.includes(user.role as RoleName)) redirect("/403");
  return user;
}

/** Check whether the authenticated user holds a permission. */
export async function userHasPermission(permission: PermissionKey): Promise<boolean> {
  const user = await getSessionUser();
  if (!user?.role) return false;
  return rolePermissions[user.role]?.includes(permission) ?? false;
}
