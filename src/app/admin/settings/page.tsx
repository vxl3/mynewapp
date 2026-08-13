import { Settings2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SystemSettingsForm } from "@/components/admin/settings-forms";

export const dynamic = "force-dynamic";

const DEFAULTS: Record<string, string> = {
  siteName: "احجزلي",
  supportEmail: "support@ahjezli.app",
  maintenanceMode: "false",
  allowRegistration: "true",
  defaultCurrency: "USD",
  maxBookingsPerDay: "1000",
};

export default async function AdminSettingsPage() {
  await requireRole(RoleName.SUPER_ADMIN);

  const settings = await prisma.setting.findMany({ where: { scope: "GLOBAL" } });
  const initial = { ...DEFAULTS };
  for (const setting of settings) {
    if (setting.key in initial) {
      initial[setting.key] = (setting.value as { value?: string }).value ?? "";
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader title="إعدادات النظام" description="التحكم بإعدادات المنصة العامة." />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-primary" /> الإعدادات العامة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SystemSettingsForm initial={initial} />
        </CardContent>
      </Card>
    </div>
  );
}
