"use client";

import { UserRound } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export default function Page() {
  return <ModulePage icon={UserRound} titleKey="dashboard.customer.profile" />;
}
