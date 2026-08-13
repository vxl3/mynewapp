"use client";

import { TriangleAlert, RefreshCcw, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  title?: string;
  description?: string;
  statusCode?: number;
  reset?: () => void;
}

/** Reusable error boundary page with retry + home actions. */
export function ErrorPage({ title, description, statusCode, reset }: ErrorPageProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="relative">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
          <TriangleAlert className="h-12 w-12" />
        </div>
        {statusCode && (
          <span className="absolute -top-2 -end-2 rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
            {statusCode}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold md:text-3xl">
          {title ?? t("errors.genericTitle")}
        </h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          {description ?? t("errors.genericDesc")}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {reset && (
          <Button variant="gradient" onClick={reset}>
            <RefreshCcw className="h-4 w-4" />
            {t("errors.tryAgain")}
          </Button>
        )}
        <Button variant="outline" onClick={() => router.back()}>
          {t("common.back")}
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/">
            <Home className="h-4 w-4" />
            {t("common.backHome")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
