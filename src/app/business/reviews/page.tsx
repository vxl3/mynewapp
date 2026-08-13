"use client";

import { Star } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export default function Page() {
  return <ModulePage icon={Star} titleKey="dashboard.business.reviews" />;
}
