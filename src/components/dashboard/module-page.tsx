"use client";

import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ModulePlaceholder } from "@/components/dashboard/module-placeholder";

interface ModulePageProps {
  icon: LucideIcon;
  titleKey: string;
  descriptionKey?: string;
}

/** Thin wrapper binding a nav module to its translated labels. */
export function ModulePage({ icon, titleKey, descriptionKey }: ModulePageProps) {
  const { t } = useTranslation();
  return (
    <ModulePlaceholder
      icon={icon}
      title={t(titleKey)}
      description={t(descriptionKey ?? "common.underConstruction")}
    />
  );
}
