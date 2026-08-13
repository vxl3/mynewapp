"use client";

import { SearchX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-mesh flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary">
        <SearchX className="h-12 w-12" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">404 — الصفحة غير موجودة</h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.
        </p>
      </div>
      <Button asChild variant="gradient">
        <Link href="/">العودة إلى الرئيسية</Link>
      </Button>
    </div>
  );
}
