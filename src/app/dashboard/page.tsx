import { CalendarCheck, Bell, Heart, Gift, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CustomerOverviewPage() {
  const user = await requireUser();

  const [upcomingCount, unreadCount, favoriteCount, loyalty, recentNotifications, profile] =
    await Promise.all([
      prisma.booking.count({
        where: { customerId: user.id, status: { in: ["PENDING", "CONFIRMED"] }, startAt: { gte: new Date() } },
      }),
      prisma.notification.count({ where: { userId: user.id, isRead: false } }),
      prisma.favorite.count({ where: { userId: user.id } }),
      prisma.loyaltyAccount.findUnique({ where: { userId: user.id } }),
      prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, createdAt: true, isRead: true },
      }),
      prisma.user.findUnique({
        where: { id: user.id },
        select: { firstName: true, name: true },
      }),
    ]);

  const firstName = profile?.firstName ?? profile?.name?.split(" ")[0] ?? "";

  const stats = [
    { icon: CalendarCheck, label: "حجوزات قادمة", value: upcomingCount, href: "/dashboard/bookings" },
    { icon: Bell, label: "إشعارات غير مقروءة", value: unreadCount, href: "/dashboard/notifications" },
    { icon: Heart, label: "المفضلة", value: favoriteCount, href: "/dashboard/favorites" },
    { icon: Gift, label: "نقاط الولاء", value: loyalty?.pointsBalance ?? 0, href: "/dashboard/loyalty" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`مرحباً، ${firstName || "بك"} 👋`}
        description="نظرة عامة على حسابك وحجوزاتك."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>أحدث الإشعارات</CardTitle>
            <Link href="/dashboard/notifications" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              عرض الكل <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentNotifications.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">لا توجد إشعارات بعد</p>
            ) : (
              recentNotifications.map((notification) => (
                <div key={notification.id} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm">{notification.title}</span>
                  <div className="flex items-center gap-2">
                    {!notification.isRead && <Badge variant="default">جديد</Badge>}
                    <span className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>حجوزاتك القادمة</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingCount === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <CalendarCheck className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">لا توجد حجوزات قادمة حالياً</p>
                <Badge variant="secondary">نظام الحجز قادم في المرحلة الثالثة</Badge>
              </div>
            ) : (
              <Link href="/dashboard/bookings" className="text-sm font-medium text-primary hover:underline">
                عرض {upcomingCount} حجز قادم
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
