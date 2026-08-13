import Link from "next/link";
import { Users, Building2, CalendarCheck, Tags, Wallet } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  await requireRole(RoleName.SUPER_ADMIN);

  const [users, businesses, bookings, categories, subscriptions, pendingBusinesses] = await Promise.all([
    prisma.user.count(),
    prisma.business.count(),
    prisma.booking.count(),
    prisma.category.count(),
    prisma.subscription.count(),
    prisma.business.count({ where: { status: "PENDING" } }),
  ]);

  const stats = [
    { icon: Users, label: "المستخدمون", value: users, href: "/admin/users" },
    { icon: Building2, label: "الأنشطة التجارية", value: businesses, href: "/admin/businesses" },
    { icon: CalendarCheck, label: "الحجوزات", value: bookings, href: "/admin/reports" },
    { icon: Tags, label: "التصنيفات", value: categories, href: "/admin/categories" },
    { icon: Wallet, label: "الاشتراكات", value: subscriptions, href: "/admin/subscriptions" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="لوحة الإدارة" description="نظرة عامة على المنصة بأكملها." />

      {pendingBusinesses > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
          لديك {pendingBusinesses} نشاط تجاري بانتظار المراجعة.{" "}
          <Link href="/admin/businesses" className="font-semibold underline">
            مراجعة الآن
          </Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="card-hover h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 to-fuchsia-500/15 text-primary">
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
