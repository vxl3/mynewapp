import { CreditCard, Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SubscriptionPage() {
  const user = await requireAnyRole([RoleName.BUSINESS_OWNER, RoleName.SUPER_ADMIN]);

  const [plans, subscription] = await Promise.all([
    prisma.plan.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.subscription.findFirst({
      where: { business: { ownerId: user.id } },
      include: { plan: true, business: { select: { name: true, nameAr: true } } },
    }),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader title="الاشتراك" description="أدر خطة اشتراك نشاطك التجاري." />

      {subscription ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              اشتراكك الحالي
            </CardTitle>
            <StatusBadge status={subscription.status} />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{subscription.plan.nameAr || subscription.plan.name}</p>
                <p className="text-sm text-muted-foreground">
                  {subscription.business.nameAr || subscription.business.name}
                </p>
              </div>
              <Badge variant="glass">
                {subscription.billingCycle === "MONTHLY" ? "شهري" : "سنوي"} ·{" "}
                {Number(subscription.plan.priceMonthly)} {subscription.plan.currency}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">لا يوجد اشتراك نشط حالياً.</p>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={cn("card-hover", subscription?.planId === plan.id && "ring-2 ring-primary")}>
            <CardHeader>
              <CardTitle>{plan.nameAr || plan.name}</CardTitle>
              <p className="text-3xl font-bold">
                ${Number(plan.priceMonthly)}
                <span className="text-sm font-normal text-muted-foreground">/شهرياً</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm">
                {[
                  `حتى ${plan.maxBranches} فرع`,
                  `حتى ${plan.maxEmployees} موظف`,
                  `حتى ${plan.maxServices} خدمة`,
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" /> {feature}
                  </li>
                ))}
              </ul>
              <Badge variant="secondary">الدفع والتفعيل قادم في المرحلة الثالثة</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
