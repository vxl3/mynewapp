import { ShieldCheck, Smartphone, KeyRound, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PasswordChangeForm } from "@/components/dashboard/customer/password-change-form";
import { DeletionRequestForm } from "@/components/dashboard/customer/deletion-request-form";
import { RevokeDeviceButton } from "@/components/dashboard/customer/revoke-device-button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  const user = await requireUser();

  const [account, devices, sessionsCount, deletionRequest] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: { mfaEnabled: true },
    }),
    prisma.device.findMany({
      where: { userId: user.id },
      orderBy: { lastActiveAt: "desc" },
    }),
    prisma.session.count({ where: { userId: user.id } }),
    prisma.accountDeletionRequest.findUnique({ where: { userId: user.id } }),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader title="الأمان" description="إدارة كلمة المرور والأجهزة وحسابك." />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" /> تغيير كلمة المرور
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PasswordChangeForm />
          </CardContent>
        </Card>

        {/* MFA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> المصادقة الثنائية (2FA)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="text-sm font-medium">المصادقة الثنائية</p>
                <p className="text-xs text-muted-foreground">طبقة حماية إضافية لحسابك</p>
              </div>
              {account?.mfaEnabled ? (
                <Badge variant="success">مفعّلة</Badge>
              ) : (
                <Badge variant="secondary">قريباً</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              البنية التحتية للمصادقة الثنائية جاهزة، وسيتم تفعيل الإعداد الكامل في التحديث القادم.
            </p>
          </CardContent>
        </Card>

        {/* Devices */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-primary" /> الأجهزة والجلسات المتصلة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-xs text-muted-foreground">
              لديك {sessionsCount} جلسة نشطة و{devices.length} جهاز متصل بحسابك.
            </p>
            {devices.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">لا توجد أجهزة مسجلة بعد.</p>
            ) : (
              <div className="space-y-2">
                {devices.map((device) => (
                  <div key={device.id} className="flex items-center justify-between rounded-xl border p-4">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{device.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {device.ip ?? "IP غير معروف"} · آخر نشاط {formatDate(device.lastActiveAt)}
                        </p>
                      </div>
                    </div>
                    <RevokeDeviceButton deviceId={device.id} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete account */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-4 w-4" /> حذف الحساب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeletionRequestForm status={deletionRequest?.status ?? null} reason={deletionRequest?.reason ?? null} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
