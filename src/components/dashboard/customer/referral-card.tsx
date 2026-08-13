"use client";

import { useState } from "react";
import { Copy, Check, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReferralCardProps {
  code: string;
  total: number;
  completed: number;
  link: string;
}

export function ReferralCard({ code, total, completed, link }: ReferralCardProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable; ignore.
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">رمز الإحالة الخاص بك</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <p className="flex-1 rounded-xl border bg-muted/50 p-4 text-center font-mono text-2xl font-bold tracking-widest">
              {code}
            </p>
            <Button onClick={copyLink} variant="outline">
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              {copied ? "تم النسخ" : "نسخ الرابط"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            شارك هذا الرابط مع أصدقائك واكسب مكافآت عند انضمامهم:
          </p>
          <p dir="ltr" className="rounded-lg bg-muted/50 p-3 text-center text-xs font-mono break-all">{link}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" /> إحصائيات الإحالة
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border p-4 text-center">
            <p className="text-3xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground">إجمالي المدعوين</p>
          </div>
          <div className="rounded-xl border p-4 text-center">
            <p className="text-3xl font-bold">{completed}</p>
            <p className="text-xs text-muted-foreground">انضمامات مكتملة</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
