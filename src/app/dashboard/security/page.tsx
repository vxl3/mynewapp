"use client";

import { Lock } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export default function Page() {
  return <ModulePage icon={Lock} titleKey="dashboard.customer.security" />;
}
