import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  await requireRole(RoleName.SUPER_ADMIN);

  const [totalUsers, activeUsers, totalBusinesses, totalBookings, bookingsByStatus, revenue] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.business.count(),
      prisma.booking.count(),
      prisma.booking.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.paymentRecord.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
    ]);

  return (
    <div className="space-y-8">
      <PageHeader title="التقارير" description="ملخص شامل لأداء المنصة." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="إجمالي المستخدمين" value={totalUsers} />
        <StatCard label="المستخدمون النشطون" value={activeUsers} />
        <StatCard label="الأنشطة التجارية" value={totalBusinesses} />
        <StatCard label="إجمالي الحجوزات" value={totalBookings} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>الحجوزات حسب الحالة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {bookingsByStatus.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">لا توجد حجوزات بعد</p>
            ) : (
              bookingsByStatus.map((group) => (
                <div key={group.status} className="flex items-center justify-between rounded-lg border p-3">
                  <StatusBadge status={group.status} />
                  <span className="font-bold">{group._count._all}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold">
              {Number(revenue._sum.amount ?? 0).toFixed(2)} <span className="text-base font-normal text-muted-foreground">USD</span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              مجموع المدفوعات الناجحة. تقارير مالية تفصيلية قادمة في المرحلة الثالثة.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
