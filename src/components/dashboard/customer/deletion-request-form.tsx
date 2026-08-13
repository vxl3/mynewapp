"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cancelDeletion, requestDeletion } from "@/lib/actions/profile";

export function DeletionRequestForm({
  status,
  reason,
}: {
  status: string | null;
  reason: string | null;
}) {
  const [input, setInput] = useState(reason ?? "");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    const result = await requestDeletion({ reason: input });
    setBusy(false);
    if (result.ok) toast.success("تم إرسال طلب الحذف للمراجعة");
    else toast.error(result.error);
  }

  async function cancel() {
    setBusy(true);
    await cancelDeletion();
    setBusy(false);
    toast.success("تم إلغاء طلب الحذف");
  }

  if (status === "PENDING") {
    return (
      <Alert variant="warning">
        <AlertDescription className="flex flex-col gap-3">
          <span>لديك طلب حذف قيد المراجعة. سيتم تنفيذه من قبل مدير النظام.</span>
          <Button variant="outline" size="sm" className="self-start" onClick={cancel} disabled={busy}>
            إلغاء الطلب
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        حذف الحساب نهائي ولا يمكن التراجع عنه. يمكنك كتابة سبب الطلب (اختياري).
      </p>
      <Textarea rows={3} value={input} onChange={(e) => setInput(e.target.value)} placeholder="سبب طلب الحذف (اختياري)" />
      <Button variant="destructive" onClick={submit} disabled={busy}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        طلب حذف الحساب
      </Button>
    </div>
  );
}
