import Link from "next/link";
import { Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { WorkingHoursEditor } from "@/components/dashboard/business/working-hours-editor";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function WorkingHoursPage({
  searchParams,
}: {
  searchParams: Promise<{ businessId?: string }>;
}) {
  const user = await requireAnyRole([RoleName.BUSINESS_OWNER, RoleName.SUPER_ADMIN]);
  const { businessId } = await searchParams;

  const businesses = await prisma.business.findMany({
    where: { ownerId: user.id },
    select: { id: true, name: true, nameAr: true },
  });

  if (businesses.length === 0) {
    return (
      <div className="space-y-8">
        <PageHeader title="ساعات العمل" description="حدد ساعات عمل نشاطك." />
        <EmptyState icon={Clock} title="لا يوجد نشاط تجاري بعد" description="أنشئ نشاطك أولاً." />
      </div>
    );
  }

  const activeId = businessId ?? businesses[0].id;
  const hours = await prisma.businessHour.findMany({ where: { businessId: activeId } });

  return (
    <div className="space-y-8">
      <PageHeader title="ساعات العمل" description="حدد مواعيد فتح وإغلاق نشاطك لكل يوم." />

      {businesses.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {businesses.map((business) => (
            <Link key={business.id} href={`/business/hours?businessId=${business.id}`}>
              <Badge variant={business.id === activeId ? "default" : "secondary"} className={cn("cursor-pointer")}>
                {business.nameAr || business.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <WorkingHoursEditor
            businessId={activeId}
            initial={hours.map((h) => ({
              dayOfWeek: h.dayOfWeek,
              opensAt: h.opensAt,
              closesAt: h.closesAt,
              isClosed: h.isClosed,
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
