"use client";

import { MessageSquare } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export default function Page() {
  return <ModulePage icon={MessageSquare} titleKey="dashboard.customer.messages" />;
}
