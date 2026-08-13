"use client";

import { FileBarChart } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export default function Page() {
  return <ModulePage icon={FileBarChart} titleKey="dashboard.admin.reports" />;
}
