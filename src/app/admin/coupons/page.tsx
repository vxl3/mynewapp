"use client";

import { TicketPercent } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export default function Page() {
  return <ModulePage icon={TicketPercent} titleKey="dashboard.admin.coupons" />;
}
