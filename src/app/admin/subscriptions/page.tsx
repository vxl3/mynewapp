import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { CreditCard } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminSubscriptionsPage() {
  await requireRole(RoleName.SUPER_ADMIN);

  const subscriptions = await prisma.subscription.findMany({
    orderBy: { createdAt: "desc" },
    include: { plan: true, business: { select: { name: true, nameAr: true } } },
  });

  return (
    <div className="space-y-8">
      <PageHeader title="الاشتراكات" description="جميع اشتراكات الأنشطة التجارية." />

      {subscriptions.length === 0 ? (
        <EmptyState icon={CreditCard} title="لا توجد اشتراكات بعد" description="ستظهر الاشتراكات هنا عندما تبدأ الأنشطة بالاشتراك." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-start text-xs uppercase text-muted-foreground">
                  <th className="p-4 text-start font-semibold">النشاط</th>
                  <th className="p-4 text-start font-semibold">الخطة</th>
                  <th className="p-4 text-start font-semibold">الدورة</th>
                  <th className="p-4 text-start font-semibold">الحالة</th>
                  <th className="p-4 text-start font-semibold">تاريخ البدء</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription) => (
                  <tr key={subscription.id} className="border-t">
                    <td className="p-4 font-medium">{subscription.business.nameAr || subscription.business.name}</td>
                    <td className="p-4">{subscription.plan.nameAr || subscription.plan.name}</td>
                    <td className="p-4">{subscription.billingCycle === "MONTHLY" ? "شهري" : "سنوي"}</td>
                    <td className="p-4">
                      <StatusBadge status={subscription.status} />
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {subscription.currentPeriodStart ? formatDate(subscription.currentPeriodStart) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
