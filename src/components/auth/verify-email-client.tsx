"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MailCheck, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api-client";

export function VerifyEmailClient({ token }: { token?: string }) {
  const [code, setCode] = useState(token ?? "");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  async function verify() {
    if (!code.trim()) {
      toast.error("أدخل رمز التحقق أولاً");
      return;
    }
    setVerifying(true);
    try {
      await apiFetch("/api/auth/verify-email", { method: "POST", body: { token: code.trim() } });
      setVerified(true);
      toast.success("تم تفعيل بريدك الإلكتروني بنجاح");
    } catch {
      toast.error("رمز التحقق غير صالح أو منتهي الصلاحية");
    } finally {
      setVerifying(false);
    }
  }

  if (verified) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">تم التحقق بنجاح</h1>
          <p className="text-sm text-muted-foreground">يمكنك الآن تسجيل الدخول إلى حسابك.</p>
        </div>
        <Button asChild variant="gradient" className="w-full">
          <Link href="/login">تسجيل الدخول</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-fuchsia-500/15 text-primary">
        <MailCheck className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">تحقق من بريدك الإلكتروني</h1>
        <p className="text-sm text-muted-foreground">
          أرسلنا رابط تفعيل إلى بريدك. الصق رمز التحقق هنا أو افتح الرابط مباشرة.
        </p>
      </div>

      <div className="space-y-2 text-start">
        <Label htmlFor="token">رمز التحقق</Label>
        <Input
          id="token"
          dir="ltr"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="رمز التحقق"
        />
      </div>

      <Button onClick={verify} variant="gradient" className="w-full" disabled={verifying}>
        {verifying && <Loader2 className="h-4 w-4 animate-spin" />}
        تفعيل البريد
      </Button>

      <Button asChild variant="ghost" className="w-full">
        <Link href="/login">العودة لتسجيل الدخول</Link>
      </Button>
    </div>
  );
}
