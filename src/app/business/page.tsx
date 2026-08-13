import Link from "next/link";
import { Building2, MapPin, Scissors, Users, Star, CalendarCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default async function BusinessOverviewPage() {
  const user = await requireAnyRole([RoleName.BUSINESS_OWNER, RoleName.SUPER_ADMIN]);

  const businesses = await prisma.business.findMany({
    where: { ownerId: user.id },
    select: { id: true, name: true, nameAr: true, status: true },
  });

  if (businesses.length === 0) {
    return (
      <div className="space-y-8">
        <PageHeader title="لوحة النشاط التجاري" description="أدر نشاطك التجاري من مكان واحد." />
        <EmptyState
          icon={Building2}
          title="لا يوجد نشاط تجاري بعد"
          description="ابدأ بإنشاء نشاطك التجاري لإدارة فروعه وخدماته وحجوزاته."
          actionLabel="إنشاء نشاط تجاري"
        />
      </div>
    );
  }

  const businessIds = businesses.map((b) => b.id);
  const [branches, services, employees, reviews, bookings] = await Promise.all([
    prisma.branch.count({ where: { businessId: { in: businessIds } } }),
    prisma.service.count({ where: { businessId: { in: businessIds } } }),
    prisma.employee.count({ where: { businessId: { in: businessIds } } }),
    prisma.review.count({ where: { businessId: { in: businessIds } } }),
    prisma.booking.count({ where: { businessId: { in: businessIds } } }),
  ]);

  const stats = [
    { icon: Building2, label: "نشاطات تجارية", value: businesses.length, href: "/business/my-businesses" },
    { icon: MapPin, label: "الفروع", value: branches, href: "/business/branches" },
    { icon: Scissors, label: "الخدمات", value: services, href: "/business/services" },
    { icon: Users, label: "الموظفون", value: employees, href: "/business/employees" },
    { icon: Star, label: "التقييمات", value: reviews, href: "/business/reviews" },
    { icon: CalendarCheck, label: "الحجوزات", value: bookings, href: "/business/bookings" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="لوحة النشاط التجاري" description="نظرة عامة على أنشطتك التجارية." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>نشاطاتي التجارية</CardTitle>
          <Button asChild size="sm" variant="outline">
            <Link href="/business/profile">إضافة نشاط جديد</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {businesses.map((business) => (
            <Link
              key={business.id}
              href={`/business/profile?businessId=${business.id}`}
              className="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-accent"
            >
              <span className="font-medium">{business.nameAr || business.name}</span>
              <span className="text-sm text-primary">إدارة ←</span>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
