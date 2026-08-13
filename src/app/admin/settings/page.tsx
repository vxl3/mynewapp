"use client";

import { Settings } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export default function Page() {
  return <ModulePage icon={Settings} titleKey="dashboard.admin.settings" />;
}
