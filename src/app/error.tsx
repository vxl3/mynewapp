"use client";

import { TriangleAlert, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-mesh flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
        <TriangleAlert className="h-12 w-12" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">500 — حدث خطأ غير متوقع</h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          نعتذر عن هذا الخلل، يرجى إعادة المحاولة أو العودة للصفحة الرئيسية.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset} variant="gradient">
          <RefreshCcw className="h-4 w-4" />
          إعادة المحاولة
        </Button>
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="h-4 w-4" />
            الرئيسية
          </Link>
        </Button>
      </div>
    </div>
  );
}
