"use client";

import type { LucideIcon } from "lucide-react";
import { Construction } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

interface ModulePlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Phase-1 module scaffold. Renders a polished header plus a skeleton grid,
 * signalling that business logic arrives in Phase 2 — without fake data.
 */
export function ModulePlaceholder({ icon: Icon, title, description }: ModulePlaceholderProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <PageHeader
        title={title}
        description={description}
        actions={<Badge variant="glass">{t("common.comingSoon")}</Badge>}
      />

      <EmptyState
        icon={Construction}
        title={title}
        description={t("common.underConstruction")}
        className="min-h-[220px]"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-2xl border p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-fuchsia-500/15">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
