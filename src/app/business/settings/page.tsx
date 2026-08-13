import { Settings2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { BusinessSettingsForm } from "@/components/dashboard/business/business-settings-form";

export const dynamic = "force-dynamic";

export default async function BusinessSettingsPage() {
  const user = await requireAnyRole([RoleName.BUSINESS_OWNER, RoleName.SUPER_ADMIN]);

  const business = await prisma.business.findFirst({
    where: { ownerId: user.id },
    orderBy: { createdAt: "asc" },
    include: { settings: true },
  });

  if (!business) {
    return (
      <div className="space-y-8">
        <PageHeader title="الإعدادات" description="إعدادات نشاطك التجاري." />
        <EmptyState icon={Settings2} title="لا يوجد نشاط تجاري بعد" description="أنشئ نشاطك أولاً." />
      </div>
    );
  }

  const initial: Record<string, boolean> = {
    acceptNewBookings: true,
    autoConfirm: false,
    showPhone: true,
    sendReminders: true,
  };

  for (const setting of business.settings) {
    if (setting.key in initial) {
      initial[setting.key] = (setting.value as { value?: string }).value === "true";
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader title="الإعدادات" description={`إعدادات ${business.nameAr || business.name}.`} />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-primary" /> تفضيلات النشاط
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BusinessSettingsForm businessId={business.id} initial={initial} />
        </CardContent>
      </Card>
    </div>
  );
}
