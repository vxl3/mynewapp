/**
 * احجزلي — database seed (minimal, deterministic bootstrap data).
 * Creates roles, permissions, default categories, languages, countries,
 * cities and a locked-down seed super-admin account.
 *
 * Run with: npm run db:seed
 */
import { PrismaClient, RoleName, UserStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const PERMISSIONS = [
  // Customer
  ["bookings:create", "Create a booking"],
  ["bookings:read", "Read own bookings"],
  ["bookings:cancel", "Cancel own bookings"],
  ["reviews:create", "Create reviews"],
  ["messages:send", "Send messages"],
  // Business owner
  ["business:manage", "Manage business profile"],
  ["services:manage", "Manage services"],
  ["employees:manage", "Manage employees"],
  ["schedule:manage", "Manage schedule"],
  ["bookings:manage", "Manage incoming bookings"],
  ["gallery:manage", "Manage gallery"],
  ["subscription:manage", "Manage subscription"],
  ["analytics:view", "View analytics"],
  // Super admin
  ["admin:users", "Manage users"],
  ["admin:businesses", "Manage businesses"],
  ["admin:categories", "Manage categories"],
  ["admin:subscriptions", "Manage subscriptions"],
  ["admin:coupons", "Manage coupons"],
  ["admin:settings", "Manage global settings"],
  ["admin:reports", "Access reports"],
  ["admin:audit", "Access audit logs"],
  ["admin:permissions", "Manage permissions"],
  ["admin:ai", "Manage AI settings"],
  ["admin:notifications", "Send notifications"],
] as const;

const ROLE_PERMISSIONS: Record<RoleName, string[]> = {
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
  [RoleName.SUPER_ADMIN]: PERMISSIONS.map(([key]) => key),
};

const CATEGORIES = [
  ["Hair Salons", "صالونات الحلاقة", "hair-salons", "scissors"],
  ["Beauty Centers", "مراكز التجميل", "beauty-centers", "sparkles"],
  ["Clinics", "العيادات", "clinics", "stethoscope"],
  ["Football Fields", "ملاعب كرة القدم", "football-fields", "trophy"],
  ["Wedding Halls", "قاعات الأفراح", "wedding-halls", "party-popper"],
  ["Gyms", "الصالات الرياضية", "gyms", "dumbbell"],
  ["Car Services", "خدمات السيارات", "car-services", "car"],
  ["Photography", "التصوير", "photography", "camera"],
  ["Training Centers", "مراكز التدريب", "training-centers", "graduation-cap"],
  ["Government Appointments", "المواعيد الحكومية", "government-appointments", "landmark"],
  ["Restaurants", "المطاعم", "restaurants", "utensils"],
  ["Hotels", "الفنادق", "hotels", "hotel"],
] as const;

async function main() {
  console.log("🌱 Seeding احجزلي database…");

  // --- Permissions ---
  for (const [key, name] of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key },
      update: { name },
      create: { key, name },
    });
  }

  // --- Roles + role→permission links ---
  for (const roleName of Object.values(RoleName)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName, description: `${roleName} role` },
    });

    const keys = ROLE_PERMISSIONS[roleName] ?? [];
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    for (const key of keys) {
      const permission = await prisma.permission.findUnique({ where: { key } });
      if (permission) {
        await prisma.rolePermission.create({
          data: { roleId: role.id, permissionId: permission.id },
        });
      }
    }
  }

  // --- Languages ---
  await prisma.language.upsert({
    where: { code: "ar" },
    update: {},
    create: { code: "ar", name: "Arabic", nameNative: "العربية", dir: "rtl", isDefault: true },
  });
  await prisma.language.upsert({
    where: { code: "en" },
    update: {},
    create: { code: "en", name: "English", nameNative: "English", dir: "ltr" },
  });

  // --- Countries & cities ---
  const iq = await prisma.country.upsert({
    where: { code: "IQ" },
    update: {},
    create: {
      code: "IQ",
      name: "Iraq",
      nameAr: "العراق",
      phoneCode: "+964",
      currency: "IQD",
    },
  });

  for (const [name, nameAr] of [
    ["Baghdad", "بغداد"],
    ["Basra", "البصرة"],
    ["Erbil", "أربيل"],
    ["Mosul", "الموصل"],
    ["Najaf", "النجف"],
    ["Karbala", "كربلاء"],
    ["Ramadi", "الرمادي"],
  ] as const) {
    await prisma.city.upsert({
      where: { id: `${iq.id}-${name}` },
      update: {},
      create: { id: `${iq.id}-${name}`, countryId: iq.id, name, nameAr },
    });
  }

  // --- Categories ---
  for (const [name, nameAr, slug, icon] of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, nameAr, slug, icon },
    });
  }

  // --- Seed super-admin (email: admin@ahjezli.app / password: Admin@123456) ---
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin@123456";
  const adminRole = await prisma.role.findUnique({ where: { name: RoleName.SUPER_ADMIN } });
  const admin = await prisma.user.upsert({
    where: { email: "admin@ahjezli.app" },
    update: {},
    create: {
      email: "admin@ahjezli.app",
      passwordHash: await hash(adminPassword, 12),
      name: "Super Admin",
      firstName: "Super",
      lastName: "Admin",
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      preferredLanguage: "ar",
    },
  });

  if (adminRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
      update: {},
      create: { userId: admin.id, roleId: adminRole.id },
    });
  }

  console.log("✅ Seed complete.");
  console.log("   Super admin → admin@ahjezli.app / Admin@123456 (change immediately in production)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
