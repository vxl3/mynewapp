"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { saveBusinessSettings } from "@/lib/actions/business";

interface BusinessSettingsFormProps {
  businessId: string;
  initial: Record<string, boolean>;
}

export function BusinessSettingsForm({ businessId, initial }: BusinessSettingsFormProps) {
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);

  const items = [
    { key: "acceptNewBookings", label: "استقبال حجوزات جديدة", desc: "السماح للعملاء بحجز مواعيد جديدة" },
    { key: "autoConfirm", label: "تأكيد تلقائي", desc: "تأكيد الحجوزات تلقائياً دون مراجعة" },
    { key: "showPhone", label: "إظهار رقم الهاتف", desc: "إظهار رقم الهاتف للعملاء" },
    { key: "sendReminders", label: "إرسال تذكيرات", desc: "تذكير العملاء بمواعيدهم" },
  ];

  async function save() {
    setSaving(true);
    const result = await saveBusinessSettings({
      businessId,
      values: Object.fromEntries(Object.entries(settings).map(([k, v]) => [k, String(v)])),
    });
    setSaving(false);
    if (result.ok) toast.success("تم حفظ الإعدادات");
    else toast.error(result.error);
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.key} className="flex items-center justify-between rounded-xl border p-4">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
          <Switch
            checked={settings[item.key] ?? false}
            onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, [item.key]: checked }))}
          />
        </div>
      ))}
      <Button onClick={save} disabled={saving}>
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        حفظ الإعدادات
      </Button>
    </div>
  );
}
