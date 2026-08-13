"use client";

import { ShieldX } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { roleHome } from "@/config/roles";

export default function ForbiddenPage() {
  const { data: session } = useSession();
  const home = roleHome(session?.user?.role);

  return (
    <div className="bg-mesh flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
        <ShieldX className="h-12 w-12" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">403 — غير مصرح بالوصول</h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          ليس لديك صلاحية للوصول إلى هذه الصفحة. إذا كنت تعتقد أن هذا خطأ، تواصل مع مدير النظام.
        </p>
      </div>
      <Button asChild variant="gradient">
        <Link href={home}>العودة إلى لوحة التحكم</Link>
      </Button>
    </div>
  );
}
