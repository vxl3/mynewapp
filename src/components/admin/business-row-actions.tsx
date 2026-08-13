"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setBusinessStatus } from "@/lib/actions/admin";

const OPTIONS = [
  { value: "ACTIVE", label: "تفعيل" },
  { value: "SUSPENDED", label: "إيقاف" },
  { value: "CLOSED", label: "إغلاق" },
];

export function BusinessRowActions({ businessId, status }: { businessId: string; status: string }) {
  async function change(value: string) {
    const result = await setBusinessStatus({ businessId, status: value as "ACTIVE" | "SUSPENDED" | "CLOSED" });
    if (result.ok) toast.success("تم تحديث حالة النشاط");
    else toast.error(result.error);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">الحالة</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>تغيير الحالة</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {OPTIONS.filter((o) => o.value !== status).map((option) => (
          <DropdownMenuItem key={option.value} onSelect={() => change(option.value)}>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
