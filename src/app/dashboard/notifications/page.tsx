import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";
import { PageHeader } from "@/components/ui/page-header";
import { NotificationsList } from "@/components/dashboard/customer/notifications-list";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await requireUser();

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, type: true, title: true, body: true, isRead: true, createdAt: true },
  });

  return (
    <div className="space-y-8">
      <PageHeader title="الإشعارات" description="كل التنبيهات الخاصة بحسابك." />
      <NotificationsList
        initial={notifications.map((n) => ({ ...n, createdAt: n.createdAt.toISOString() }))}
      />
    </div>
  );
}
