import { TicketPercent } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CouponsPage() {
  await requireUser();

  const now = new Date();
  const coupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      scope: "PLATFORM",
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <PageHeader title="الكوبونات" description="خصومات متاحة لك على مستوى المنصة." />

      {coupons.length === 0 ? (
        <EmptyState icon={TicketPercent} title="لا توجد كوبونات نشطة حالياً" description="ستظهر الكوبونات المتاحة هنا." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {coupons.map((coupon) => (
            <Card key={coupon.id} className="card-hover overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-primary to-fuchsia-500" />
              <CardContent className="space-y-3 pt-5">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-lg font-bold tracking-wider">{coupon.code}</p>
                  <Badge variant="glass">
                    {coupon.type === "PERCENT" ? `${coupon.value}%` : `${coupon.value}$`}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {coupon.type === "PERCENT" ? "خصم نسبة مئوية" : "خصم مبلغ ثابت"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {coupon.expiresAt ? `ينتهي في ${formatDate(coupon.expiresAt)}` : "بدون تاريخ انتهاء"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
