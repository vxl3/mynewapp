import { prisma } from "@/lib/prisma";

/**
 * First-run provisioning for serverless deployments.
 *
 * When the app starts with an empty database, it seeds roles, permissions,
 * categories and the super-admin account automatically. Idempotent: once the
 * `roles` table is populated the hook is a no-op. Cached per server instance.
 */

let seeded: Promise<void> | null = null;

export function ensureSeeded(): Promise<void> {
  if (!seeded) {
    seeded = run();
  }
  return seeded;
}

async function run(): Promise<void> {
  try {
    const roleCount = await prisma.role.count();
    if (roleCount > 0) return;

    const { seedDatabase } = await import("@/lib/seed-database");
    await seedDatabase();
    console.log("🌱 [bootstrap] database provisioned with default roles & admin");
  } catch (error) {
    // Provisioning must never take down the app; surface for the operator.
    console.error("[bootstrap] failed to provision database", error);
  }
}
