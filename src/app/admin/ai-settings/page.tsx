import { Bot } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { RoleName } from "@/config/roles";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AiSettingsForm } from "@/components/admin/settings-forms";

export const dynamic = "force-dynamic";

const DEFAULTS: Record<string, string> = {
  "ai.enableAutoReply": "false",
  "ai.enableRecommendations": "false",
  "ai.enableChatAssistant": "false",
  "ai.defaultTone": "professional",
  "ai.systemPrompt": "",
};

export default async function AdminAiSettingsPage() {
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
      <PageHeader
        title="إعدادات الذكاء الاصطناعي"
        description="جهّز البنية التحتية لميزات الذكاء الاصطناعي القادمة."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" /> الميزات الذكية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AiSettingsForm initial={initial} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الميزات المخطط لها</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              "الردود التلقائية على رسائل العملاء",
              "توصيات الحجز الذكية",
              "توصيات العروض والخصومات",
              "مساعد محادثة ذكي",
              "تحليلات تنبؤية للأداء",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 rounded-lg border p-3">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {feature}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
