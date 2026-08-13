import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BroadcastForm } from "@/components/admin/broadcast-form";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  await requireRole(RoleName.SUPER_ADMIN);

  const [totalUsers, totalNotifications] = await Promise.all([
    prisma.user.count(),
    prisma.notification.count(),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader title="الإشعارات" description="أرسل إشعارات لجميع المستخدمين أو فئة معينة." />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">إجمالي المستخدمين</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">إشعارات مرسلة</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalNotifications}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>إرسال إشعار جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <BroadcastForm />
        </CardContent>
      </Card>
    </div>
  );
}
