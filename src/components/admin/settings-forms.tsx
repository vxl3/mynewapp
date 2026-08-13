"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { saveGlobalSettings } from "@/lib/actions/admin";

interface Field {
  key: string;
  label: string;
  type: "text" | "textarea" | "switch" | "number";
  placeholder?: string;
}

function SettingsForm({
  fields,
  initial,
  successMessage,
}: {
  fields: Field[];
  initial: Record<string, string>;
  successMessage: string;
}) {
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const result = await saveGlobalSettings(values);
    setSaving(false);
    if (result.ok) toast.success(successMessage);
    else toast.error(result.error);
  }

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.key} className="space-y-2">
          <Label>{field.label}</Label>
          {field.type === "textarea" ? (
            <Textarea
              rows={3}
              value={values[field.key] ?? ""}
              onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
            />
          ) : field.type === "switch" ? (
            <Switch
              checked={(values[field.key] ?? "false") === "true"}
              onCheckedChange={(checked) =>
                setValues((prev) => ({ ...prev, [field.key]: String(checked) }))
              }
            />
          ) : (
            <Input
              type={field.type === "number" ? "number" : "text"}
              dir="ltr"
              value={values[field.key] ?? ""}
              placeholder={field.placeholder}
              onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
            />
          )}
        </div>
      ))}
      <Button onClick={save} variant="gradient" disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        حفظ
      </Button>
    </div>
  );
}

export function SystemSettingsForm({ initial }: { initial: Record<string, string> }) {
  return (
    <SettingsForm
      initial={initial}
      successMessage="تم حفظ إعدادات النظام"
      fields={[
        { key: "siteName", label: "اسم المنصة", type: "text" },
        { key: "supportEmail", label: "البريد الداعم", type: "text" },
        { key: "maintenanceMode", label: "وضع الصيانة", type: "switch" },
        { key: "allowRegistration", label: "السماح بالتسجيل", type: "switch" },
        { key: "defaultCurrency", label: "العملة الافتراضية", type: "text" },
        { key: "maxBookingsPerDay", label: "الحد الأقصى للحجوزات يومياً", type: "number" },
      ]}
    />
  );
}

export function AiSettingsForm({ initial }: { initial: Record<string, string> }) {
  return (
    <SettingsForm
      initial={initial}
      successMessage="تم حفظ إعدادات الذكاء الاصطناعي"
      fields={[
        { key: "ai.enableAutoReply", label: "الردود التلقائية", type: "switch" },
        { key: "ai.enableRecommendations", label: "التوصيات الذكية", type: "switch" },
        { key: "ai.enableChatAssistant", label: "مساعد المحادثة", type: "switch" },
        { key: "ai.defaultTone", label: "نبرة الرد الافتراضية", type: "text", placeholder: "professional" },
        { key: "ai.systemPrompt", label: "تعليمات النظام (System Prompt)", type: "textarea" },
      ]}
    />
  );
}
