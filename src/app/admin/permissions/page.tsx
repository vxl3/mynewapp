"use client";

import { ShieldCheck } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export default function Page() {
  return <ModulePage icon={ShieldCheck} titleKey="dashboard.admin.permissions" />;
}
