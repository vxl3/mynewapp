"use client";

import { Users } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export default function Page() {
  return <ModulePage icon={Users} titleKey="dashboard.admin.users" />;
}
