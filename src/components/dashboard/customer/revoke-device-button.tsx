"use client";

import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { revokeDevice } from "@/lib/actions/profile";

export function RevokeDeviceButton({ deviceId }: { deviceId: string }) {
  return (
    <ConfirmDialog
      trigger={
        <Button variant="ghost" size="sm">
          <LogOut className="h-3.5 w-3.5" />
          تسجيل الخروج
        </Button>
      }
      title="تسجيل خروج الجهاز"
      description="سيتم تسجيل خروج هذا الجهاز من حسابك فوراً."
      confirmLabel="تسجيل الخروج"
      onConfirm={async () => {
        const result = await revokeDevice(deviceId);
        if (!result.ok) toast.error(result.error);
      }}
    />
  );
}
