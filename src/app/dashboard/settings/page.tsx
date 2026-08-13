import Link from "next/link";
import { Settings2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NotificationSettingsForm } from "@/components/dashboard/customer/notification-settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUser();

  const account = await prisma.user.findUnique({
    where: { id: user.id },
    select: { preferredLanguage: true, preferredTheme: true, notificationSettings: true },
  });

  const raw = (account?.notificationSettings ?? { email: true, push: true, sms: false }) as {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };

  return (
    <div className="space-y-8">
      <PageHeader title="الإعدادات" description="تحكم في تفضيلاتك وإشعاراتك." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-primary" /> إعدادات الإشعارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NotificationSettingsForm
              initial={{ email: raw.email ?? true, push: raw.push ?? true, sms: raw.sms ?? false }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-primary" /> اللغة والمظهر
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="text-sm font-medium">اللغة المفضلة</p>
                <p className="text-xs text-muted-foreground">
                  {account?.preferredLanguage === "en" ? "English" : "العربية"}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/profile">تعديل</Link>
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="text-sm font-medium">المظهر المفضل</p>
                <p className="text-xs text-muted-foreground">
                  {account?.preferredTheme === "dark" ? "داكن" : account?.preferredTheme === "light" ? "فاتح" : "النظام"}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/profile">تعديل</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
