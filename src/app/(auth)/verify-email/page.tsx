import type { Metadata } from "next";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Verify email" };

export default function VerifyEmailPage() {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-fuchsia-500/15 text-primary">
        <MailCheck className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">تحقق من بريدك الإلكتروني</h1>
        <p className="text-sm text-muted-foreground">
          أرسلنا رابط تفعيل إلى بريدك، يرجى التحقق منه لإكمال إنشاء حسابك.
        </p>
      </div>
      <Button asChild variant="outline" className="w-full">
        <Link href="/login">العودة لتسجيل الدخول</Link>
      </Button>
    </div>
  );
}
