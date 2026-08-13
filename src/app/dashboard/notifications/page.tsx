"use client";

import { Bell } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export default function Page() {
  return <ModulePage icon={Bell} titleKey="dashboard.customer.notifications" />;
}
