import { BarChart3, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function StatisticsPage() {
  const user = await requireAnyRole([RoleName.BUSINESS_OWNER, RoleName.SUPER_ADMIN]);

  const businessIds = (
    await prisma.business.findMany({ where: { ownerId: user.id }, select: { id: true } })
  ).map((b) => b.id);

  const [bookings, reviews, services, employees, avgRating] = await Promise.all([
    prisma.booking.count({ where: { businessId: { in: businessIds } } }),
    prisma.review.count({ where: { businessId: { in: businessIds } } }),
    prisma.service.count({ where: { businessId: { in: businessIds } } }),
    prisma.employee.count({ where: { businessId: { in: businessIds } } }),
    prisma.review.aggregate({ where: { businessId: { in: businessIds } }, _avg: { rating: true } }),
  ]);

  const cards = [
    { label: "إجمالي الحجوزات", value: bookings },
    { label: "التقييمات", value: reviews },
    { label: "متوسط التقييم", value: (avgRating._avg.rating ?? 0).toFixed(1) },
    { label: "الخدمات", value: services },
    { label: "الموظفون", value: employees },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="الإحصائيات"
        description="رؤى حول أداء نشاطك التجاري."
        actions={<Badge variant="glass">تحليلات متقدمة قادمة</Badge>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">{card.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> نشاط الحجوزات
          </CardTitle>
          <Badge variant="secondary">مخطط تفاعلي قادم</Badge>
        </CardHeader>
        <CardContent>
          <div className="flex h-56 items-end justify-between gap-3">
            {[40, 65, 35, 80, 55, 70, 90, 45, 60, 75, 50, 85].map((h, i) => (
              <div key={i} className="flex w-full flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-primary/25 to-fuchsia-500/25 transition-all hover:from-primary/40 hover:to-fuchsia-500/40"
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <BarChart3 className="h-4 w-4" />
        ستتوفر التحليلات التفصيلية (الإيرادات، معدلات الحضور، أفضل الخدمات) مع نظام الحجز في المرحلة الثالثة.
      </div>
    </div>
  );
}
