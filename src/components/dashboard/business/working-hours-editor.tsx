"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { saveWorkingHours } from "@/lib/actions/business";

const DAY_NAMES = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

interface DayHour {
  dayOfWeek: number;
  opensAt: string;
  closesAt: string;
  isClosed: boolean;
}

export function WorkingHoursEditor({
  businessId,
  initial,
}: {
  businessId: string;
  initial: DayHour[];
}) {
  const [hours, setHours] = useState<DayHour[]>(() => {
    const map = new Map(initial.map((h) => [h.dayOfWeek, h]));
    return DAY_NAMES.map((_, dayOfWeek) => map.get(dayOfWeek) ?? { dayOfWeek, opensAt: "09:00", closesAt: "18:00", isClosed: false });
  });
  const [saving, setSaving] = useState(false);

  function update(index: number, patch: Partial<DayHour>) {
    setHours((prev) => prev.map((h, i) => (i === index ? { ...h, ...patch } : h)));
  }

  async function save() {
    setSaving(true);
    const result = await saveWorkingHours({ businessId, hours });
    setSaving(false);
    if (result.ok) toast.success("تم حفظ ساعات العمل");
    else toast.error(result.error);
  }

  return (
    <div className="space-y-4">
      {hours.map((hour, index) => (
        <div key={hour.dayOfWeek} className="flex flex-wrap items-center gap-3 rounded-xl border p-4">
          <span className="w-20 text-sm font-semibold">{DAY_NAMES[index]}</span>
          <Switch checked={!hour.isClosed} onCheckedChange={(open) => update(index, { isClosed: !open })} />
          {!hour.isClosed ? (
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <Input
                type="time"
                dir="ltr"
                className="w-32"
                value={hour.opensAt}
                onChange={(e) => update(index, { opensAt: e.target.value })}
              />
              <span className="text-muted-foreground">إلى</span>
              <Input
                type="time"
                dir="ltr"
                className="w-32"
                value={hour.closesAt}
                onChange={(e) => update(index, { closesAt: e.target.value })}
              />
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">مغلق</span>
          )}
        </div>
      ))}

      <Button onClick={save} variant="gradient" disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        حفظ ساعات العمل
      </Button>
    </div>
  );
}
