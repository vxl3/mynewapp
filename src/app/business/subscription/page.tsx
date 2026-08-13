"use client";

import { CreditCard } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export default function Page() {
  return <ModulePage icon={CreditCard} titleKey="dashboard.business.subscription" />;
}
