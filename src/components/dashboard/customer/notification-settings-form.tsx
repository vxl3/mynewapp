"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { updateNotificationSettings } from "@/lib/actions/profile";

interface NotificationSettingsFormProps {
  initial: { email: boolean; push: boolean; sms: boolean };
}

export function NotificationSettingsForm({ initial }: NotificationSettingsFormProps) {
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function save(next?: typeof settings) {
    const value = next ?? settings;
    setSaving(true);
    const result = await updateNotificationSettings(value);
    setSaving(false);
    if (result.ok) toast.success("تم حفظ الإعدادات");
    else toast.error(result.error);
  }

  const items = [
    { key: "email" as const, label: "إشعارات البريد الإلكتروني", desc: "استلام رسائل على بريدك الإلكتروني" },
    { key: "push" as const, label: "الإشعارات الفورية", desc: "تنبيهات داخل التطبيق" },
    { key: "sms" as const, label: "رسائل SMS", desc: "تنبيهات عبر الرسائل النصية" },
  ];

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.key} className="flex items-center justify-between rounded-xl border p-4">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
          <Switch
            checked={settings[item.key]}
            onCheckedChange={(checked) => {
              const next = { ...settings, [item.key]: checked };
              setSettings(next);
              void save(next);
            }}
          />
        </div>
      ))}
      <Button onClick={() => save()} disabled={saving}>
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        حفظ الإعدادات
      </Button>
    </div>
  );
}
