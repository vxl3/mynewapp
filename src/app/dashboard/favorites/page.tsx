"use client";

import { Heart } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export default function Page() {
  return <ModulePage icon={Heart} titleKey="dashboard.customer.favorites" />;
}
