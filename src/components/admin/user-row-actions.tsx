"use client";

import { toast } from "sonner";
import { ShieldPlus, ShieldMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setUserStatus, setUserRole } from "@/lib/actions/admin";
import { RoleName } from "@/config/roles";

interface UserRowActionsProps {
  userId: string;
  hasBusinessRole: boolean;
}

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "نشط" },
  { value: "SUSPENDED", label: "إيقاف" },
  { value: "LOCKED", label: "قفل" },
];

export function UserRowActions({ userId, hasBusinessRole }: UserRowActionsProps) {
  async function changeStatus(value: string) {
    const result = await setUserStatus({ userId, status: value as "ACTIVE" | "SUSPENDED" | "LOCKED" });
    if (result.ok) toast.success("تم تحديث حالة المستخدم");
    else toast.error(result.error);
  }

  async function toggleBusinessRole() {
    const result = await setUserRole({ userId, role: RoleName.BUSINESS_OWNER, grant: !hasBusinessRole });
    if (result.ok) toast.success(hasBusinessRole ? "تم إلغاء صلاحية صاحب النشاط" : "تم منح صلاحية صاحب نشاط");
    else toast.error(result.error);
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">الحالة</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>تغيير الحالة</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {STATUS_OPTIONS.map((option) => (
            <DropdownMenuItem key={option.value} onSelect={() => changeStatus(option.value)}>
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="ghost" size="sm" onClick={toggleBusinessRole}>
        {hasBusinessRole ? (
          <>
            <ShieldMinus className="h-3.5 w-3.5 text-destructive" /> إلغاء صاحب نشاط
          </>
        ) : (
          <>
            <ShieldPlus className="h-3.5 w-3.5 text-emerald-500" /> منح صاحب نشاط
          </>
        )}
      </Button>
    </div>
  );
}
