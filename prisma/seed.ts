/**
 * احجزلي — database seed (CLI entry point).
 *
 * Delegates to the shared, idempotent bootstrap so the same logic powers
 * both `npm run db:seed` and the first-run provisioning hook.
 *
 * Run with: npm run db:seed
 */
import { prisma } from "../src/lib/prisma";
import { seedDatabase, SEED_ADMIN_EMAIL } from "../src/lib/seed-database";

async function main() {
  console.log("🌱 Seeding احجزلي database…");
  await seedDatabase();
  console.log("✅ Seed complete.");
  console.log(`   Super admin → ${SEED_ADMIN_EMAIL} / ${process.env.SEED_ADMIN_PASSWORD ?? "Admin@123456"} (change immediately in production)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
