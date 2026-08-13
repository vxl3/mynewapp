"use client";

import { CalendarDays } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export default function Page() {
  return <ModulePage icon={CalendarDays} titleKey="dashboard.business.schedule" />;
}
